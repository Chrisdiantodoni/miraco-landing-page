/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import { toast } from "react-toastify";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/queries/member";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";

const DynamicClientSelect = dynamic(() => import("../Input/SearchPosition"), {
  ssr: false,
  loading: () => (
    <input
      type="text"
      className="form-control"
      disabled
      defaultValue="Loading options..."
    />
  ),
});

interface RegisterFormFields {
  company_name: string;
  position: string;
  owner_name: string;
  address: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  referral: string;
  profile_photo: any;
}

export default function RegisterForm() {
  const t = useTranslations("register");
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterFormFields>({
    defaultValues: {
      company_name: "",
      position: "",
      owner_name: "",
      address: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      referral: "",
      profile_photo: null,
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const response = await register(body);
      return { response, body };
    },
    onSuccess: async ({ response }) => {
      if (response?.meta?.code == 200) {
        reset();
        setPhotoPreview(null);
        toast.success(t("toast_success"));
      }
    },
    onError: (res: any) => {
      toast.error(t("toast_error"));
      console.log(res);
    },
  });

  const onSubmit = (data: RegisterFormFields) => {
    const { confirm_password, ...payload } = data;
    mutate(payload);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error(t("toast_error"));
      return;
    }

    setValue("profile_photo", file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoRemove = () => {
    setValue("profile_photo", null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="wpo-login-wrapper">
      <div
        className="wpo-login-image"
        style={{ backgroundImage: "url('/images/login/screen.png')" }}
      ></div>

      <div className="wpo-login-form-area">
        <div className="wpo-register-form">
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

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Section 1: Company Info */}
            <div className="wpo-register-section">
              <h3 className="wpo-register-section-title">
                {t("section_company")}
              </h3>
              <div className="wpo-login-form-group">
                <label htmlFor="company_name">
                  {t("label_company_name")} <span className="required-star">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  placeholder={t("placeholder_company_name")}
                  {...formRegister("company_name", {
                    required: t("error_company_required"),
                  })}
                />
                {errors.company_name && (
                  <div className="invalid-feedback">
                    {errors.company_name.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="position">
                  {t("label_position")} <span className="required-star">*</span>
                </label>
                <Controller
                  name="position"
                  control={control}
                  rules={{ required: t("error_position_required") }}
                  render={({ field }) => (
                    <DynamicClientSelect
                      onChange={field.onChange}
                      value={field.value}
                      hasError={!!errors.position}
                      placeholder={t("placeholder_position")}
                    />
                  )}
                />
                {errors.position && (
                  <div className="invalid-feedback">
                    {errors.position.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="owner_name">
                  {t("label_owner_name")} <span className="required-star">*</span>
                </label>
                <input
                  id="owner_name"
                  type="text"
                  placeholder={t("placeholder_owner_name")}
                  {...formRegister("owner_name", {
                    required: t("error_owner_required"),
                  })}
                />
                {errors.owner_name && (
                  <div className="invalid-feedback">
                    {errors.owner_name.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="address">
                  {t("label_address")} <span className="required-star">*</span>
                </label>
                <textarea
                  className="wpo-register-textarea"
                  id="address"
                  placeholder={t("placeholder_address")}
                  rows={2}
                  {...formRegister("address", {
                    required: t("error_address_required"),
                  })}
                />
                {errors.address && (
                  <div className="invalid-feedback">
                    {errors.address.message}
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Account */}
            <div className="wpo-register-section">
              <h3 className="wpo-register-section-title">
                {t("section_account")}
              </h3>

              {/* Profile Photo Upload */}
              <div className="wpo-register-photo-upload">
                <label className="wpo-register-photo-preview">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="wpo-register-photo-input"
                    onChange={handlePhotoSelect}
                  />
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="wpo-register-photo-image has-photo"
                    />
                  ) : (
                    <div className="wpo-register-photo-icon">
                      <i className="fi ti-camera"></i>
                      <span>{t("placeholder_profile_photo")}</span>
                    </div>
                  )}
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    className="wpo-register-photo-remove"
                    onClick={handlePhotoRemove}
                  >
                    {t("button_remove_photo")}
                  </button>
                )}
              </div>

              <div className="wpo-login-form-group">
                <label htmlFor="phone">
                  {t("label_phone")} <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder={t("placeholder_phone")}
                  {...formRegister("phone", {
                    required: t("error_phone_required"),
                  })}
                />
                {errors.phone && (
                  <div className="invalid-feedback">
                    {errors.phone.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="email">
                  {t("label_email")} <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t("placeholder_email")}
                  {...formRegister("email", {
                    required: t("error_email_required"),
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: t("error_email_invalid"),
                    },
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="username">
                  {t("label_username")} <span className="required-star">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder={t("placeholder_username")}
                  {...formRegister("username", {
                    required: t("error_username_required"),
                  })}
                />
                {errors.username && (
                  <div className="invalid-feedback">
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="password">
                  {t("label_password")} <span className="required-star">*</span>
                </label>
                <div className="wpo-register-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholder_password")}
                    {...formRegister("password", {
                      required: t("error_password_required"),
                    })}
                  />{errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
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
                  {t("label_confirm_password")} <span className="required-star">*</span>
                </label>
                <div className="wpo-register-password-wrap">
                  <input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("placeholder_password")}
                    {...formRegister("confirm_password", {
                      required: t("error_confirm_password_required"),
                    })}
                  />{errors.confirm_password && (
                  <div className="invalid-feedback">
                    {errors.confirm_password.message}
                  </div>
                )}
                  <button
                    type="button"
                    className="wpo-register-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
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
                <input
                  id="referral"
                  type="text"
                  placeholder={t("placeholder_referral")}
                  {...formRegister("referral")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="wpo-login-submit"
              disabled={isPending}
            >
              {isPending ? "..." : t("button_register")}
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
