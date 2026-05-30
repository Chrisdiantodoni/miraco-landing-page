"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Link } from "@/i18n/navigation";
import { getOrderDetail } from "@/lib/api/queries/member";
import Loading from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("dashboard");
  const { isAuthenticated } = useAuth();
  const { id } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: () => getOrderDetail(id),
    enabled: isAuthenticated && !!id,
  });

  const order = data?.data;

  return (
    <div className="dash-page-container">
      <Link
        href="/dashboard/orders"
        className="dash-order-view-btn"
        style={{ marginBottom: 20, display: "inline-flex" }}
      >
        &laquo; {t("order_back")}
      </Link>

      {isLoading ? (
        <Loading
          size="small"
          text={t("orders_loading")}
          image={image}
          imageSize={60}
        />
      ) : isError || !order ? (
        <div className="text-center py-5">
          <p>{t("orders_error")}</p>
        </div>
      ) : (
        <>
          <div className="dash-page-header">
            <div>
              <h2>
                {order.invoice_number ||
                  `#${order.id?.substring(0, 8)?.toUpperCase()}` ||
                  "-"}
              </h2>
              <p className="dash-page-company">
                {order.company_name || order.name}
              </p>
            </div>
            <span className={`dash-status ${order.status}`}>
              {t(`status_${order.status}`, { fallback: order.status })}
            </span>
          </div>

          <div className="dash-company-grid" style={{ marginBottom: 32 }}>
            <div>
              <label>{t("order_customer")}</label>
              <p>{order.name || "-"}</p>
            </div>
            <div>
              <label>{t("order_email")}</label>
              <p>{order.email || "-"}</p>
            </div>
            <div>
              <label>{t("order_phone")}</label>
              <p>{order.phone_number || "-"}</p>
            </div>
            <div>
              <label>{t("table_date")}</label>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div className="dash-company-full">
              <label>{t("order_address")}</label>
              <p>{order.order_address || "-"}</p>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            {t("order_items")}
          </h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>{t("table_product")}</th>
                <th>{t("order_qty")}</th>
                <th>{t("order_price")}</th>
                <th>{t("order_subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {order.order_list?.map((item: any) => (
                <tr key={item.order_list_id}>
                  <td>{item.product?.name || "-"}</td>
                  <td>{item.quantity}</td>
                  <td>{formatRupiah(item.price)}</td>
                  <td>{formatRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
              {(!order.order_list || order.order_list.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", color: "#8c8c8c" }}
                  >
                    {t("orders_empty")}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ fontWeight: 600 }}>
                  {t("table_amount")}
                </td>
                <td style={{ fontWeight: 600 }}>
                  {formatRupiah(order.total_price)}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
}
