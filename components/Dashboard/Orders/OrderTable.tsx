"use client";

import { useTranslations } from "next-intl";

const orders = [
  {
    id: "#MR-001",
    product: "HPL Wood Oak",
    date: "2026-05-15",
    status: "processing",
    amount: "Rp 12.500.000",
  },
  {
    id: "#MR-002",
    product: "HPL Marble White",
    date: "2026-05-10",
    status: "shipped",
    amount: "Rp 8.200.000",
  },
  {
    id: "#MR-003",
    product: "HPL Solid Black",
    date: "2026-04-28",
    status: "completed",
    amount: "Rp 5.100.000",
  },
  {
    id: "#MR-004",
    product: "HPL Wood Teak",
    date: "2026-04-15",
    status: "completed",
    amount: "Rp 15.800.000",
  },
  {
    id: "#MR-005",
    product: "HPL Fabric Grey",
    date: "2026-05-18",
    status: "pending",
    amount: "Rp 3.400.000",
  },
];

export default function OrderTable() {
  const t = useTranslations("dashboard");

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>{t("table_id")}</th>
            <th>{t("table_product")}</th>
            <th>{t("table_date")}</th>
            <th>{t("table_status")}</th>
            <th>{t("table_amount")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.date}</td>
              <td>
                <span className={`dash-status ${order.status}`}>
                  {t(`status_${order.status}`)}
                </span>
              </td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
