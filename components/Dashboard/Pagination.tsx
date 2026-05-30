"use client";

import { useTranslations } from "next-intl";

interface PaginationProps {
  meta: {
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
    [key: string]: any;
  } | null;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const t = useTranslations("dashboard");

  if (!meta || !meta.last_page || meta.last_page <= 1) return null;

  const current = meta.current_page || 1;
  const last = meta.last_page;

  const pages: (number | "...")[] = [];
  const delta = 2;

  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "..."
    ) {
      pages.push("...");
    }
  }

  return (
    <div className="dash-pagination-wrap">
      <button
        className="dash-pagination-btn"
        disabled={current <= 1}
        onClick={() => onPageChange(Math.max(1, current - 1))}
      >
        &laquo;
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="dash-pagination-dots">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`dash-pagination-num ${p === current ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="dash-pagination-btn"
        disabled={current >= last}
        onClick={() => onPageChange(current + 1)}
      >
        &raquo;
      </button>
    </div>
  );
}
