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
              onClick={onClick}
              href={`https://wa.me/${social.whatsapp}`}
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
