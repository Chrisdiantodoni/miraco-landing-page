"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function QuickActions() {
  const t = useTranslations("dashboard");

  const actions = [
    { key: "new_order", icon: "ti-plus", href: "/dashboard/orders" },
    { key: "request_sample", icon: "ti-layers", href: "/dashboard/referral" },
    {
      key: "download_catalogue",
      icon: "ti-download",
      href: "/e-catalogue",
    },
  ];

  return (
    <div className="dash-quick-actions">
      {actions.map((action) => (
        <Link
          key={action.key}
          href={action.href}
          className="dash-action-btn"
        >
          <i className={`fi ${action.icon}`}></i>
          {t(`action_${action.key}`)}
        </Link>
      ))}
    </div>
  );
}
