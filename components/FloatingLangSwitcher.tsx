"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/lib/api/queries/settings";

const languageOptions = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
  { code: "zh", label: "CN" },
];

export default function FloatingLangSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const nameToSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  const { data: collectionData } = useQuery({
    queryKey: ["floatingLangCollections"],
    queryFn: async () => {
      const response = await getCollection();
      return response;
    },
    enabled: open,
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

      const result = `/${translatedSegments.join("/")}`;
      return result === "/" ? "/" : result;
    } catch {
      return "/";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="wpo-floating-lang" ref={ref}>
      <button
        className="wpo-floating-lang-btn"
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
      >
        <span>{locale.toUpperCase()}</span>
        <i className={`fi ${open ? "ti-angle-up" : "ti-angle-down"}`}></i>
      </button>

      {open && (
        <div className="wpo-floating-lang-menu">
          {languageOptions.map((lang) => (
            <Link
              key={lang.code}
              replace
              href={getTranslatedPath(lang.code)}
              locale={lang.code}
              className={`wpo-floating-lang-option ${
                locale === lang.code ? "active" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              <span className="wpo-floating-lang-flag">
                {lang.code === "zh" ? "🇨🇳" : lang.code === "id" ? "🇮🇩" : "🇺🇸"}
              </span>
              <span className="wpo-floating-lang-name">
                {lang.code === "zh"
                  ? "Chinese"
                  : lang.code === "id"
                    ? "Indonesia"
                    : "English"}
              </span>
              <span className="wpo-floating-lang-code">{lang.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
