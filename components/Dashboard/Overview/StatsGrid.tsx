"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";

export default function StatsGrid() {
  const t = useTranslations("dashboard");
  const favouritesCount = useCartStore((state) => state.favourites.length);

  const stats = [
    {
      key: "orders",
      value: 12,
      icon: "ti-package",
      colorClass: "icon-orders",
    },
    {
      key: "favourites",
      value: favouritesCount,
      icon: "ti-heart",
      colorClass: "icon-referrals",
    },
    {
      key: "vouchers",
      value: 2,
      icon: "ti-tag",
      colorClass: "icon-samples",
    },
  ];

  return (
    <div className="dash-stats-grid">
      {stats.map((stat) => (
        <div key={stat.key} className="dash-stat-card">
          <div className={`dash-stat-icon ${stat.colorClass}`}>
            <i className={`fi ${stat.icon}`}></i>
          </div>
          <div>
            <div className="dash-stat-value">{stat.value}</div>
            <div className="dash-stat-label">{t(`stat_${stat.key}`)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
