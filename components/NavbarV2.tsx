"use client";

import React from "react";
import HeaderV2 from "./Header/HeaderV2";
import { Collection } from "@/lib/types/settings";

interface NavbarV2Props {
  logo: string;
  collections: Collection[];
  authenticated?: boolean;
}

export default function NavbarV2({
  logo,
  collections,
  authenticated = false,
}: NavbarV2Props) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={scrolled ? "wpo-header-v2 scrolled" : "wpo-header-v2"}
    >
      <HeaderV2
        logo={logo}
        collections={collections}
        authenticated={authenticated}
      />
    </header>
  );
}
