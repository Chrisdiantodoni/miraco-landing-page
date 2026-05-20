"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";

export default function RegisterForm() {
  const t = useTranslations("register");
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="wpo-login-wrapper">
      <div
        className="wpo-login-image"
        style={{ backgroundImage: "url('/images/login/screen.png')" }}
      ></div>

      <div className="wpo-login-form-area">
        <div className="wpo-register-form">
          {/* Logo */}
          <div className="wpo-login-header">
            <div className="wpo-login-header-logo">
              <Image
                src={logo}
                alt="Miraco HPL"
                width={150}
                height={40}
                priority
              />
            </div>
            <h2>{t("heading")}</h2>
            <p>{t("sub_heading")}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Section 1: Company Info */}
            <div className="wpo-register-section">
              <h3 className="wpo-register-section-title">
                {t("section_company")}
              </h3>
              <div className="wpo-login-form-group">
                <label htmlFor="company_name">{t("label_company_name")}</label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  placeholder={t("placeholder_company_name")}
                />
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="owner_name">{t("label_owner_name")}</label>
                <input
                  id="owner_name"
                  name="owner_name"
                  type="text"
                  placeholder={t("placeholder_owner_name")}
                />
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="address">{t("label_address")}</label>
                <textarea
                  className="wpo-register-textarea"
                  id="address"
                  name="address"
                  placeholder={t("placeholder_address")}
                  rows={2}
                />
              </div>
            </div>

            {/* Section 2: Account */}
            <div className="wpo-register-section">
              <h3 className="wpo-register-section-title">
                {t("section_account")}
              </h3>
              <div className="wpo-login-form-group">
                <label htmlFor="phone">{t("label_phone")}</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("placeholder_phone")}
                />
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="email">{t("label_email")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("placeholder_email")}
                />
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="username">{t("label_username")}</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t("placeholder_username")}
                />
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="password">{t("label_password")}</label>
                <div className="wpo-register-password-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder_password")}
                  />
                  <button
                    type="button"
                    className="wpo-register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                    ></i>
                  </button>
                </div>
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="confirm_password">
                  {t("label_confirm_password")}
                </label>
                <div className="wpo-register-password-wrap">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("placeholder_password")}
                  />
                  <button
                    type="button"
                    className="wpo-register-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fa ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Referral */}
            <div className="wpo-register-section">
              <h3 className="wpo-register-section-title">
                {t("section_referral")}
              </h3>
              <p className="wpo-register-referral-desc">
                {t("referral_description")}
              </p>
              <div className="wpo-login-form-group">
                <label htmlFor="referral">{t("label_referral")}</label>
                <div className="wpo-register-referral-row">
                  <input
                    id="referral"
                    name="referral"
                    type="text"
                    placeholder={t("placeholder_referral")}
                  />
                  <button
                    type="button"
                    className="wpo-register-referral-btn"
                  >
                    {t("button_apply")}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="wpo-login-submit">
              {t("button_register")}
            </button>
          </form>

          <div className="wpo-login-footer-text">
            <p>
              {t("login_text")}
              <Link href="/login">{t("login_link")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
