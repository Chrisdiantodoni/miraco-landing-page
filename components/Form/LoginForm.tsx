"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import { toast } from "react-toastify";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/providers/AuthProvider";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const t = useTranslations("auth");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.identifier, data.password);
      toast.success(t("toast_success"));
    } catch {
      toast.error(t("toast_error"));
    }
  };

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="wpo-login-form-group">
              <label htmlFor="identifier">{t("label_email")}</label>
              <input
                id="identifier"
                type="text"
                placeholder={t("placeholder_email")}
                {...register("identifier")}
              />
              {errors.identifier && (
                <div className="invalid-feedback">
                  {errors.identifier.message}
                </div>
              )}
            </div>

            <div className="wpo-login-form-group">
              <label htmlFor="password">{t("label_password")}</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="wpo-password-input"
                placeholder={t("placeholder_password")}
                {...register("password")}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
              <button
                type="button"
                className="wpo-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                ></i>
              </button>
            </div>

            <div className="wpo-login-extras">
              <label className="wpo-login-remember">
                <input type="checkbox" />
                <span className="wpo-login-checkbox"></span>
                <span>{t("remember_me")}</span>
              </label>
              <Link href="/forgot-password" className="wpo-login-forgot">
                {t("forgot_password")}
              </Link>
            </div>

            <button
              type="submit"
              className="wpo-login-submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  t("button_sign_in")
                )}
              </span>
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
