"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/queries/member";
import StatsGrid from "@/components/Dashboard/Overview/StatsGrid";
import WelcomeCard from "@/components/Dashboard/Overview/WelcomeCard";
import Loading from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const { data: dashData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  const dashboard = dashData?.data;

  if (isLoading) {
    return (
      <Loading size="small" text={t("orders_loading")} image={image} imageSize={60} />
    );
  }

  return (
    <>
      <StatsGrid dashboard={dashboard} />
      <WelcomeCard dashboard={dashboard} />
    </>
  );
}
