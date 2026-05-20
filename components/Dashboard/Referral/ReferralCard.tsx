"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ReferralCard() {
  const t = useTranslations("dashboard");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("MRC-JD2025");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dash-referral-main">
      <div className="dash-referral-hero">
        <i className="fi ti-share"></i>
        <h3>{t("referral_title")}</h3>
        <p>{t("referral_desc")}</p>
        <div className="dash-referral-code-block">
          <code>MRC-JD2025</code>
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
          <div className="dash-referral-stat-value">3</div>
          <div className="dash-referral-stat-label">
            {t("referral_successful")}
          </div>
        </div>
        <div>
          <div className="dash-referral-stat-value">Rp 2.500.000</div>
          <div className="dash-referral-stat-label">
            {t("referral_earned")}
          </div>
        </div>
      </div>
    </div>
  );
}
