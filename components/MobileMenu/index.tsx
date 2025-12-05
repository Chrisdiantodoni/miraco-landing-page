import React, { Fragment, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import Link from "next/link";

const menus = [
  {
    id: 1,
    title: "Home",
    link: "#",
    submenu: [
      {
        id: 11,
        title: "Modern Architecture",
        link: "/home",
      },
      {
        id: 12,
        title: "Classic Architecture",
        link: "/bliize-classic-architecture",
      },
      {
        id: 13,
        title: "Modern Architecture 02",
        link: "/bliize-modern-architecture-s2",
      },
      {
        id: 14,
        title: "Classic Architecture Dark",
        link: "/bliize-classic-architecture-dark",
      },
      {
        id: 15,
        title: "Classic Interior Design",
        link: "/bliize-classic-interior-design",
      },

      {
        id: 16,
        title: "Classic Interior Design 02",
        link: "/bliize-classic-interior-design-s2",
      },

      {
        id: 17,
        title: "Classic Interior Design Dark",
        link: '/bliize-classic-interior-design-dark"',
      },

      {
        id: 18,
        title: "Renovation",
        link: "/bliize-renovation",
      },

      {
        id: 19,
        title: "Modern Woocommerce",
        link: "/bliize-modern-woocommerce",
      },
      {
        id: 120,
        title: "Minimal Woocommerce",
        link: "/bliize-minimal-woocommerce",
      },
      {
        id: 121,
        title: "Urban Planning",
        link: "/bliize-urban-planning",
      },
      {
        id: 122,
        title: "Costruction",
        link: "/bliize-costruction",
      },
      {
        id: 123,
        title: "Costruction 02",
        link: "/bliize-costruction-s2",
      },
      {
        id: 124,
        title: "Costruction Profile",
        link: "/bliize-costruction-profile",
      },
      {
        id: 125,
        title: "Frelancer Architect",
        link: "/bliize-frelancer-architect",
      },
    ],
  },

  {
    id: 2,
    title: "Pages",
    link: "#",
    submenu: [
      {
        id: 21,
        title: "About Us",
        link: "/about",
      },
      {
        id: 22,
        title: "Services",
        link: "/services",
      },
      {
        id: 23,
        title: "Service single",
        link: "/service-single/Custom-Solutions",
      },
      {
        id: 24,
        title: "Team",
        link: "/team",
      },
      {
        id: 25,
        title: "Team single",
        link: "/team-single/Robert-Fox",
      },
      {
        id: 26,
        title: "Pricing",
        link: "/pricing",
      },
      {
        id: 27,
        title: "Login",
        link: "/login",
      },
      {
        id: 28,
        title: "Contact Us",
        link: "/contact",
      },
      {
        id: 29,
        title: "privacy",
        link: "/privacy",
      },
      {
        id: 221,
        title: "Terms",
        link: "/terms",
      },
      {
        id: 222,
        title: "404 Error",
        link: "/404",
      },
    ],
  },

  {
    id: 3,
    title: "Projects",
    link: "#",
    submenu: [
      {
        id: 31,
        title: "Projects",
        link: "/projects",
      },
      {
        id: 32,
        title: "Projects Single",
        link: "/project-single/Modern-House-In-UK",
      },
    ],
  },

  {
    id: 4,
    title: "Shop",
    link: "#",
    submenu: [
      {
        id: 41,
        title: "Shop",
        link: "/shop",
      },
      {
        id: 42,
        title: "Shop Single",
        link: "/shop-single/Fresh-key-Lime",
      },
      {
        id: 43,
        title: "Cart",
        link: "/cart",
      },
      {
        id: 44,
        title: "Checkout",
        link: "/checkout",
      },
      {
        id: 45,
        title: "Wishlist",
        link: "/wishlist",
      },
    ],
  },
  {
    id: 5,
    title: "Blog",
    link: "#",
    submenu: [
      {
        id: 51,
        title: "Blog",
        link: "/blog",
      },
      {
        id: 52,
        title: "Blog Left sidebar",
        link: "/blog-left-sidebar",
      },
      {
        id: 53,
        title: "Blog full width",
        link: "/blog-fullwidth",
      },
      {
        id: 54,
        title: "Blog single",
        link: "/blog-single/How-To-Teach-Kids-Ramadan-Isn’t-About-Food1",
      },
    ],
  },
];

const MobileMenu = () => {
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div>
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => setMenuState(!menuActive)}>
            <i className="ti-close"></i>
          </div>
        </div>

        <ul className="responsivemenu">
          {menus.map((item, mn) => {
            return (
              <ListItem className={item.id === openId ? "active" : ""} key={mn}>
                {item.submenu ? (
                  <Fragment>
                    <p
                      onClick={() =>
                        setOpenId(item.id === openId ? 0 : item.id)
                      }
                    >
                      {item.title}
                      <i
                        className={
                          item.id === openId
                            ? "fa fa-angle-up"
                            : "fa fa-angle-down"
                        }
                      ></i>
                    </p>
                    <Collapse
                      in={item.id === openId}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List className="subMenu">
                        <Fragment>
                          {item.submenu.map((submenu, i) => {
                            return (
                              <ListItem key={i}>
                                <Link
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
                  <Link className="active" href={item.link}>
                    {item.title}
                  </Link>
                )}
              </ListItem>
            );
          })}
        </ul>
      </div>

      <div
        className="showmenu mobail-menu"
        onClick={() => setMenuState(!menuActive)}
      >
        <button type="button" className="navbar-toggler open-btn">
          <span className="icon-bar first-angle"></span>
          <span className="icon-bar middle-angle"></span>
          <span className="icon-bar last-angle"></span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
