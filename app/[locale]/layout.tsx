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
import { SiteData } from "../../lib/types/settings.d";
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
  const locale = await getLocale();
  const data = (await getSiteData({ locale })) as SiteData;
  const settings = data.site_settings;
  const collections = data.collections || [];
  const categories = data.categories || [];

  // ✅ Filter dan ambil hanya URL yang valid (bukan null/undefined)
  const collectionImages = collections
    .map((col) => col.image_url)
    .filter((url): url is string => Boolean(url)); // Type guard

  // Build keywords dari categories dan collections
  const categoryNames = categories.map((cat) => cat.category_name).join(", ");
  const collectionNames = collections
    .map((col) => col.collection_name)
    .join(", ");

  // Build description yang lebih rich
  const description =
    "Miraco HPL - Premium High Pressure Laminate for furniture and interior design. " +
    `Explore our collections: ${collectionNames}. ` +
    `Available in ${categoryNames} categories.`;

  return {
    title: "Miraco HPL | Premium High Pressure Laminate",
    description: description.substring(0, 160),
    keywords: `Miraco HPL, High Pressure Laminate, ${categoryNames}, ${collectionNames}, furniture materials, interior design`,

    openGraph: {
      title: "Miraco HPL | Premium High Pressure Laminate",
      description: description.substring(0, 160),
      type: "website",
      locale: locale,
      siteName: "Miraco HPL",
      url: "https://miracohpl.com",
      // ✅ Hanya set images jika ada URL yang valid
      ...(collectionImages.length > 0 && {
        images: [
          {
            url: collectionImages[0], // Sudah pasti string, bukan null
            width: 1200,
            height: 630,
            alt: "Miraco HPL Collections",
          },
        ],
      }),
      // ✅ Fallback ke logo jika ada
      ...(!collectionImages.length &&
        settings?.logo_dark_url && {
          images: [
            {
              url: settings.logo_dark_url,
              width: 800,
              height: 600,
              alt: "Miraco HPL Logo",
            },
          ],
        }),
    },

    twitter: {
      card: "summary_large_image",
      title: "Miraco HPL | Premium High Pressure Laminate",
      description: description.substring(0, 160),
      // ✅ Hanya set images jika ada
      ...(collectionImages.length > 0 && {
        images: [collectionImages[0]],
      }),
    },

    alternates: {
      canonical: "https://miracohpl.com",
      languages: {
        en: "https://miracohpl.com/en",
        id: "https://miracohpl.com/id",
        zh: "https://miracohpl.com/zh",
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
        notranslate: true,
      },
    },

    category: "Business",
    applicationName: "Miraco HPL",
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
