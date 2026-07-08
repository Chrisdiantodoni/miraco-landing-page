import ForgotPasswordForm from "@/components/Form/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Miraco HPL",
  description:
    "Reset your Miraco HPL account password. Enter your email or username to receive an OTP code.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ForgotPasswordForm />;
}
