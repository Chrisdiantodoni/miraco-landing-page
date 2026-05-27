"use client";

import { usePathname } from "next/navigation";
import NavbarV2 from "@/components/NavbarV2";
import Footer from "@/components/Footer/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ToastContainer } from "react-toastify";
import image from "@/public/images/miraco/logo/logo-miraco.png";
import { SiteData } from "@/lib/types/settings";
import CartDrawer from "@/components/Cart/CartDrawer";

export default function PublicShell({
  children,
  siteData,
}: {
  children: React.ReactNode;
  siteData: SiteData;
}) {
  const pathname = usePathname();
  const isDashboard = /^\/(en|id|zh)\/dashboard/.test(pathname);

  return (
    <>
      <NavbarV2
        collections={siteData.collections}
        logo={siteData?.site_settings?.logo_dark_url ?? image}
      />
      {children}
      <Footer logo={siteData?.site_settings?.logo_white_url ?? image} />
      {!isDashboard && <FloatingWhatsApp />}
      <ToastContainer />
      <CartDrawer />
    </>
  );
}
