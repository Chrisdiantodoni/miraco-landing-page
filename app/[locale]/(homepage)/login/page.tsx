import LoginForm from "@/components/Form/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Miraco HPL",
  description:
    "Sign in to your Miraco HPL account to order premium high pressure laminate products, manage your projects, and track your requests.",
  openGraph: {
    title: "Sign In | Miraco HPL",
    description:
      "Sign in to your Miraco HPL account to order premium high pressure laminate products.",
    type: "website",
    siteName: "Miraco HPL",
    url: "https://miracohpl.com/login",
  },
  twitter: {
    card: "summary",
    title: "Sign In | Miraco HPL",
    description:
      "Access your Miraco HPL account to order premium laminate products.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginForm />;
}
