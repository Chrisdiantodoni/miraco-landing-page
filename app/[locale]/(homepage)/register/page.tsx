import RegisterForm from "@/components/Form/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Miraco HPL",
  description:
    "Create your Miraco HPL account to start ordering premium high pressure laminate products. Join our B2B network for exclusive architectural surface solutions.",
  openGraph: {
    title: "Register | Miraco HPL",
    description:
      "Create your Miraco HPL account to start ordering premium high pressure laminate products.",
    type: "website",
    siteName: "Miraco HPL",
    url: "https://miracohpl.com/register",
  },
  twitter: {
    card: "summary",
    title: "Register | Miraco HPL",
    description:
      "Join Miraco HPL and start ordering premium architectural laminate products.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <RegisterForm />;
}
