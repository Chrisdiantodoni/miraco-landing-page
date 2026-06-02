"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, ChevronDown, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { submitOrder } from "@/lib/api/queries/member";
import { getVouchers, MemberVoucher } from "@/lib/api/queries/voucher";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import OrderSummary from "./OrderSummary";
import { useDebounce } from "@/lib/hooks/use-debounce";

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  phone_number: z.string().optional().or(z.literal("")),
  company_name: z.string().optional().or(z.literal("")),
  street_address: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state_province: z.string().optional().or(z.literal("")),
  postal_code: z.string().optional().or(z.literal("")),
  link_order_gmaps: z.string().optional().or(z.literal("")),
  lat_order_gmaps: z.string().optional().or(z.literal("")),
  long_order_gmaps: z.string().optional().or(z.literal("")),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { member, isAuthenticated } = useAuth();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: member?.fullname || "",
      email: member?.email || "",
      phone_number: member?.phone_number || "",
      company_name: member?.company_name || "",
      street_address: "",
      district: "",
      city: "",
      state_province: "",
      postal_code: "",
      link_order_gmaps: "",
      lat_order_gmaps: "",
      long_order_gmaps: "",
    },
  });

  const [appliedVouchers, setAppliedVouchers] = useState<MemberVoucher[]>([]);
  const [voucherSearch, setVoucherSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleLocate = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoError(t("geo_not_supported"));
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toString();
        const lng = pos.coords.longitude.toString();
        setValue("lat_order_gmaps", lat);
        setValue("long_order_gmaps", lng);
        setValue("link_order_gmaps", `https://maps.google.com/?q=${lat},${lng}`);
        setIsLocating(false);
      },
      () => {
        setGeoError(t("geo_permission_denied"));
        setIsLocating(false);
      },
    );
  };

  const debouncedSearch = useDebounce(voucherSearch, 500);

  const { data: voucherData, isLoading: vouchersLoading } = useQuery({
    queryKey: ["memberVouchers", { search: debouncedSearch }],
    queryFn: () =>
      getVouchers({
        search: debouncedSearch || undefined,
        per_page: 100,
      }),
    enabled: isAuthenticated,
  });

  const availableVouchers = (voucherData?.data?.data ||
    voucherData?.data ||
    []) as MemberVoucher[];

  const getDisabledReason = (v: MemberVoucher): string | null => {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.quantity * (item.promo_price || item.price || 0),
      0,
    );
    if (v.voucher.min_product && totalQty < v.voucher.min_product) {
      return t("voucher_need_products", {
        min: v.voucher.min_product,
        current: totalQty,
        need: v.voucher.min_product - totalQty,
      });
    }
    if (v.voucher.min_transaction && totalAmount < v.voucher.min_transaction) {
      return t("voucher_need_transaction", {
        min: v.voucher.min_transaction.toLocaleString("id-ID"),
        current: totalAmount.toLocaleString("id-ID"),
      });
    }
    return null;
  };

  const filteredVouchers = availableVouchers;

  const isVoucherApplied = (code: string) =>
    appliedVouchers.some((v) => v.voucher_code === code);

  const toggleVoucher = (v: MemberVoucher) => {
    setAppliedVouchers((prev) => {
      const exists = prev.find((a) => a.voucher_code === v.voucher_code);
      if (exists) {
        return prev.filter((a) => a.voucher_code !== v.voucher_code);
      }
      return [...prev, v];
    });
  };

  const removeAppliedVoucher = (code: string) => {
    setAppliedVouchers((prev) => prev.filter((v) => v.voucher_code !== code));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const orderAddress = [
        body.street_address,
        body.district,
        body.city,
        body.state_province,
        body.postal_code,
      ]
        .filter(Boolean)
        .join(", ");

      const cartTotal = cart.reduce(
        (s, item) => s + (item.promo_price || item.price || 0) * item.quantity,
        0,
      );

      const payload = {
        name: body.name,
        email: body.email,
        phone_number: body.phone_number || undefined,
        company_name: body.company_name || undefined,
        street_address: body.street_address || undefined,
        district: body.district || undefined,
        city: body.city || undefined,
        state_province: body.state_province || undefined,
        postal_code: body.postal_code || undefined,
        order_address: orderAddress,
        link_order_gmaps: body.link_order_gmaps || undefined,
        lat_order_gmaps: body.lat_order_gmaps || undefined,
        long_order_gmaps: body.long_order_gmaps || undefined,
        voucher_codes: appliedVouchers.map((v) => v.voucher_code),
        disc_voucher: appliedVouchers.reduce((sum, v) => {
          if (v.voucher.discount_type === "fixed") {
            return sum + v.voucher.discount_value;
          }
          return sum + Math.floor((v.voucher.discount_value / 100) * cartTotal);
        }, 0),
        products: cart.map((item) => ({
          product_id: String(item.id),
          quantity: item.quantity,
        })),
      };

      return submitOrder(payload);
    },
    onSuccess: () => {
      toast.success(t("toast_success"));
      clearCart();
      router.push("/dashboard");
    },
    onError: () => {
      toast.error(t("toast_error"));
    },
  });

  return (
    <div className="checkout-container">
      <div className="checkout-heading">
        <h1>{t("heading")}</h1>
        <p>{t("sub_heading")}</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className="checkout-grid">
          {/* Left: Form */}
          <div className="checkout-form-wrap">
            {/* Personal Information */}
            <div className="checkout-card">
              <h3 className="checkout-card-title">{t("personal_info")}</h3>
              <div className="checkout-form-grid">
                <div className="checkout-form-group">
                  <label htmlFor="name">
                    {t("label_fullname")}{" "}
                    <span style={{ color: "#ba1a1a" }}>*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t("placeholder_fullname")}
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="checkout-feedback">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="email">
                    {t("label_email")}{" "}
                    <span style={{ color: "#ba1a1a" }}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t("placeholder_email")}
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="checkout-feedback">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="phone_number">{t("label_phone")}</label>
                  <input
                    id="phone_number"
                    type="tel"
                    placeholder={t("placeholder_phone")}
                    {...register("phone_number")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="company_name">
                    {t("label_company_name")}
                  </label>
                  <input
                    id="company_name"
                    type="text"
                    placeholder={t("placeholder_company_name")}
                    {...register("company_name")}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-card" style={{ marginTop: "24px" }}>
              <h3 className="checkout-card-title">{t("shipping_address")}</h3>
              <div className="checkout-form-grid">
                <div className="checkout-form-group full">
                  <label htmlFor="street_address">{t("label_street")}</label>
                  <input
                    id="street_address"
                    type="text"
                    placeholder={t("placeholder_street")}
                    {...register("street_address")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="district">{t("label_district")}</label>
                  <input
                    id="district"
                    type="text"
                    placeholder={t("placeholder_district")}
                    {...register("district")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="city">{t("label_city")}</label>
                  <input
                    id="city"
                    type="text"
                    placeholder={t("placeholder_city")}
                    {...register("city")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="state_province">{t("label_state")}</label>
                  <input
                    id="state_province"
                    type="text"
                    placeholder={t("placeholder_state")}
                    {...register("state_province")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="postal_code">{t("label_postal")}</label>
                  <input
                    id="postal_code"
                    type="text"
                    placeholder={t("placeholder_postal")}
                    {...register("postal_code")}
                  />
                </div>
                <div className="checkout-form-group full" style={{ alignItems: "flex-start" }}>
                  <button
                    type="button"
                    className="checkout-locate-btn"
                    onClick={handleLocate}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MapPin size={16} />
                    )}
                    {t("button_locate")}
                  </button>
                  {geoError && (
                    <span className="checkout-feedback">{geoError}</span>
                  )}
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="lat_order_gmaps">{t("label_lat")}</label>
                  <input
                    id="lat_order_gmaps"
                    type="text"
                    placeholder="-6.2088"
                    {...register("lat_order_gmaps")}
                  />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="long_order_gmaps">{t("label_long")}</label>
                  <input
                    id="long_order_gmaps"
                    type="text"
                    placeholder="106.8456"
                    {...register("long_order_gmaps")}
                  />
                </div>
                <div className="checkout-form-group full">
                  <label htmlFor="link_order_gmaps">
                    {t("label_gmaps_link")}
                  </label>
                  <input
                    id="link_order_gmaps"
                    type="text"
                    placeholder="https://maps.google.com/?q=..."
                    {...register("link_order_gmaps")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary-wrap">
            <OrderSummary />

            {/* Voucher / Promo */}
            <div
              className="checkout-summary-card"
              style={{ marginTop: "24px" }}
            >
              <div className="checkout-summary-header">
                <h2>{t("label_voucher")}</h2>
              </div>
              <div style={{ padding: "16px 32px 16px" }}>
                <div className="checkout-voucher-section" ref={popoverRef}>
                  <button
                    type="button"
                    className="checkout-voucher-trigger"
                    onClick={() => setPopoverOpen(!popoverOpen)}
                  >
                    <span>
                      {appliedVouchers.length > 0
                        ? `${appliedVouchers.length} voucher applied`
                        : t("voucher_trigger")}
                    </span>
                    <ChevronDown
                      size={18}
                      style={{
                        transition: "transform 0.2s",
                        transform: popoverOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </button>

                  {popoverOpen && (
                    <div className="checkout-voucher-popover">
                      <div className="checkout-voucher-search">
                        <Search size={16} className="search-icon" />
                        <input
                          type="text"
                          placeholder={t("voucher_search")}
                          value={voucherSearch}
                          onChange={(e) => setVoucherSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="checkout-voucher-list">
                        {vouchersLoading ? (
                          <div className="checkout-voucher-empty">
                            Loading...
                          </div>
                        ) : filteredVouchers.length === 0 ? (
                          <div className="checkout-voucher-empty">
                            {t("voucher_empty")}
                          </div>
                        ) : (
                          filteredVouchers.map((v) => (
                            <div
                              key={v.voucher_code}
                              className="checkout-voucher-item"
                            >
                              <div className="checkout-voucher-item-info">
                                <div className="voucher-item-code">
                                  {v.voucher_code}
                                </div>
                                <div className="voucher-item-name">
                                  {v.voucher.name}
                                </div>
                                <div
                                  className="voucher-item-discount"
                                  style={{
                                    fontSize: "12px",
                                    color: "#ba1a1a",
                                    fontWeight: 500,
                                    marginTop: "2px",
                                  }}
                                >
                                  {v.voucher.discount_type === "fixed"
                                    ? `Rp ${v.voucher.discount_value.toLocaleString()}`
                                    : `${v.voucher.discount_value}%`}
                </div>
                              </div>
                              <button
                                type="button"
                                className={`checkout-voucher-item-btn ${
                                  isVoucherApplied(v.voucher_code)
                                    ? "applied"
                                    : ""
                                }`}
                                disabled={
                                  !isVoucherApplied(v.voucher_code) &&
                                  !!getDisabledReason(v)
                                }
                                onClick={() => toggleVoucher(v)}
                              >
                                {isVoucherApplied(v.voucher_code)
                                  ? t("voucher_applied")
                                  : t("voucher_select")}
                              </button>
                              {!isVoucherApplied(v.voucher_code) &&
                                getDisabledReason(v) && (
                                  <div className="checkout-voucher-reason">
                                    {getDisabledReason(v)}
                                  </div>
                                )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {appliedVouchers.length > 0 && (
                  <div className="checkout-voucher-applied-list">
                    {appliedVouchers.map((v) => (
                      <div
                        key={v.voucher_code}
                        className="checkout-voucher-applied"
                      >
                        <div>
                          <div className="voucher-code">{v.voucher_code}</div>
                          <div className="voucher-name">{v.voucher.name}</div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#ba1a1a",
                              fontWeight: 500,
                              marginTop: "2px",
                            }}
                          >
                            {v.voucher.discount_type === "fixed"
                              ? `Rp ${v.voucher.discount_value.toLocaleString()}`
                              : `${v.voucher.discount_value}%`}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAppliedVoucher(v.voucher_code)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="checkout-submit" style={{ padding: "0 0 24px" }}>
              <button type="submit" disabled={isPending || cart.length === 0}>
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  t("button_submit")
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
