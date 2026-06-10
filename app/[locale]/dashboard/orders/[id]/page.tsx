"use client";

import { use } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Link } from "@/i18n/navigation";
import {
  getOrderDetail,
  getOrderInvoicePreview,
  getOrderInvoiceDownload,
} from "@/lib/api/queries/member";
import { Loader2, Download, Eye } from "lucide-react";
import { toast } from "react-toastify";
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

const APPROVED_STATUSES = [
  "approve",
  "processing",
  "shipped",
  "completed",
];

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
  const isApproved = order?.status && APPROVED_STATUSES.includes(order.status);

  const invoiceMutation = useMutation({
    mutationFn: () => getOrderInvoiceDownload(id),
    onSuccess: (result: any) => {
      const url = window.URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = order?.invoice_number
        ? `${order.invoice_number.replace(/\//g, "_")}.pdf`
        : `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: () => {
      toast.error(t("orders_error"));
    },
  });

  const previewMutation = useMutation({
    mutationFn: () => getOrderInvoicePreview(id),
    onSuccess: (result: any) => {
      const url = window.URL.createObjectURL(result.blob);
      window.open(url, "_blank");
    },
    onError: () => {
      toast.error(t("orders_error"));
    },
  });

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
                  `#${String(order.id ?? "").substring(0, 8).toUpperCase()}` ||
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

          {isApproved && (
            <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
              <button
                className="dash-order-view-btn"
                onClick={() => invoiceMutation.mutate()}
                disabled={
                  invoiceMutation.isPending || previewMutation.isPending
                }
                style={{ gap: 8 }}
              >
                {invoiceMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {t("order_download_invoice")}
              </button>
              <button
                className="dash-order-view-btn"
                onClick={() => previewMutation.mutate()}
                disabled={
                  invoiceMutation.isPending || previewMutation.isPending
                }
                style={{ gap: 8 }}
              >
                {previewMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Eye size={14} />
                )}
                {t("order_preview_invoice")}
              </button>
            </div>
          )}

          <div className="dash-company-grid" style={{ marginBottom: 32 }}>
            <div>
              <label>{t("order_customer")}</label>
              <p>{order.name || "-"}</p>
            </div>
            <div>
              <label>{t("order_receiver_name")}</label>
              <p>{order.receiver_name || "-"}</p>
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
            {order.link_order_gmaps && (
              <div className="dash-company-full">
                <label>{t("label_gmaps_link")}</label>
                <p>
                  <a
                    href={order.link_order_gmaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1a1c1c" }}
                  >
                    {order.link_order_gmaps}
                  </a>
                </p>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            {t("order_items")}
          </h3>

          {order.order_list?.map((item: any) => {
            const thumbnail = item.product?.media?.find(
              (m: any) => m.type === "product_thumbnail",
            );
            const unitPrice = item.price ?? 0;
            const qty = item.quantity ?? 0;
            const subtotal = unitPrice * qty;

            return (
              <div key={item.order_list_id} className="order-item-card">
                <div className="order-item-image">
                  {thumbnail?.image_url ? (
                    <Image
                      src={thumbnail.image_url}
                      alt={item.product?.name || "Product"}
                      width={64}
                      height={64}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <div className="order-item-image-placeholder" />
                  )}
                </div>
                <div className="order-item-info">
                  <span className="order-item-code">
                    {item.product?.category?.code || "-"}{" "}
                    {item.product?.code || "-"}
                  </span>
                  <span className="order-item-name">
                    {item.product?.name || "-"}
                  </span>
                  <span className="order-item-qty">
                    {t("order_qty")}: {qty}
                  </span>
                </div>
                {isApproved && (
                  <div className="order-item-price">
                    <span className="order-item-unit">
                      {formatRupiah(unitPrice)}
                    </span>
                    <span className="order-item-subtotal">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {order.order_voucher_allocations &&
            order.order_voucher_allocations.length > 0 && (
              <>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginTop: 32,
                    marginBottom: 16,
                  }}
                >
                  {t("order_vouchers_used")}
                </h3>
                {order.order_voucher_allocations.map((alloc: any) => (
                  <div key={alloc.id} className="order-voucher-card">
                    <div className="order-voucher-info">
                      <span className="order-voucher-code">
                        {alloc.voucher_allocation?.voucher_code}
                      </span>
                      <span className="order-voucher-name">
                        {alloc.voucher_allocation?.voucher?.name}
                      </span>

                      <span className="order-voucher-detail">
                        {t("voucher_detail_min_transaction")}:{" "}
                        {alloc.voucher_allocation?.voucher?.min_transaction !=
                        null
                          ? formatRupiah(
                              alloc.voucher_allocation?.voucher?.min_transaction ?? 0,
                            )
                          : "-"}
                        {" | "}
                        {t("voucher_detail_min_product")}:{" "}
                        {alloc.voucher_allocation?.voucher?.min_product ?? "-"}
                      </span>
                      <span className="order-voucher-detail">
                        {alloc.voucher_allocation?.voucher?.discount_type ===
                        "fixed"
                          ? formatRupiah(
                              alloc.voucher_allocation?.voucher?.discount_value ?? 0,
                            )
                          : `${alloc.voucher_allocation?.voucher?.discount_value}%`}
                      </span>
                    </div>
                    {isApproved && (
                      <div className="order-voucher-amount">
                        -
                        {formatRupiah(
                          alloc.voucher_allocation?.voucher?.discount_type ===
                            "fixed"
                            ? (alloc.voucher_allocation?.voucher?.discount_value ?? 0)
                            : Math.floor(
                                ((alloc.voucher_allocation?.voucher?.discount_value ?? 0) /
                                  100) *
                                  (order.subtotal ?? 0),
                              ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

          {isApproved && (
            <div className="order-price-summary">
              <div className="order-price-row">
                <span>{t("order_subtotal_label")}</span>
                <span>{formatRupiah(order.subtotal ?? 0)}</span>
              </div>
              {order.disc_design_fee > 0 && (
                <div className="order-price-row">
                  <span>
                    {t("order_disc_design")} ({order.disc_design_fee}%)
                  </span>
                  <span>
                    -
                    {formatRupiah(
                      Math.floor(
                        (order.disc_design_fee / 100) * (order.subtotal || 0),
                      ),
                    )}
                  </span>
                </div>
              )}
              {order.disc_cash > 0 && (
                <div className="order-price-row">
                  <span>{t("order_disc_cash")}</span>
                  <span>-{formatRupiah(order.disc_cash)}</span>
                </div>
              )}
              {order.disc_voucher > 0 && (
                <div className="order-price-row">
                  <span>{t("order_disc_voucher")}</span>
                  <span>-{formatRupiah(order.disc_voucher)}</span>
                </div>
              )}
              {order.disc_showroom_or_gallery > 0 && (
                <div className="order-price-row">
                  <span>{t("order_disc_showroom")}</span>
                  <span>-{formatRupiah(order.disc_showroom_or_gallery)}</span>
                </div>
              )}
              <div className="order-price-row order-price-row--total">
                <span>{t("order_total_label")}</span>
                <span>{formatRupiah(order.total_price ?? 0)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
