/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { usePathname, Link } from "@/i18n/navigation";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/lib/api/queries/settings";

export const languageOptions = [
  { code: "en", label: "ENG", flag: "🇺🇸" },
  { code: "id", label: "ID", flag: "🇮🇩" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

const LanguageSwitcher = () => {
  const locale = useLocale();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const site_settings = useSiteSettings();

  const nameToSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };
  const { data } = useQuery({
    queryKey: ["getCollections"],
    queryFn: async () => {
      const response = await getCollection();
      return response;
    },
    enabled: langDropdownOpen,
  });

  /**
   * Mengambil path yang sudah diterjemahkan slug-nya.
   * Logika ini mencari apakah segment URL saat ini adalah sebuah nama koleksi,
   * jika iya, ia memastikan slug tetap konsisten atau bisa disesuaikan ke depan.
   */
  const getTranslatedPath = (targetLocale: string) => {
    try {
      const decodedPathname = decodeURIComponent(pathname);
      const segments = decodedPathname.split("/").filter(Boolean);

      const translatedSegments = segments.map((segment) => {
        // 1. Cari apakah segment ini ada di database (name_en, name_id, atau name_zh)
        const matchedCollection = data?.find((c: any) => {
          return (
            nameToSlug(c.name_en || "") === segment ||
            nameToSlug(c.name_id || "") === segment ||
            nameToSlug(c.name_zh || "") === segment
          );
        });

        // 2. Jika ketemu koleksi yang cocok, ambil nama dalam bahasa target
        if (matchedCollection) {
          const targetName = matchedCollection[`name_${targetLocale}`];
          return nameToSlug(targetName);
        }

        // 3. Jika tidak ketemu (seperti kata "collections"), biarkan apa adanya
        return segment;
      });
      return `/${translatedSegments.join("/")}`;
    } catch (error) {
      console.error("Translation error:", error);
      return pathname;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langDropdownOpen]);

  const currentLanguage = languageOptions.find((lang) => lang.code === locale);

  return (
    <div
      className="language-switcher"
      ref={dropdownRef}
      style={{ marginLeft: "20px", position: "relative" }}
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
        <span>{currentLanguage?.flag || "🌐"}</span>
        <span>{currentLanguage?.label || locale.toUpperCase()}</span>
        <i
          className={`fi ${langDropdownOpen ? "ti-angle-up" : "ti-angle-down"}`}
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {languageOptions.map((lang) => (
            // <button onClick={() => getTranslatedPath(lang.code)}>
            //   {lang.code}
            // </button>
            <Link
              key={lang.code}
              replace
              href={getTranslatedPath(lang.code)}
              locale={lang.code}
              onClick={() => setLangDropdownOpen(false)}
              style={{
                padding: "10px 16px",
                background: locale === lang.code ? "#f5f5f5" : "white",
                textDecoration: "none",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                transition: "background 0.2s",
              }}
              // Menambahkan hover effect via inline style (opsional, lebih baik di CSS)
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  locale === lang.code ? "#f5f5f5" : "white")
              }
            >
              <span>{lang.flag}</span>
              <span
                style={{ fontWeight: locale === lang.code ? "bold" : "normal" }}
              >
                {lang.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
