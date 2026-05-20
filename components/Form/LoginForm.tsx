"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";

export default function LoginForm() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;

  return (
    <div className="wpo-login-wrapper">
      <div
        className="wpo-login-image"
        style={{ backgroundImage: "url('/images/login/screen.png')" }}
      ></div>

      <div className="wpo-login-form-area">
        <div className="wpo-login-form">
          <div className="wpo-login-header">
            <div className="wpo-login-header-logo">
              <Image
                src={logo}
                alt="Miraco HPL"
                width={140}
                height={40}
                priority
              />
            </div>
            <h2>{t("heading")}</h2>
            <p>{t("sub_heading")}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="wpo-login-form-group">
              <label htmlFor="identifier">{t("label_email")}</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder={t("placeholder_email")}
                required
              />
            </div>

            <div className="wpo-login-form-group">
              <label htmlFor="password">{t("label_password")}</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="wpo-password-input"
                placeholder={t("placeholder_password")}
                required
              />
              <button
                type="button"
                className="wpo-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>

            <div className="wpo-login-extras">
              <label className="wpo-login-remember">
                <input type="checkbox" />
                <span className="wpo-login-checkbox"></span>
                <span>{t("remember_me")}</span>
              </label>
              <Link href="#" className="wpo-login-forgot">
                {t("forgot_password")}
              </Link>
            </div>

            <button type="submit" className="wpo-login-submit">
              <span>{t("button_sign_in")}</span>
              <i className="fi ti-arrow-right"></i>
            </button>
          </form>

          <div className="wpo-login-footer-text">
            <p>
              {t("register_text")}
              <Link href="/register">{t("register_link")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
