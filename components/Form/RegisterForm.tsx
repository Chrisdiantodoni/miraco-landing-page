/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Image from "next/image";
import { toast } from "react-toastify";
import fallbackLogo from "@/public/images/miraco/logo/logo-miraco.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import { register } from "@/lib/api/queries/member";
import { checkUsername, checkReferral } from "@/lib/api/queries/member";
import { getRequestPages } from "@/lib/api/queries/request";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import dynamic from "next/dynamic";
import PendingApprovalModal from "../ui/pending-approval-modal";

const DynamicSearchPosition = dynamic(() => import("../Input/SearchPosition"), {
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

const DynamicRegionSelect = dynamic(() => import("../Input/ClientSelect"), {
  ssr: false,
  loading: () => (
    <input
      type="text"
      className="form-control"
      disabled
      defaultValue="Loading..."
    />
  ),
});

export default function RegisterForm() {
  const t = useTranslations("register");
  const router = useRouter();
  const settings = useSiteSettings();
  const logo = settings?.site_settings?.logo_dark_url || fallbackLogo;
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: regionData } = useQuery({
    queryKey: ["regions"],
    queryFn: () => getRequestPages(),
    staleTime: 5 * 60 * 1000,
  });

  const regionOptions =
    regionData?.data?.regions?.map((item: any) => ({
      label: item?.region_name,
      value: item?.id,
    })) || [];

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: "",
      region_id: "",
      position_id: "",
      fullname: "",
      address: "",
      phone_number: "",
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      referral_code: "",
      profile_photo: null,
    },
  });

  const [watchUsername, setWatchUsername] = useState("");
  const debouncedUsername = useDebounce(watchUsername, 500);

  const { data: usernameCheck } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsername(debouncedUsername),
    enabled: debouncedUsername.length > 0,
  });

  const [referralInput, setReferralInput] = useState("");
  const [checkReferralCode, setCheckReferralCode] = useState("");
  const [referralName, setReferralName] = useState("");
  const [referralStatus, setReferralStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");

  const handleApplyReferral = () => {
    const code = referralInput.trim();
    if (!code) return;

    setCheckReferralCode(code);
    checkReferral(code)
      .then((res: any) => {
        if (res?.data?.valid) {
          setReferralName(res.data.name || "");
          setReferralStatus("valid");
          setValue("referral_code", code);
        } else {
          setReferralStatus("invalid");
          setReferralName("");
        }
      })
      .catch(() => {
        setReferralStatus("invalid");
        setReferralName("");
      });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const { profile_photo, confirm_password, ...rest } = body;

      if (profile_photo instanceof File) {
        const formData = new FormData();
        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value as string);
          }
        });
        formData.append("profile_photo", profile_photo);
        const response = await register(formData, true);
        return { response };
      }

      const response = await register(rest);
      return { response };
    },
    onSuccess: async ({ response }) => {
      if (response?.meta?.code == 200) {
        toast.success(t("toast_success"));
        setOpenModal(true);
      }
    },
    onError: (res: any) => {
      toast.error(t("toast_error"));
      console.log(res);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const positionId =
      data.position_id && typeof data.position_id === "object"
        ? (data.position_id as any).value || ""
        : data.position_id || "";

    const regionId =
      data.region_id && typeof data.region_id === "object"
        ? (data.region_id as any).value || ""
        : data.region_id || "";

    mutate({ ...data, position_id: positionId, region_id: regionId });
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

  console.log({ errors });
  return (
    <div className="wpo-login-wrapper">
      <div
        className="wpo-login-image"
        style={{ backgroundImage: "url('/images/login/screen.png')" }}
      ></div>

      <div className="wpo-login-form-area">
        {openModal && (
          <PendingApprovalModal
            email={getValues("email")}
            onClose={() => {
              setOpenModal(false);
              router.replace("/login");
            }}
          />
        )}

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
                  {t("label_company_name")}{" "}
                  <span className="required-star">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  placeholder={t("placeholder_company_name")}
                  {...formRegister("company_name")}
                />
                {errors.company_name && (
                  <div className="invalid-feedback">
                    {errors.company_name.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="position_id">
                  {t("label_position")} <span className="required-star">*</span>
                </label>
                <Controller
                  name="position_id"
                  control={control}
                  render={({ field }) => (
                    <DynamicSearchPosition
                      onChange={field.onChange}
                      value={field.value}
                      hasError={!!errors.position_id}
                      placeholder={t("placeholder_position")}
                    />
                  )}
                />
                {errors.position_id && (
                  <div className="invalid-feedback">
                    {errors.position_id.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="region_id">
                  {t("label_city")} <span className="required-star">*</span>
                </label>
                <Controller
                  name="region_id"
                  control={control}
                  rules={{ required: t("error_city_required") }}
                  render={({ field }) => (
                    <DynamicRegionSelect
                      field={field}
                      options={regionOptions}
                      hasError={!!errors.region_id}
                      placeholder={t("placeholder_city")}
                      isClearable
                    />
                  )}
                />
                {errors.region_id && (
                  <div className="invalid-feedback">
                    {errors.region_id.message}
                  </div>
                )}
              </div>
              <div className="wpo-login-form-group">
                <label htmlFor="fullname">
                  {t("label_fullname")} <span className="required-star">*</span>
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder={t("placeholder_fullname")}
                  {...formRegister("fullname")}
                />
                {errors.fullname && (
                  <div className="invalid-feedback">
                    {errors.fullname.message}
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
                  {...formRegister("address")}
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
                  {...formRegister("phone_number")}
                />
                {errors.phone_number && (
                  <div className="invalid-feedback">
                    {errors.phone_number.message}
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
                  {...formRegister("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
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
                  {...formRegister("username")}
                  onChange={(e) => {
                    setWatchUsername(e.target.value);
                    formRegister("username").onChange(e);
                  }}
                />
                {debouncedUsername.length > 0 && usernameCheck ? (
                  <span
                    className="register-feedback"
                    style={{
                      color: usernameCheck?.data?.available
                        ? "#2E7D32"
                        : "#C62828",
                    }}
                  >
                    {usernameCheck?.data?.available
                      ? t("username_available")
                      : t("username_taken")}
                  </span>
                ) : (
                  <span className="register-feedback" />
                )}
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
                    {...formRegister("password")}
                  />
                  {errors.password && (
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
                  {t("label_confirm_password")}{" "}
                  <span className="required-star">*</span>
                </label>
                <div className="wpo-register-password-wrap">
                  <input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("placeholder_password")}
                    {...formRegister("confirm_password")}
                  />
                  {errors.confirm_password && (
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
                <div className="wpo-register-referral-row">
                  <input
                    id="referral"
                    type="text"
                    placeholder={t("placeholder_referral")}
                    value={referralInput}
                    onChange={(e) => {
                      setReferralInput(e.target.value);
                      setReferralStatus("idle");
                    }}
                  />
                  <button
                    type="button"
                    className="wpo-register-referral-btn"
                    onClick={handleApplyReferral}
                  >
                    {t("button_apply")}
                  </button>
                </div>
                {referralStatus === "valid" && (
                  <span
                    className="register-feedback"
                    style={{ color: "#2E7D32" }}
                  >
                    {t("referral_found")} {referralName}
                  </span>
                )}
                {referralStatus === "invalid" && (
                  <span
                    className="register-feedback"
                    style={{ color: "#F57F17" }}
                  >
                    {t("referral_not_found")}
                  </span>
                )}
                {referralStatus === "idle" && (
                  <span className="register-feedback" />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="wpo-login-submit"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t("button_register")
              )}
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
