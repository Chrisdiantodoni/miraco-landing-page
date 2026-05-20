"use client";

import { useTranslations } from "next-intl";

export default function StatsGrid() {
  const t = useTranslations("dashboard");

  const stats = [
    { key: "orders", value: 12, icon: "ti-package", colorClass: "icon-orders" },
    {
      key: "referrals",
      value: 3,
      icon: "ti-share",
      colorClass: "icon-referrals",
    },
    {
      key: "samples",
      value: 5,
      icon: "ti-layers",
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
