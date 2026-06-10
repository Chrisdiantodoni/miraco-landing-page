"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Collection } from "@/lib/types/settings";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { useAuth } from "@/lib/providers/AuthProvider";
import { useCartStore } from "@/lib/store/cart";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/lib/api/queries/settings";
import createStore from "@/context/index";
import CustomMUIDrawer from "./Drawer";
import fallbackLogo from "@/public/images/miraco/avatar.webp";

const languageOptions = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
  { code: "zh", label: "CN" },
];

interface HeaderV2Props {
  logo: string;
  collections: Collection[];
}

export default function HeaderV2({ logo, collections }: HeaderV2Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("header");
  const settings = useSiteSettings();
  const { member, isAuthenticated, logout } = useAuth();
  const cartCount = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );
  const { handle } = createStore((state) => state);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const menuData = t.raw("menu") as { title: string; link: string }[];

  const nameToSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  const isActive = (link: string) => {
    const pathWithoutQuery = pathname.split("?")[0];
    const pathWithoutLocale = pathWithoutQuery.replace(/^\/(en|id|zh)\/?/, "/");
    const cleanPathname = pathWithoutLocale;
    const target = link.split("?")[0];
    if (target === "/") return cleanPathname === "/";
    return cleanPathname === target || cleanPathname.startsWith(target + "/");
  };

  const isSubActive = (slug: string) =>
    isActive(`/collections/${slug}`) || pathname.includes(slug);

  // --- Language Switcher ---
  const { data: collectionData } = useQuery({
    queryKey: ["getCollectionsForLang"],
    queryFn: async () => {
      const response = await getCollection();
      return response;
    },
    enabled: langOpen,
  });

  const getTranslatedPath = (targetLocale: string) => {
    try {
      const decodedPathname = decodeURIComponent(pathname);
      const segments = decodedPathname.split("/").filter(Boolean);
      const pathSegments =
        segments[0] === locale ? segments.slice(1) : segments;

      const translatedSegments = pathSegments.map((segment) => {
        const matchedCollection = collectionData?.find((c: any) => {
          return (
            nameToSlug(c.name_en || "") === segment ||
            nameToSlug(c.name_id || "") === segment ||
            nameToSlug(c.name_zh || "") === segment
          );
        });
        if (matchedCollection) {
          const targetName = matchedCollection[`name_${targetLocale}`];
          return nameToSlug(targetName);
        }
        return segment;
      });
      return `/${translatedSegments.join("/")}`;
    } catch {
      return pathname;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);
  // --- End Language Switcher ---

  const collectionItems = collections.map((c) => ({
    title: c.collection_name,
    slug: nameToSlug(c.collection_name),
  }));

  const hasCollections = collectionItems.length > 0;

  const isCollectionActive = collectionItems.some((item) =>
    isActive(`/collections/${item.slug}`),
  );

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <CustomMUIDrawer />

      <div className="wpo-header-v2-inner">
        {/* Logo */}
        <Link href="/" className="wpo-header-v2-logo">
          <Image
            src={logo || settings?.logo_dark_url || fallbackLogo}
            alt="Miraco HPL"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="wpo-header-v2-nav">
          {menuData
            .map((item, i) => {
              const isCollections = item.link === "#";

              if (isCollections && hasCollections) {
                return (
                  <li key={i} className="wpo-header-v2-nav-item">
                    <Link
                      href={item.link}
                      className={`wpo-header-v2-nav-link ${isCollectionActive ? "active" : ""}`}
                    >
                      {item.title}
                    </Link>
                    <ul className="wpo-header-v2-dropdown">
                      {collectionItems.map((col, j) => (
                        <li key={j}>
                          <Link
                            href={`/collections/${col.slug}`}
                            className={`wpo-header-v2-dropdown-link ${
                              isSubActive(col.slug) ? "active" : ""
                            }`}
                          >
                            {col.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={i} className="wpo-header-v2-nav-item">
                  <Link
                    href={item.link}
                    className={`wpo-header-v2-nav-link ${
                      isActive(item.link) ? "active" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
        </ul>

        {/* Actions */}
        <div className="wpo-header-v2-actions">
          {/* Search */}
          <button
            className="wpo-header-v2-icon-btn"
            onClick={() => handle!("isOpenDrawer", true)}
            aria-label="Search"
          >
            <i className="fi flaticon-loupe"></i>
          </button>

          {/* Cart */}
          <button
            className="wpo-header-v2-icon-btn"
            onClick={() => useCartStore.getState().toggleCart()}
            aria-label="Cart"
          >
            <i className="fi flaticon-shopping-bag"></i>
            {cartCount > 0 && (
              <span className="wpo-header-v2-cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Auth: Profile or Login */}
          {isAuthenticated ? (
            <div className="wpo-header-v2-profile">
              <Image
                className="wpo-header-v2-profile-avatar"
                src={member?.profile_photo || fallbackLogo}
                alt={member?.fullname || "Profile"}
                width={40}
                height={40}
              />
              <ul className="wpo-header-v2-profile-menu">
                <li className="wpo-header-v2-profile-menu-header">
                  <div className="wpo-header-v2-profile-menu-avatar">
                    <Image
                      src={member?.profile_photo || fallbackLogo}
                      alt={member?.fullname || "Profile"}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="wpo-header-v2-profile-menu-info">
                    <p className="wpo-header-v2-profile-menu-name">
                      {member?.fullname}
                    </p>
                    <p className="wpo-header-v2-profile-menu-role">
                      {member?.position?.position_name}
                    </p>
                  </div>
                </li>
                <li className="wpo-header-v2-profile-menu-divider"></li>
                <li>
                  <Link
                    href="/dashboard"
                    className="wpo-header-v2-profile-menu-link"
                  >
                    <i className="fi ti-dashboard"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="wpo-header-v2-profile-menu-link logout"
                    onClick={logout}
                  >
                    <i className="fi ti-shift-right"></i> Keluar
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="wpo-header-v2-login">
              Masuk
            </Link>
          )}

          {/* Language Switcher */}
          <div className="wpo-header-v2-lang" ref={langRef}>
            <button
              className="wpo-header-v2-lang-btn"
              onClick={() => setLangOpen(!langOpen)}
            >
              <span>{locale.toUpperCase()}</span>
              <i
                className={`fi ${langOpen ? "ti-angle-up" : "ti-angle-down"}`}
              ></i>
            </button>
            {langOpen && (
              <ul className="wpo-header-v2-lang-menu wpo-header-v2-lang-menu-open">
                {languageOptions.map((lang) => (
                  <li key={lang.code}>
                    <Link
                      replace
                      href={getTranslatedPath(lang.code)}
                      locale={lang.code}
                      className={`wpo-header-v2-lang-option ${
                        locale === lang.code ? "active" : ""
                      }`}
                      onClick={() => setLangOpen(false)}
                    >
                      <span className="wpo-header-v2-lang-flag">
                        {lang.code === "zh"
                          ? "🇨🇳"
                          : lang.code === "id"
                            ? "🇮🇩"
                            : "🇺🇸"}
                      </span>
                      <span className="wpo-header-v2-lang-name">
                        {lang.code === "zh"
                          ? "中文"
                          : lang.code === "id"
                            ? "ID"
                            : "EN"}
                      </span>
                      <span className="wpo-header-v2-lang-code">
                        {lang.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="wpo-header-v2-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fi ${mobileOpen ? "ti-close" : "ti-menu"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`wpo-header-v2-mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Panel */}
      <div className={`wpo-header-v2-mobile-panel ${mobileOpen ? "open" : ""}`}>
        <button
          className="wpo-header-v2-mobile-close"
          onClick={() => setMobileOpen(false)}
        >
          <i className="fi ti-close"></i>
        </button>

        <ul className="wpo-header-v2-mobile-nav">
          {menuData
            .map((item, i) => {
              const isCollections = item.link === "#";

              return (
                <li key={i} className="wpo-header-v2-mobile-nav-item">
                  <Link
                    href={item.link}
                    className={`wpo-header-v2-mobile-nav-link ${
                      isActive(item.link) ? "active" : ""
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {isCollections && hasCollections && (
                    <ul className="wpo-header-v2-mobile-sub">
                      {collectionItems.map((col, j) => (
                        <li key={j}>
                          <Link
                            href={`/collections/${col.slug}`}
                            className={`wpo-header-v2-mobile-sub-link ${
                              isSubActive(col.slug) ? "active" : ""
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {col.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>

        {!isAuthenticated && (
          <div className="wpo-header-v2-mobile-actions">
            <Link
              href="/login"
              className="wpo-header-v2-mobile-login"
              onClick={() => setMobileOpen(false)}
            >
              Masuk
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
