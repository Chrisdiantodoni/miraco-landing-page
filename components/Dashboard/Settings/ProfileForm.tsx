"use client";

import { useTranslations } from "next-intl";

export default function ProfileForm() {
  const t = useTranslations("dashboard");

  return (
    <form
      className="dash-profile-form"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="dash-form-group">
        <label htmlFor="company">{t("settings_company")}</label>
        <input
          id="company"
          type="text"
          defaultValue="PT. Cipta Arsitektur"
        />
      </div>
      <div className="dash-form-group">
        <label htmlFor="owner">{t("settings_owner")}</label>
        <input id="owner" type="text" defaultValue="John Doe" />
      </div>
      <div className="dash-form-group">
        <label htmlFor="phone">{t("settings_phone")}</label>
        <input id="phone" type="tel" defaultValue="+62 812 3456 7890" />
      </div>
      <div className="dash-form-group">
        <label htmlFor="email">{t("settings_email")}</label>
        <input
          id="email"
          type="email"
          defaultValue="john@company.com"
        />
      </div>
      <div className="dash-form-group">
        <label htmlFor="new-password">{t("settings_password")}</label>
        <input
          id="new-password"
          type="password"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" className="dash-form-save">
        {t("settings_save")}
      </button>
    </form>
  );
}
