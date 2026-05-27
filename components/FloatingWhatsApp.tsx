"use client";

import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";

export default function FloatingWhatsApp() {
  const settings = useSiteSettings();
  const phone = settings?.site_settings?.whatsapp || "";
  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone) return null;

  return (
    <a
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wpo-floating-wa"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa fa-whatsapp"></i>
    </a>
  );
}
