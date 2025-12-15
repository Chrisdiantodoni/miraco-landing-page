import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { usePathname, Link } from "@/i18n/navigation";

export const languageOptions = [
  { code: "en", label: "ENG", flag: "🇺🇸" },
  { code: "id", label: "ID", flag: "🇮🇩" },
  { code: "zh", label: "CN", flag: "🇨🇳" },
];

const LanguageSwitcher = () => {
  const slugTranslations: Record<string, Record<string, string>> = {
    woods: {
      en: "woods",
      id: "kayu",
      zh: "木材",
    },
  };
  const locale = useLocale();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Tutup dropdown saat klik di luar
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  const currentLanguage = languageOptions.find((lang) => lang.code === locale);

  return (
    <div
      className="language-switcher"
      ref={dropdownRef}
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
            minWidth: "120px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {languageOptions.map((lang, index) => (
            <Link
              href={pathname}
              locale={lang.code}
              prefetch={false}
              key={lang.code}
              onClick={() => setLangDropdownOpen(false)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: locale === lang.code ? "#f0f0f0" : "white",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                borderBottom:
                  index !== languageOptions.length - 1
                    ? "1px solid #eee"
                    : "none",
                transition: "background 0.2s",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                if (locale !== lang.code) {
                  const target = e.currentTarget as HTMLAnchorElement;
                  target.style.background = "#f9f9f9";
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background =
                  locale === lang.code ? "#f0f0f0" : "white";
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
