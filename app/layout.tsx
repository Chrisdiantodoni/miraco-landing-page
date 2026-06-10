import { ReactNode } from "react";

import "@/styles/animate.css";
import "@/styles/flaticon.css";
import "@/styles/font-awesome.min.css";
import "@/styles/themify-icons.css";
import "@/styles/sass/style.scss";
import "@/app/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AnalyticsTracker from "@/components/AnalyticTracker";

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
  return (
    <>
      <AnalyticsTracker />
      {children}
    </>
  );
}
