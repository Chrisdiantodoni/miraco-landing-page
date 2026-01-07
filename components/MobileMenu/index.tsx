import React, { Fragment, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MenuItem } from "@/types/menu.types";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { X, Menu } from "lucide-react";

const MobileMenu = () => {
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);
  const settings = useSiteSettings();

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  const t = useTranslations("header");

  const staticMenuData = t.raw("menu") as MenuItem[];
  const collectionItems = settings?.collections?.map((item) => ({
    title: item?.collection_name,
    link: `/collections/${item?.collection_name?.toLowerCase()}`,
  }));

  const newItems = staticMenuData.map((item, index) => {
    if (index === 1) {
      return {
        ...item,
        submenu: collectionItems,
      };
    }
    return item;
  });
  // Handler untuk menutup menu
  const closeMenu = () => {
    setMenuState(false);
  };

  return (
    <div>
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => setMenuState(!menuActive)}>
            <X />
          </div>
        </div>

        <ul className="responsivemenu">
          {newItems.map((item, mn) => {
            const hasSubmenu = !!item.submenu;
            const linkProps = {
              className: "active",
              onClick: ClickHandler,
              // Jika memiliki submenu, gunakan onClick untuk toggle, bukan untuk navigasi langsung
              href: hasSubmenu ? "#" : item.link,
            };
            return (
              <ListItem className={item.id === openId ? "active" : ""} key={mn}>
                {item.submenu ? (
                  <Fragment>
                    <Link
                      prefetch
                      {...linkProps}
                      // Lakukan toggle hanya jika ada submenu
                      onClick={(e) => {
                        ClickHandler(); // Scroll handler
                        if (hasSubmenu) {
                          e.preventDefault(); // Mencegah navigasi ke '#'
                          setOpenId(
                            item.id === openId ? 0 : (item.id as number)
                          );
                        }
                      }}
                      style={{
                        // Terapkan display: flex agar ikon dan teks sejajar vertikal
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // Jika Anda mempertahankan padding di CSS, ini mungkin tidak perlu
                      }}
                    >
                      {item.title}
                      {hasSubmenu && (
                        <i
                          className={
                            item.id === openId
                              ? "fa fa-angle-up"
                              : "fa fa-angle-down"
                          }
                          style={{
                            // Ikon panah harus diletakkan di sini, bukan di p
                            // Hapus CSS absolute dari ikon di p
                            position: "static", // override absolute jika ada CSS li i
                            marginLeft: "10px",
                          }}
                        ></i>
                      )}
                    </Link>
                    <Collapse
                      in={item.id === openId}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List className="subMenu" disablePadding>
                        <Fragment>
                          {item.submenu.map((submenu, i) => {
                            return (
                              <ListItem key={i}>
                                <Link
                                  prefetch
                                  onClick={ClickHandler}
                                  className="active"
                                  href={submenu.link}
                                >
                                  {submenu.title}
                                </Link>
                              </ListItem>
                            );
                          })}
                        </Fragment>
                      </List>
                    </Collapse>
                  </Fragment>
                ) : (
                  <Link className="active" href={item.link} prefetch>
                    {item.title}
                  </Link>
                )}
              </ListItem>
            );
          })}
        </ul>
      </div>
      <div
        className={`menu-overlay ${menuActive ? "show" : ""}`}
        onClick={closeMenu}
      />
      <div
        className="showmenu mobail-menu"
        onClick={() => setMenuState(!menuActive)}
      >
        <button
          type="button"
          className="navbar-toggler open-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Menu className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
