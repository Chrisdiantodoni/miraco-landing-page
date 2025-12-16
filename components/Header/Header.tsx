/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import MobileMenu from "../MobileMenu";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/types/menu.types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "../language-switcher";
import CustomMUIDrawer from "./Drawer";
import { Collection } from "@/lib/types/settings";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import image from "@/public/images/miraco/logo/logo-miraco.png";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/lib/api/queries/settings";
import createStore from "../../context/index";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

export default function Header(props: {
  col1?: string;
  col2?: string;
  col3?: string;
  logo: string;
  hclass?: string;
  collections: Collection[];
}) {
  const pathname = usePathname();

  const { handle } = createStore((state) => state) as any;

  const t = useTranslations("header");

  const staticMenuData = t.raw("menu") as MenuItem[];

  const [menuActive, setMenuActive] = useState(false);
  const settings = useSiteSettings();

  const collectionItems = settings?.collections?.map((item) => ({
    title: item?.collection_name,
    link: `/collections/${item?.collection_name?.toLowerCase()}`,
  }));

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["getCollections"],
    queryFn: async () => {
      const response = await getCollection();
      return response;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const collections: Collection[] = data;
      console.log({ data });
      handle("collections", collections);
    }
  }, [isSuccess]);

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

  const renderMenuItems = (items: any[]) => {
    const newItems = items.map((item, index) => {
      if (index === 1) {
        return {
          ...item,
          submenu: collectionItems,
        };
      }
      return item;
    });
    return newItems.map((item, index) => (
      <li
        key={index}
        className={`nav-item ${item.submenu ? "menu-item-has-children" : ""} ${
          item.imageStyle ? "image-style-item" : ""
        }`}
      >
        {/* Main Menu Link */}
        <Link
          onClick={ClickHandler}
          href={item.link}
          className={`nav-link position-relative px-3 ${
            isActive(item.link) ? "active" : ""
          }`}
        >
          {item.title}
        </Link>

        {/* Submenu Level 1 */}
        {item.submenu && (
          <ul className={item.imageStyle ? "sub-menu image-style" : "sub-menu"}>
            {item.submenu.map((subitem: any, subindex: any) => (
              <li
                key={subindex}
                className={
                  subitem.submenu
                    ? "menu-item-has-children"
                    : "" + (subitem.image ? "has-image" : "")
                }
              >
                <Link
                  onClick={ClickHandler}
                  href={subitem.link}
                  className={`d-flex align-items-center w-100 ${
                    isActive(subitem.link) ? "active" : ""
                  }`}
                >
                  {subitem.image && (
                    <small className="inner me-3">
                      <Image
                        src={subitem.image}
                        alt={subitem.title}
                        width={24}
                        height={24}
                      />
                    </small>
                  )}
                  <span>{subitem.title}</span>
                </Link>

                {/* Sub-submenu Level 2 */}
                {subitem.submenu && (
                  <ul className="sub-menu">
                    {subitem.submenu.map(
                      (thirditem: any, thirdindex: number) => (
                        <li key={thirdindex}>
                          <Link
                            onClick={ClickHandler}
                            href={thirditem.link}
                            className={`d-block w-100 ${
                              isActive(thirditem.link) ? "active" : ""
                            }`}
                          >
                            {thirditem.title}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };
  // console.log({ settings });
  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setMenuActive(newOpen);
  // };
  // console.log(props.logo);

  return (
    <header id="header">
      {/* {JSON.stringify(props.collections)} */}
      <CustomMUIDrawer open={menuActive} onClose={() => setMenuActive(false)} />
      <div className={"" + props.hclass}>
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="row align-items-center g-lg-0 g-2">
            <div className={"mx-3 " + props.col1}>
              <div className="mobail-menu">
                <MobileMenu />
              </div>
            </div>
            <div className={"" + props.col2}>
              <div className="navbar-header d-flex justify-content-start">
                <Link onClick={ClickHandler} className="navbar-brand" href="/">
                  <Image
                    src={props.logo ?? image}
                    alt="Logo Perusahaan"
                    // ✅ 2. Gunakan width/height yang lebih kecil untuk tampilan default
                    width={150} // Ukuran lebih kecil untuk mobile
                    height={75} // Sesuaikan rasio
                    // ✅ Tambahkan style agar responsif, tetapi pastikan max-width tidak terlalu besar di mobile
                    style={{
                      width: "100%", // Agar mengisi container col2
                      maxWidth: "150px", // Batasi ukuran maksimal di mobile
                      height: "auto",
                    }}
                    priority
                  />
                </Link>
              </div>
            </div>
            <div className={"" + props.col3}>
              <div className="d-flex justify-content-end align-items-center">
                <div
                  id="navbar"
                  className="collapse navbar-collapse navigation-holder"
                >
                  <button className="menu-close">
                    <i className="ti-close"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0">
                    {renderMenuItems(staticMenuData)}
                  </ul>
                  <div className="header-right">
                    <div className="header-search-form-wrapper">
                      <div className="cart-search-contact">
                        <button
                          onClick={() => setMenuActive(!menuActive)}
                          className="search-toggle-btn"
                        >
                          <i className={`fi text-black flaticon-loupe`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Language Switcher */}
                  </div>
                  <div className="ms-lg-5 ms-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center pe-3">
                {/* Search Button (Selalu Tampilkan, Sembunyikan di Desktop karena sudah ada di #navbar) */}
                <div className="header-search-form-wrapper d-lg-none">
                  <div className="cart-search-contact">
                    <button
                      onClick={() => setMenuActive(!menuActive)}
                      className="search-toggle-btn"
                      aria-label="Toggle Search"
                    >
                      <i className={`fi text-black flaticon-loupe`}></i>
                      Search
                    </button>
                  </div>
                </div>

                {/* Language Switcher (Mobile) */}
                <div className="d-lg-none">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
