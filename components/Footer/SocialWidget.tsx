import { Link } from "@/i18n/navigation";
import { Facebook, Instagram, Mail, MessageCircleIcon } from "lucide-react";

type Social = {
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  facebook?: string;
  email_contacts?: string;
};

type Props = {
  social?: Social;
  onClick: () => void;
};

export function SocialWidget({ social = {}, onClick }: Props) {
  const handleWhatsAppClick = (phoneNumber: string, message: string) => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}${
      message ? `?text=${encodedMessage}` : ""
    }`;
    window.open(url, "_blank");
  };
  return (
    <div className="social-widget">
      <ul>
        <li>
          {/* Instagram */}
          {social?.instagram && (
            <Link
              onClick={onClick}
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </Link>
          )}

          {/* WhatsApp */}
          {social.whatsapp && (
            <Link
              onClick={() =>
                handleWhatsAppClick(social.whatsapp ?? "", "HALLO")
              }
              href={`#`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircleIcon />
            </Link>
          )}

          {/* Email */}
          {social.email_contacts && (
            <Link onClick={onClick} href={`mailto:${social.email_contacts}`}>
              <Mail />
            </Link>
          )}

          {/* Facebook */}
          {social.facebook && (
            <Link
              onClick={onClick}
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}
