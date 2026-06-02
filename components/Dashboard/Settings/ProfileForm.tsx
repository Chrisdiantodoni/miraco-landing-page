/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  updateProfile,
  changePassword,
} from "@/lib/api/queries/member";
import { getRequestPages } from "@/lib/api/queries/request";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileFormData,
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/lib/validations/auth";
import { Loader2, Camera } from "lucide-react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const DynamicSearchPosition = dynamic(
  () => import("@/components/Input/SearchPosition"),
  {
    ssr: false,
    loading: () => (
      <input
        type="text"
        className="form-control"
        disabled
        defaultValue="Loading..."
      />
    ),
  },
);

const DynamicRegionSelect = dynamic(
  () => import("@/components/Input/ClientSelect"),
  {
    ssr: false,
    loading: () => (
      <input
        type="text"
        className="form-control"
        disabled
        defaultValue="Loading..."
      />
    ),
  },
);

export default function ProfileForm() {
  const t = useTranslations("dashboard");
  const { member } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: regionData } = useQuery({
    queryKey: ["regionsSettings"],
    queryFn: () => getRequestPages(),
    staleTime: 5 * 60 * 1000,
  });

  const regionOptions = useMemo(
    () =>
      regionData?.data?.regions?.map((item: any) => ({
        label: item?.region_name,
        value: item?.id,
      })) || [],
    [regionData],
  );

  // --- Profile Form ---
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullname: member?.fullname || "",
      company_name: member?.company_name || "",
      phone_number: member?.phone_number || "",
      region_id: "",
      position_id: "",
      username: member?.username || "",
      email: member?.email || "",
      profile_photo: null,
    },
  });

  useEffect(() => {
    if (member && regionOptions.length > 0) {
      const cityRegion = regionOptions.find(
        (r: any) => r.value === member.region?.id,
      );
      reset({
        fullname: member.fullname || "",
        company_name: member.company_name || "",
        phone_number: member.phone_number || "",
        region_id: cityRegion || "",
        position_id: member.position
          ? { label: member.position.position_name, value: member.position.id }
          : "",
        username: member.username || "",
        email: member.email || "",
        profile_photo: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, regionOptions]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const { profile_photo, ...rest } = body;

      const positionId =
        rest.position_id && typeof rest.position_id === "object"
          ? (rest.position_id as any).value || ""
          : rest.position_id || "";

      const regionId =
        rest.region_id && typeof rest.region_id === "object"
          ? (rest.region_id as any).value || ""
          : rest.region_id || "";

      const payload = {
        ...rest,
        position_id: positionId,
        region_id: regionId,
      };

      if (profile_photo instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value as string);
          }
        });
        formData.append("profile_photo", profile_photo);
        return updateProfile(formData);
      }

      return updateProfile(payload);
    },
    onSuccess: () => {
      toast.success(t("settings_save_success"));
    },
    onError: () => {
      toast.error(t("settings_save_error"));
    },
  });

  const onProfileSubmit = (data: UpdateProfileFormData) => {
    mutate(data);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error(t("settings_photo_invalid"));
      return;
    }
    setValue("profile_photo", file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoRemove = () => {
    setValue("profile_photo", null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Password Form ---
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: errorsPw },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const {
    isPending: isPendingPw,
    mutate: mutatePw,
  } = useMutation({
    mutationFn: (body: ChangePasswordFormData) =>
      changePassword({
        current_password: body.current_password,
        new_password: body.new_password,
        new_password_confirmation: body.confirm_password,
      }),
    onSuccess: () => {
      toast.success(t("settings_password_success"));
      resetPw();
    },
    onError: () => {
      toast.error(t("settings_password_error"));
    },
  });

  return (
    <div className="dash-page-container">
      <div className="dash-settings-tabs">
        <button
          type="button"
          className={`dash-settings-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          {t("settings_tab_profile")}
        </button>
        <button
          type="button"
          className={`dash-settings-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          {t("settings_tab_password")}
        </button>
      </div>

      {activeTab === "profile" ? (
        <form
          className="dash-profile-form"
          onSubmit={handleSubmit(onProfileSubmit)}
        >
          <div className="dash-avatar-upload">
            <label className="dash-avatar-preview">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="dash-avatar-input"
                onChange={handlePhotoSelect}
              />
              {(photoPreview || member?.profile_photo) ? (
                <img
                  src={photoPreview || member?.profile_photo}
                  alt="Profile"
                  className="dash-avatar-image"
                />
              ) : (
                <div className="dash-avatar-placeholder">
                  <Camera size={24} />
                </div>
              )}
              <div className="dash-avatar-overlay">
                <Camera size={18} />
                <span>{t("settings_change_photo")}</span>
              </div>
            </label>
            {photoPreview && (
              <button
                type="button"
                className="dash-avatar-remove"
                onClick={handlePhotoRemove}
              >
                {t("button_remove_photo")}
              </button>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="fullname">{t("settings_owner")}</label>
            <input id="fullname" type="text" {...register("fullname")} />
            {errors.fullname && (
              <span className="dash-feedback">
                {String(errors.fullname?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="company_name">{t("settings_company")}</label>
            <input
              id="company_name"
              type="text"
              {...register("company_name")}
            />
            {errors.company_name && (
              <span className="dash-feedback">
                {String(errors.company_name?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="phone_number">{t("settings_phone")}</label>
            <input
              id="phone_number"
              type="tel"
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <span className="dash-feedback">
                {String(errors.phone_number?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="region_id">{t("label_city")}</label>
            <Controller
              name="region_id"
              control={control}
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
              <span className="dash-feedback">
                {String(errors.region_id?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="position_id">{t("label_position")}</label>
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
              <span className="dash-feedback">
                {String(errors.position_id?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="username">{t("settings_username")}</label>
            <input id="username" type="text" {...register("username")} />
            {errors.username && (
              <span className="dash-feedback">
                {String(errors.username?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="email">{t("settings_email")}</label>
            <input id="email" type="email" {...register("email")} />
            {errors.email && (
              <span className="dash-feedback">
                {String(errors.email?.message)}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="dash-form-save"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t("settings_save")
            )}
          </button>
        </form>
      ) : (
        <form
          className="dash-profile-form"
          onSubmit={handleSubmitPw((data) => mutatePw(data))}
        >
          <div className="dash-form-group">
            <label htmlFor="current_password">
              {t("settings_current_password")}
            </label>
            <div className="dash-password-wrap">
              <input
                id="current_password"
                type={showCurrent ? "text" : "password"}
                {...registerPw("current_password")}
              />
              <button
                type="button"
                className="dash-password-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                <i className={`fa ${showCurrent ? "fa-eye" : "fa-eye-slash"}`} />
              </button>
            </div>
            {errorsPw.current_password && (
              <span className="dash-feedback">
                {String(errorsPw.current_password?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="new_password">
              {t("settings_new_password")}
            </label>
            <div className="dash-password-wrap">
              <input
                id="new_password"
                type={showNew ? "text" : "password"}
                {...registerPw("new_password")}
              />
              <button
                type="button"
                className="dash-password-toggle"
                onClick={() => setShowNew(!showNew)}
              >
                <i className={`fa ${showNew ? "fa-eye" : "fa-eye-slash"}`} />
              </button>
            </div>
            {errorsPw.new_password && (
              <span className="dash-feedback">
                {String(errorsPw.new_password?.message)}
              </span>
            )}
          </div>

          <div className="dash-form-group">
            <label htmlFor="confirm_password">
              {t("settings_confirm_password")}
            </label>
            <div className="dash-password-wrap">
              <input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                {...registerPw("confirm_password")}
              />
              <button
                type="button"
                className="dash-password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <i
                  className={`fa ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}
                />
              </button>
            </div>
            {errorsPw.confirm_password && (
              <span className="dash-feedback">
                {String(errorsPw.confirm_password?.message)}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="dash-form-save"
            disabled={isPendingPw}
          >
            {isPendingPw ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t("settings_password")
            )}
          </button>
        </form>
      )}
    </div>
  );
}
