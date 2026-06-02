import CheckoutForm from "@/components/Checkout/CheckoutForm";
import { AuthGuard } from "@/lib/providers/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Miraco HPL",
  description: "Review your selections and submit your order request for premium high pressure laminate products.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutForm />
    </AuthGuard>
  );
}
