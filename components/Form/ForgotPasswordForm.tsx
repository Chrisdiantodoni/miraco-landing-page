"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import { toast } from "react-toastify";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "@/lib/api/queries/member";
import { Loader2 } from "lucide-react";

type Step = "forgot" | "otp" | "reset";

export default function ForgotPasswordForm() {
  const t = useTranslations("forgot_password");
  const router = useRouter();
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;

  const [step, setStep] = useState<Step>("forgot");
  const [login, setLogin] = useState("");
  const [resetToken, setResetToken] = useState("");

  const forgotSchema = z.object({
    login: z.string().min(1, t("error_login_required")),
  });
  type ForgotData = z.infer<typeof forgotSchema>;

  const {
    register: registerForgot,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { login: "" },
  });

  const otpSchema = z.object({
    otp: z.string().length(6, t("error_otp_length")),
  });
  type OtpData = z.infer<typeof otpSchema>;

  const {
    register: registerOtp,
    handleSubmit: handleOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const resetSchema = z
    .object({
      password: z.string().min(8, t("error_password_min")),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("error_password_match"),
      path: ["password_confirmation"],
    });
  type ResetData = z.infer<typeof resetSchema>;

  const {
    register: registerReset,
    handleSubmit: handleReset,
    formState: { errors: resetErrors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const forgotMutation = useMutation({
    mutationFn: (data: ForgotData) => forgotPassword(data.login),
    onSuccess: (res: any) => {
      setLogin(res?.data?.login || forgotSchema.parse({ login: login }).login);
      setStep("otp");
      toast.success(res?.message || t("toast_otp_sent"));
    },
    onError: (err: any) => {
      toast.success(err?.message || t("toast_otp_sent"));
    },
  });

  const otpMutation = useMutation({
    mutationFn: (data: OtpData) => verifyOtp(login, data.otp),
    onSuccess: (res: any) => {
      setResetToken(res?.data?.reset_token || "");
      setStep("reset");
      toast.success(res?.message || t("toast_otp_valid"));
    },
    onError: (err: any) => {
      toast.error(err?.message || t("toast_otp_invalid"));
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data: ResetData) =>
      resetPassword(resetToken, data.password, data.password_confirmation),
    onSuccess: (res: any) => {
      toast.success(res?.message || t("toast_reset_success"));
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error(err?.message || t("toast_reset_error"));
    },
  });

  const onForgotSubmit = (data: ForgotData) => {
    setLogin(data.login);
    forgotMutation.mutate(data);
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

          {step === "forgot" && (
            <form onSubmit={handleForgot(onForgotSubmit)}>
              <div className="wpo-login-form-group">
                <label htmlFor="login">{t("label_login")}</label>
                <input
                  id="login"
                  type="text"
                  placeholder={t("placeholder_login")}
                  {...registerForgot("login")}
                />
                {forgotErrors.login && (
                  <div className="invalid-feedback">
                    {forgotErrors.login.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="wpo-login-submit"
                disabled={forgotMutation.isPending}
              >
                <span>
                  {forgotMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    t("button_send_otp")
                  )}
                </span>
                <i className="fi ti-arrow-right"></i>
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtp((data) => otpMutation.mutate(data))}>
              <p className="wpo-login-otp-sent">
                {t("otp_sent_to")} <strong>{login}</strong>
              </p>

              <div className="wpo-login-form-group">
                <label htmlFor="otp">{t("label_otp")}</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t("placeholder_otp")}
                  {...registerOtp("otp")}
                />
                {otpErrors.otp && (
                  <div className="invalid-feedback">
                    {otpErrors.otp.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="wpo-login-submit"
                disabled={otpMutation.isPending}
              >
                <span>
                  {otpMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    t("button_verify_otp")
                  )}
                </span>
                <i className="fi ti-arrow-right"></i>
              </button>

              <button
                type="button"
                className="wpo-login-forgot"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                }}
                onClick={() => setStep("forgot")}
              >
                {t("back_to_forgot")}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form
              onSubmit={handleReset((data) => resetMutation.mutate(data))}
            >
              <div className="wpo-login-form-group">
                <label htmlFor="password">{t("label_new_password")}</label>
                <input
                  id="password"
                  type="password"
                  placeholder={t("placeholder_new_password")}
                  {...registerReset("password")}
                />
                {resetErrors.password && (
                  <div className="invalid-feedback">
                    {resetErrors.password.message}
                  </div>
                )}
              </div>

              <div className="wpo-login-form-group">
                <label htmlFor="password_confirmation">
                  {t("label_confirm_password")}
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  placeholder={t("placeholder_confirm_password")}
                  {...registerReset("password_confirmation")}
                />
                {resetErrors.password_confirmation && (
                  <div className="invalid-feedback">
                    {resetErrors.password_confirmation.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="wpo-login-submit"
                disabled={resetMutation.isPending}
              >
                <span>
                  {resetMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    t("button_reset_password")
                  )}
                </span>
                <i className="fi ti-arrow-right"></i>
              </button>
            </form>
          )}

          <div className="wpo-login-footer-text">
            <p>
              <Link href="/login">{t("back_to_login")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
