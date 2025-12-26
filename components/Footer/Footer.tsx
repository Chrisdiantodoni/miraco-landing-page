"use client";

// images
import Logo from "@/public/images/miraco/logo/logo-miraco-light.png";
import Image from "next/image";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { SocialWidget } from "./SocialWidget";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { MenuItem } from "@/types/menu.types";
import { usePathname } from "next/navigation";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const Footer = (props: { logo: string }) => {
  const data = useSiteSettings();
  const t = useTranslations("Footer");
  const tH = useTranslations("header");
  const pathname = usePathname();

  const staticMenuData = tH.raw("menu") as MenuItem[];

  const isActive = (link: string) => {
    // 1. --- BERSIHKAN CLEAN PATHNAME (PATH SAAT INI) ---
    const pathWithoutQuery = pathname.split("?")[0];

    // Perbaikan Regex: Mencocokkan ^/ diikuti (en|id|zh) diikuti (secara opsional) oleh /
    // Diganti dengan '/', sehingga /id atau /en/collections menjadi / atau /collections
    const pathWithoutLocale = pathWithoutQuery.replace(/^\/(en|id|zh)\/?/, "/");

    // Pastikan hasil akhirnya '/'. Tidak perlu normalisasi ekstra jika regex di atas sudah benar.
    const cleanPathname = pathWithoutLocale;

    // 2. --- BERSIHKAN LINK TARGET (MENU ITEM) ---
    const targetLinkWithoutQuery = link.split("?")[0];

    // 3. --- PERBANDINGAN BERKONDISI ---

    // Kondisi 1: Home (Link target adalah '/')
    if (targetLinkWithoutQuery === "/") {
      // Halaman Home hanya aktif jika Clean Path benar-benar '/' (bukan '/collections/kayu')
      return cleanPathname === "/";
    }

    // Kondisi 2: Halaman Non-Home
    // a. Cocok persis (e.g., /about === /about)
    const isExactMatch = cleanPathname === targetLinkWithoutQuery;

    // b. Cocok sebagai prefix (e.g., /collections/kayu/detail... mulai dengan /collections/kayu/)
    // Tambahkan '/' di akhir link target untuk memastikan itu adalah folder/path, bukan string acak.
    const prefix = targetLinkWithoutQuery + "/";
    const isPrefixMatch = cleanPathname.startsWith(prefix);

    // console.log(`Clean Path: ${cleanPathname}, Target Link: ${targetLinkWithoutQuery}`);
    // console.log(`Is Exact Match: ${isExactMatch}, Is Prefix Match: ${isPrefixMatch}`);

    return isExactMatch || isPrefixMatch;
  };

  return (
    <footer className="wpo-site-footer">
      <div className="wpo-upper-footer">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget about-widget">
                <div className="logo widget-title">
                  <Image src={Logo} alt="blog" width={400} height={200} />
                </div>
                <p>{t("content")}</p>
                <SocialWidget
                  social={data?.site_settings}
                  onClick={ClickHandler}
                />
              </div>
            </div>
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3>{t("contact")}</h3>
                </div>
                <ul>
                  <li>{data?.site_settings?.email_contacts}</li>
                  <li>{data?.site_settings?.phone_contacts}</li>
                  <li>{data?.site_settings?.address}</li>
                </ul>
              </div>
            </div>
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3>{t("quick_link")}</h3>
                </div>
                <ul>
                  {staticMenuData?.map((item, index) => (
                    <li key={index}>
                      <Link onClick={ClickHandler} href={item?.link}>
                        {item?.title}
                      </Link>
                    </li>
                  ))}
                  {/* <li>
                    <Link onClick={ClickHandler} href="/projects">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/locate-us">
                      Locate Us
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/e-catalogue">
                      E-Catalogue
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
            {/* <div
              className="col col-lg-3 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget newsletter-widget">
                <div className="widget-title">
                  <h3>Newsletter</h3>
                </div>
                <form>
                  <input
                    type="email"
                    className="input-fild"
                    placeholder="Your Email..."
                  />
                  <button>Subscribe</button>
                </form>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/*
      <div className="wpo-lower-footer">
        <div className="container-fluid">
          <div className="row g-0">
            <div className="col col-lg-6 col-12">
              <p className="copyright">
                {" "}
                Copyright &copy; 2025 Miraco. All Rights Reserved.
              </p>
            </div>
            <div className="col col-lg-6 col-12">
              <ul className="right">
                <li>
                  <Link onClick={ClickHandler} href="/privacy">
                    <span className="rolling-text">privacy & Policy</span>{" "}
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/terms">
                    <span className="rolling-text">Terms</span>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/about">
                    <span className="rolling-text">About us</span>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/login">
                    <span className="rolling-text">Login</span>
                  </Link>
                </li>
              </ul>
            </div> 
          </div>
        </div>
      </div>
      */}
    </footer>
  );
};

export default Footer;
