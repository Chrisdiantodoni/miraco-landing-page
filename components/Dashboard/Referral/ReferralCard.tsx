"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getReferrer } from "@/lib/api/queries/member";
import { toast } from "react-toastify";
import Loading from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ReferralCard() {
  const t = useTranslations("dashboard");
  const { member } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["referrer"],
    queryFn: () => getReferrer(),
  });

  const referrer = data?.data;
  const referralCode = member?.username;
  const referrals = referrer?.referrals || [];

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success(t("copied"), { autoClose: 1500, hideProgressBar: true });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Loading size="small" text={t("orders_loading")} image={image} imageSize={60} />
    );
  }

  return (
    <div className="dash-referral-main">
      <div className="dash-referral-hero">
        <i className="fi ti-share"></i>
        <h3>{t("referral_title")}</h3>
        <p>{t("referral_desc")}</p>
        <div className="dash-referral-code-block">
          <code>{referralCode || "-"}</code>
          <button
            className="dash-referral-copy"
            onClick={copyCode}
            aria-label="Copy referral code"
          >
            <i className={`fi ${copied ? "ti-check" : "ti-clipboard"}`}></i>
          </button>
        </div>
      </div>

      <div className="dash-referral-stats">
        <div>
          <div className="dash-referral-stat-value">
            {referrer?.referral_count ?? 0}
          </div>
          <div className="dash-referral-stat-label">
            {t("referral_successful")}
          </div>
        </div>
        <div>
          <div className="dash-referral-stat-value">
            {referrer?.referrer?.fullname || "-"}
          </div>
          <div className="dash-referral-stat-label">
            {t("referral_by")}
          </div>
        </div>
      </div>

      {referrals.length > 0 && (
        <div className="dash-referral-list">
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            {t("referral_list")}
          </h4>
          <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>{t("settings_owner")}</th>
                <th>{t("settings_company")}</th>
                <th>{t("settings_username")}</th>
                <th>{t("table_date")}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.fullname || "-"}</td>
                  <td>{r.company_name || "-"}</td>
                  <td>{r.username || "-"}</td>
                  <td>{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
