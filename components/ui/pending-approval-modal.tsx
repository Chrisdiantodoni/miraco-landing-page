"use client";

import { Locale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconClock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2 4 12 14 22 4" />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface PendingApprovalModalProps {
  locale?: Locale;
  /** Email user dari response registrasi. undefined = skeleton, "" = fallback */
  email?: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PendingApprovalModal({
  email,
  onClose,
}: PendingApprovalModalProps) {
  const t = useTranslations("register");
  const ctaRef = useRef<HTMLButtonElement>(null);
  const titleId = "pending-approval-title";

  useEffect(() => {
    ctaRef.current?.focus();
  }, []);

  // Focus trap — hanya 1 focusable element
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    ctaRef.current?.focus();
  };

  const renderEmailContent = () => {
    if (email === undefined) {
      return (
        <>
          <div className={"wpo-pending-skeleton"} />
          <div className={`wpo-pending-skeleton wpo-pending-skeletonShort`} />
        </>
      );
    }
    if (email) {
      const notice = t("pending_approval_email").replace("{email}", email);
      const parts = notice.split(email);
      return (
        <p>
          {parts[0]}
          <strong>{email}</strong>
          {parts[1]}
        </p>
      );
    }
    return <p>{t("pending_approval_email_fallback")}</p>;
  };

  return (
    <div
      className={"wpo-pending-overlay"}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
    >
      <div className={"wpo-pending-modal"}>
        <div className={"wpo-pending-iconWrap"}>
          <IconCheck />
        </div>

        <h2 className={"wpo-pending-title"} id={titleId}>
          {t("pending_approval_title")}
        </h2>

        <p className={"wpo-pending-description"}>{t("pending_approval_subtitle")}</p>

        <div className={"wpo-pending-timerBadge"}>
          <IconClock />
          {t("pending_approval_timer")}
        </div>

        <div className={"wpo-pending-emailNotice"}>
          <IconMail />
          {renderEmailContent()}
        </div>

        <button
          ref={ctaRef}
          className={"wpo-pending-ctaButton"}
          onClick={onClose}
          type="button"
        >
          {t("pending_approval_cta")}
        </button>
      </div>
    </div>
  );
}
