"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getReferrer } from "@/lib/api/queries/member";

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

interface DashboardData {
  total_approved?: number;
  order_count?: number;
  favourite_count?: number;
  vouchers?: any;
  referral_count?: number;
  recent_orders?: any[];
}

export default function WelcomeCard({
  dashboard,
}: {
  dashboard?: DashboardData;
}) {
  const t = useTranslations("dashboard");
  const { member } = useAuth();

  const router = useRouter();

  const { data: referrerData } = useQuery({
    queryKey: ["referrer"],
    queryFn: () => getReferrer(),
  });

  const referrer = referrerData?.data;
  const referralCode = member?.username;

  return (
    <>
      <header className="dash-page-header">
        <div>
          <p className="dash-page-company">{member?.company_name || "-"}</p>
          <h2>{t("welcome", { name: member?.fullname ?? "" })}</h2>
        </div>
      </header>

      <div className="dash-bento">
        <div className="dash-card ">
          <div className="dash-card-heading">
            <i className="fi flaticon-house"></i>
            <h3>{t("company_info")}</h3>
          </div>
          <div className="dash-company-grid">
            <div>
              <label>{t("settings_company")}</label>
              <p>{member?.company_name || "-"}</p>
            </div>
            <div>
              <label>{t("settings_owner")}</label>
              <p>{member?.fullname || "-"}</p>
            </div>
            <div className="dash-company-full">
              <label>{t("settings_address")}</label>
              <p>
                {member?.region?.region_name ? member.region.region_name : "-"}
              </p>
            </div>
            <div>
              <label>{t("settings_phone")}</label>
              <p>{member?.phone_number || "-"}</p>
            </div>
            <div>
              <label>{t("settings_email")}</label>
              <p>{member?.email || "-"}</p>
            </div>
          </div>
        </div>

        <div className="dash-card dash-referral-widget">
          <div>
            <div className="dash-referral-widget-heading">
              <h3>{t("referral_title")}</h3>
              <i className="fi ti-crown"></i>
            </div>
            <label>{t("referral_your_code")}</label>
            <div className="dash-referral-widget-code">
              {referralCode || "-"}
            </div>
          </div>
          <div className="dash-referral-widget-bottom">
            <div>
              <p className="dash-referral-widget-tier-label">
                {t("referral_by")}
              </p>
              <p className="dash-referral-widget-tier-val">
                {referrer?.referrer?.fullname || "-"}
              </p>
            </div>
            <div className="dash-referral-widget-refs">
              <span>{dashboard?.referral_count ?? 0}</span>
              <p>{t("stat_referrals")}</p>
            </div>
          </div>
        </div>

        {dashboard?.recent_orders && dashboard.recent_orders.length > 0 && (
          <div
            className="dash-card"
            style={{ gridColumn: "1 / -1", marginTop: 8 }}
          >
            <div className="dash-card-heading">
              <i className="fi ti-receipt"></i>
              <h3>{t("recent_orders")}</h3>
            </div>
            <div className="dash-table-wrapper">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>{t("table_id")}</th>
                    <th>{t("table_status")}</th>
                    <th>{t("table_date")}</th>
                    <th>{t("table_amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_orders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer"
                      style={{
                        cursor: "pointer",
                        color: "#1a1c1c",
                        fontWeight: 500,
                      }}
                      onClick={() =>
                        router.push(`/dashboard/orders/${order.id}`)
                      }
                    >
                      <td>
                        {order.invoice_number ||
                          `#${String(order.id ?? "")
                            .substring(0, 8)
                            .toUpperCase()}`}
                      </td>
                      <td>
                        <span className={`dash-status ${order.status}`}>
                          {t(`status_${order.status}`, {
                            fallback: order.status,
                          })}
                        </span>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>{formatRupiah(order.total_price ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="dash-action-section">
          <h3>{t("action_title")}</h3>
          <div className="dash-action-grid">
            <Link href="/e-catalogue" className="dash-action-card">
              <div className="dash-action-icon">
                <i className="fi ti-book"></i>
              </div>
              <h4>{t("action_catalogue")}</h4>
              <p>{t("action_catalogue_desc")}</p>
              <i className="fi ti-arrow-right dash-action-arrow"></i>
            </Link>
            <Link href="/dashboard/orders" className="dash-action-card">
              <div className="dash-action-icon">
                <i className="fi ti-receipt"></i>
              </div>
              <h4>{t("action_orders")}</h4>
              <p>{t("action_orders_desc")}</p>
              <i className="fi ti-arrow-right dash-action-arrow"></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
