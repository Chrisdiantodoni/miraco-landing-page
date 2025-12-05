"use client";
import React from "react";
import Header from "./Header/Header";

interface NavProps {
  hclass: string;
  Logo: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
}

export default function Navbar(props: NavProps) {
  const [scroll, setScroll] = React.useState(0);

  const handleScroll = () => setScroll(document.documentElement.scrollTop);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const className = scroll > 80 ? "fixed-navbar active" : "fixed-navbar";

  return (
    <div className={className}>
      <Header
        hclass={props?.hclass}
        Logo={props?.Logo}
        col1={props?.col1}
        col2={props?.col2}
        col3={props?.col3}
        col4={props?.col4}
      />
    </div>
  );
}
