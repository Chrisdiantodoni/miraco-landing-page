"use client";

import { useTranslations } from "next-intl";

interface DashboardData {
  total_approved?: number;
  order_count?: number;
  favourite_count?: number;
  vouchers?: { active: number; pending: number; terminated: number; total: number };
  referral_count?: number;
  recent_orders?: any[];
}

export default function StatsGrid({ dashboard }: { dashboard?: DashboardData }) {
  const t = useTranslations("dashboard");

  const stats = [
    {
      key: "orders",
      value: dashboard?.order_count ?? 0,
      icon: "ti-package",
      colorClass: "icon-orders",
    },
    {
      key: "favourites",
      value: dashboard?.favourite_count ?? 0,
      icon: "ti-heart",
      colorClass: "icon-referrals",
    },
    {
      key: "vouchers",
      value: dashboard?.vouchers?.total ?? 0,
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
