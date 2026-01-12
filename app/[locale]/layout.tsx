import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import Logo from "@/public/images/logo.svg";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/TopBar";
import { Poppins } from "next/font/google";
import { Providers } from "./provider";
import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SiteSettingsProvider } from "@/lib/providers/SiteSettingProvider";
import { ToastContainer } from "react-toastify";
import { getSiteData } from "@/lib/api/queries/settings";
import { getLocale } from "next-intl/server";
import image from "@/public/images/miraco/logo/logo-miraco.png";
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap", // Penting untuk kinerja
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Pilih semua weight atau yang Anda butuhkan
  // Jika Anda ingin menggunakan font ini dengan Tailwind CSS:
  // variable: '--font-poppins',
});

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData({ locale: "en" });
  const settings = data.site_settings;

  return {
    title: "Miraco HPL",
    description: "Premium furniture materials",
    openGraph: {
      title: "Miraco HPL",
      description: "Premium furniture materials",
      images: [settings?.logo_dark_url],
    },
    robots: {
      googleBot: "notranslate",
    },
  };
}

// app/[locale]/layout.tsx
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }, { locale: "zh" }];
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const siteData = await getSiteData({ locale });

  return (
    <html
      // suppressHydrationWarning
      lang={locale}
      translate="no"
      className="notranslate"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="googlebot" content="notranslate" />
        <link rel="icon" href={siteData?.site_settings?.logo_dark_url} />
        <meta
          name="google"
          property="og:image"
          content={`${siteData?.site_settings?.logo_dark_url} notranslate`}
        />
      </head>
      <body className={poppins.className}>
        <SiteSettingsProvider settings={siteData}>
          <Providers>
            <NextIntlClientProvider>
              {/* <Topbar /> */}
              <Navbar
                collections={siteData.collections}
                hclass={"wpo-site-header wpo-header-style-s9 py-4"}
                Logo={siteData?.site_settings?.logo_dark_url ?? image}
                col1={"col-md-1 col-1 d-lg-none dl-block"}
                col2={"col-lg-2 col-md-6 col-6"}
                col3={
                  "col-lg-10 col-md-4 col-4 d-flex justify-content-end align-items-center"
                }
              />
              {children}

              <Footer logo={siteData?.site_settings?.logo_white_url ?? image} />
              <ToastContainer />
            </NextIntlClientProvider>
          </Providers>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
