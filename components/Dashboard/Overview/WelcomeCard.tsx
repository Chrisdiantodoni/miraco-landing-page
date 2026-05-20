"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function WelcomeCard() {
  const t = useTranslations("dashboard");

  return (
    <>
      {/* Header */}
      <header className="dash-page-header">
        <div>
          <p className="dash-page-company">PT. Cipta Arsitektur</p>
          <h2>{t("welcome", { name: "John Doe" })}</h2>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="dash-bento">
        {/* Company Info Card */}
        <div className="dash-card dash-company-card">
          <div className="dash-card-heading">
            <i className="fi flaticon-house"></i>
            <h3>{t("company_info")}</h3>
          </div>
          <div className="dash-company-grid">
            <div>
              <label>{t("settings_company")}</label>
              <p>PT. Cipta Arsitektur</p>
            </div>
            <div>
              <label>{t("settings_owner")}</label>
              <p>John Doe</p>
            </div>
            <div className="dash-company-full">
              <label>{t("settings_address")}</label>
              <p>Jl. Arsitektur No. 1, Jakarta Selatan, 12345</p>
            </div>
            <div>
              <label>{t("settings_phone")}</label>
              <p>+62 812 3456 7890</p>
            </div>
            <div>
              <label>{t("settings_email")}</label>
              <p>hello@company.com</p>
            </div>
          </div>
        </div>

        {/* Referral Widget (dark) */}
        <div className="dash-card dash-referral-widget">
          <div>
            <div className="dash-referral-widget-heading">
              <h3>{t("referral_title")}</h3>
              <i className="fi ti-crown"></i>
            </div>
            <label>{t("referral_your_code")}</label>
            <div className="dash-referral-widget-code">johndoe_arch</div>
          </div>
          <div className="dash-referral-widget-bottom">
            <div>
              <p className="dash-referral-widget-tier-label">
                {t("partner_tier")}
              </p>
              <p className="dash-referral-widget-tier-val">Premium Tier</p>
            </div>
            <div className="dash-referral-widget-refs">
              <span>12</span>
              <p>{t("stat_referrals")}</p>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
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
            <a href="#" className="dash-action-card">
              <div className="dash-action-icon">
                <i className="fi ti-download"></i>
              </div>
              <h4>{t("action_download")}</h4>
              <p>{t("action_download_desc")}</p>
              <i className="fi ti-arrow-right dash-action-arrow"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
