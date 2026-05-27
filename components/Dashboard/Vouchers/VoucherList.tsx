"use client";

import { useTranslations } from "next-intl";

const vouchers = [
  {
    code: "WELCOME20",
    discount: "20% off first order",
    expires: "2026-06-30",
  },
  {
    code: "NEWYEAR25",
    discount: "15% off all products",
    expires: "2026-07-15",
  },
  {
    code: "FREESHIP",
    discount: "Free shipping nationwide",
    expires: "2026-05-31",
  },
];

export default function VoucherList() {
  const t = useTranslations("dashboard");

  return (
    <div className="dash-vouchers-grid">
      {vouchers.map((v) => (
        <div key={v.code} className="dash-voucher-card">
          <span className="dash-voucher-code">{v.code}</span>
          <div className="dash-voucher-discount">{v.discount}</div>
          <div className="dash-voucher-expiry">
            {t("voucher_expires")}: {v.expires}
          </div>
          <button className="dash-voucher-btn">{t("voucher_use")}</button>
        </div>
      ))}
    </div>
  );
}
