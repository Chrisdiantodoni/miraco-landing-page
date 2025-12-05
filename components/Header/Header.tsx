"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../MobileMenu";
import { usePathname } from "next/navigation";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

// Menu Items Data - Multi Language
const menuDataEN = [
  { title: "Home", link: "/" },
  {
    title: "Collections",
    link: "#",
    submenu: [
      { title: "About Us", link: "/about" },
      { title: "Services", link: "#" },
    ],
  },
  { title: "Request", link: "#" },
  { title: "Projects", link: "#" },
  { title: "Locate Us", link: "#" },
  { title: "E-Catalogue", link: "#" },
];

const menuDataID = [
  { title: "Beranda", link: "/" },
  {
    title: "Koleksi",
    link: "#",
    submenu: [
      { title: "Tentang Kami", link: "/about" },
      { title: "Layanan", link: "#" },
    ],
  },
  { title: "Permintaan", link: "#" },
  { title: "Proyek", link: "#" },
  { title: "Temukan Kami", link: "#" },
  { title: "E-Katalog", link: "#" },
];

const menuDataZH = [
  { title: "主页", link: "/" },
  {
    title: "收藏",
    link: "#",
    submenu: [
      { title: "关于我们", link: "/about" },
      { title: "服务", link: "#" },
    ],
  },
  { title: "请求", link: "#" },
  { title: "项目", link: "#" },
  { title: "找到我们", link: "#" },
  { title: "电子目录", link: "#" },
];

const languageOptions = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "ID", label: "Indonesia", flag: "🇮🇩" },
  { code: "ZH", label: "中文", flag: "🇨🇳" },
];

const getMenuByLanguage = (lang) => {
  switch (lang) {
    case "ID":
      return menuDataID;
    case "ZH":
      return menuDataZH;
    default:
      return menuDataEN;
  }
};

export default function Header(props) {
  const pathname = usePathname();

  const [menuActive, setMenuState] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  const currentMenuData = getMenuByLanguage(language);

  //   const renderMenuItems = (items) => {
  //     return items.map((item, index) => (
  //       <li
  //         key={index}
  //         className={`nav-item ${item.submenu ? "menu-item-has-children" : ""}`}
  //       >
  //         <Link
  //           onClick={ClickHandler}
  //           href={item.link}
  //           className="nav-link position-relative px-3"
  //           style={{
  //             fontWeight: "500",
  //             color: "#333",
  //             padding: "0.5rem 1rem",
  //             textDecoration: "none",
  //           }}
  //         >
  //           {item.title}
  //           {/* Underline element - HITAM */}
  //           <span
  //             className="position-absolute bottom-0 start-0 w-0 h-0.5 bg-dark transition-all duration-300"
  //             style={{
  //               backgroundColor: "#000000",
  //               transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  //             }}
  //           ></span>
  //         </Link>
  //         {item.submenu && (
  //           <ul className={item.imageStyle ? "sub-menu image-style" : "sub-menu"}>
  //             {item.submenu.map((subitem, subindex) => (
  //               <li
  //                 key={subindex}
  //                 className={subitem.submenu ? "menu-item-has-children" : ""}
  //               >
  //                 <Link onClick={ClickHandler} href={subitem.link}>
  //                   {subitem.image && (
  //                     <small className="inner">
  //                       <Image src={subitem.image} alt={subitem.title} />
  //                     </small>
  //                   )}
  //                   <span>{subitem.title}</span>
  //                 </Link>
  //                 {subitem.submenu && (
  //                   <ul className="sub-menu">
  //                     {subitem.submenu.map((thirditem, thirdindex) => (
  //                       <li key={thirdindex}>
  //                         <Link onClick={ClickHandler} href={thirditem.link}>
  //                           {thirditem.title}
  //                         </Link>
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 )}
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //       </li>
  //     ));
  //   };

  // Di komponen utama, tambahkan logic untuk active state

  const isActive = (link) =>
    pathname === link || pathname.startsWith(link + "/");

  const renderMenuItems = (items) => {
    return items.map((item, index) => (
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
            {item.submenu.map((subitem, subindex) => (
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
                    {subitem.submenu.map((thirditem, thirdindex) => (
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
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };
  return (
    <header id="header">
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
                  <Image src={props.Logo} alt="" />
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
                    {renderMenuItems(currentMenuData)}
                  </ul>
                  <div className="header-right">
                    <div className="header-search-form-wrapper">
                      <div className="cart-search-contact">
                        <button
                          onClick={() => setMenuState(!menuActive)}
                          className="search-toggle-btn"
                        >
                          <i
                            className={`fi text-black ${
                              menuActive ? "ti-close" : "flaticon-loupe"
                            }`}
                          ></i>
                        </button>
                        <div
                          className={`header-search-form ${
                            menuActive ? "header-search-content-toggle" : ""
                          }`}
                        >
                          <form onSubmit={SubmitHandler}>
                            <div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search here..."
                              />
                              <button type="submit">
                                <i className="fi flaticon-loupe"></i>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Language Switcher */}
                    <div
                      className="language-switcher"
                      style={{
                        marginLeft: "20px",
                        position: "relative",
                      }}
                    >
                      <button
                        className="lang-toggle-btn"
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        style={{
                          background: "none",
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        <span>
                          {
                            languageOptions.find((l) => l.code === language)
                              ?.flag
                          }
                        </span>
                        <span>{language}</span>
                        <i
                          className={`fi ${
                            langDropdownOpen ? "ti-angle-up" : "ti-angle-down"
                          }`}
                        ></i>
                      </button>

                      {langDropdownOpen && (
                        <div
                          className="lang-dropdown"
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            marginTop: "8px",
                            minWidth: "140px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            zIndex: 1000,
                          }}
                        >
                          {languageOptions.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setLangDropdownOpen(false);
                              }}
                              style={{
                                width: "100%",
                                padding: "12px 16px",
                                background:
                                  language === lang.code ? "#f0f0f0" : "white",
                                border: "none",
                                textAlign: "left",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                borderBottom:
                                  lang.code !== "ZH"
                                    ? "1px solid #eee"
                                    : "none",
                                transition: "background 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                if (language !== lang.code) {
                                  e.target.style.background = "#f9f9f9";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background =
                                  language === lang.code ? "#f0f0f0" : "white";
                              }}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
