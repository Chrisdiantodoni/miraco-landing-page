"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const navItems = [
  { key: "overview", icon: "ti-dashboard", href: "/dashboard" },
  { key: "orders", icon: "ti-package", href: "/dashboard/orders" },
  { key: "catalogue", icon: "ti-book", href: "/dashboard/referral" },
  { key: "referral", icon: "ti-user", href: "/dashboard/referral" },
  { key: "vouchers", icon: "ti-tag", href: "/dashboard/vouchers" },
  { key: "settings", icon: "ti-settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  const normalizedPath = pathname.replace(/^\/(en|id|zh)/, "") || "/";

  const isActiveDashboard = (href: string) => {
    if (href === "/dashboard") return normalizedPath === "/dashboard";
    return normalizedPath.startsWith(href);
  };

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-brand">
        <h2>Miraco Dashboard</h2>
        <p>{t("partner_tier")}</p>
      </div>

      <nav className="dash-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`dash-sidebar-link ${
              isActiveDashboard(item.href) ? "active" : ""
            }`}
          >
            <i className={`fi ${item.icon}`}></i>
            <span>{t(`nav_${item.key}`)}</span>
          </Link>
        ))}
      </nav>

      <Link href="/login" className="dash-sidebar-logout">
        <i className="fi ti-shift-right"></i>
        <span>{t("logout")}</span>
      </Link>
    </aside>
  );
}
