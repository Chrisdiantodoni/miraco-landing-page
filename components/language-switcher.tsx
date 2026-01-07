import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { usePathname, Link } from "@/i18n/navigation";
import createStore from "../context/index";

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

  const { collections } = createStore((state) => state);

  const nameToSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Function untuk find collection berdasarkan slug di locale tertentu
  const findCollectionBySlug = (slug: string, searchLocale: string) => {
    // PENTING: Decode slug dulu untuk handle Chinese/special chars
    const decodedSlug = decodeURIComponent(slug);

    return collections.find((collection) => {
      const name = collection[
        `name_${searchLocale}` as keyof Collection
      ] as string;
      return nameToSlug(name) === decodedSlug;
    });
  };

  const getTranslatedPath = (targetLocale: string) => {
    try {
      const decodedPathname = decodeURIComponent(pathname);
      let translatedPath = decodedPathname;
      const segments = decodedPathname.split("/").filter(Boolean);

      // Track segments yang berhasil ditranslate
      const translatedSegments: string[] = [];

      segments.forEach((segment) => {
        const matchedCollection = findCollectionBySlug(segment, locale);

        if (matchedCollection) {
          const targetName = matchedCollection[
            `name_${targetLocale}` as keyof Collection
          ] as string;

          if (targetName) {
            const targetSlug = nameToSlug(targetName);
            translatedPath = translatedPath.replace(
              `/${segment}`,
              `/${targetSlug}`
            );
            translatedSegments.push(targetSlug);
          } else {
            // Kalau gak ada translation, keep original segment
            console.warn(`No translation for segment: ${segment}`);
            translatedSegments.push(segment);
          }
        } else {
          // Segment bukan collection, keep as is
          translatedSegments.push(segment);
        }
      });

      return translatedPath;
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback: keep current pathname
      return pathname;
    }
  };

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
              href={getTranslatedPath(lang.code)}
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
