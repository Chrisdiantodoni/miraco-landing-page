"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getOrders } from "@/lib/api/queries/member";
import Loading from "@/components/Loader/loading";
import Pagination from "@/components/Dashboard/Pagination";
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

export default function OrderTable() {
  const t = useTranslations("dashboard");
  const { isAuthenticated } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", { search, status, fromDate, toDate, page, perPage }],
    queryFn: () =>
      getOrders({
        search: search || undefined,
        status: status || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        page,
        per_page: perPage,
      }),
    enabled: isAuthenticated,
  });

  const orders = data?.data?.data || [];
  const meta = data?.data;

  return (
    <div className="dash-page-container">
      <div className="dash-table-filters">
        <input
          type="text"
          className="dash-filter-input"
          placeholder={t("order_search_placeholder")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          className="dash-filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t("order_status_all")}</option>
          <option value="pending">{t("status_pending")}</option>
          <option value="request">{t("status_request")}</option>
          <option value="processing">{t("status_processing")}</option>
          <option value="shipped">{t("status_shipped")}</option>
          <option value="completed">{t("status_completed")}</option>
          <option value="reject">{t("status_reject")}</option>
          <option value="cancelled">{t("status_cancelled")}</option>
        </select>

        <div className="dash-filter-date-wrap">
          <span className="dash-filter-label">{t("order_date_from")}</span>
          <input
            type="date"
            className="dash-filter-input"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="dash-filter-date-wrap">
          <span className="dash-filter-label">{t("order_date_to")}</span>
          <input
            type="date"
            className="dash-filter-input"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="dash-filter-select"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 / {t("order_per_page")}</option>
          <option value={25}>25 / {t("order_per_page")}</option>
          <option value={50}>50 / {t("order_per_page")}</option>
        </select>
      </div>

      {isLoading ? (
        <Loading
          size="small"
          text={t("orders_loading")}
          image={image}
          imageSize={60}
        />
      ) : isError ? (
        <div className="text-center py-5">
          <p>{t("orders_error")}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <p>{t("orders_empty")}</p>
        </div>
      ) : (
        <>
          <table className="dash-table">
            <thead>
              <tr>
                <th>{t("table_id")}</th>
                <th>{t("table_product")}</th>
                <th>{t("table_date")}</th>
                <th>{t("table_status")}</th>
                <th>{t("table_amount")}</th>
                <th>{t("table_action")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const orderId =
                  order.invoice_number ||
                  `#${order.id?.substring(0, 8)?.toUpperCase()}` ||
                  "-";
                const productName = order.order_list?.[0]?.product?.name || "-";
                const date = formatDate(order.created_at);
                const amount =
                  order.total_price != null
                    ? formatRupiah(order.total_price)
                    : "-";

                return (
                  <tr key={order.id}>
                    <td>{orderId}</td>
                    <td>{productName}</td>
                    <td>{date}</td>
                    <td>
                      <span className={`dash-status ${order.status}`}>
                        {t(`status_${order.status}`, {
                          fallback: order.status,
                        })}
                      </span>
                    </td>
                    <td>{amount}</td>
                    <td>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="dash-order-view-btn"
                      >
                        {t("order_view")}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
