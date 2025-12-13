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

  const t = useTranslations("header");

  const staticMenuData = t.raw("menu") as MenuItem[];

  const [menuActive, setMenuActive] = useState(false);
  const settings = useSiteSettings();

  const collectionItems = settings?.collections?.map((item) => ({
    title: item?.collection_name,
    link: `/collections/${item?.collection_name}`,
  }));

  // Di komponen utama, tambahkan logic untuk active state
  const isActive = (link: string) => {
    // Hapus locale prefix dari pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|id|zh)\//, "/");

    // Juga handle case tanpa trailing slash setelah locale
    const cleanPathname = pathWithoutLocale === "" ? "/" : pathWithoutLocale;

    return cleanPathname === link || cleanPathname.startsWith(link + "/");
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

  const toggleDrawer = (newOpen: boolean) => () => {
    setMenuActive(newOpen);
  };
  // console.log(props.logo);

  return (
    <header id="header">
      {/* {JSON.stringify(props.collections)} */}
      <CustomMUIDrawer open={menuActive} onClose={() => setMenuActive(false)} />
      <div className={"" + props.hclass}>
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="row align-items-center g-0">
            <div className={"" + props.col1}>
              <div className="mobail-menu">
                <MobileMenu />
              </div>
            </div>
            <div className={"" + props.col2}>
              <div className="navbar-header">
                <Link
                  onClick={ClickHandler}
                  className="navbar-brand"
                  href="/home"
                >
                  <Image
                    src={props.logo}
                    alt="Logo Perusahaan"
                    width={400} // Ganti dengan ukuran yang sesuai
                    height={200} // Ganti dengan ukuran yang sesuai
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
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
