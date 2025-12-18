// "use client";
// import React from "react";
// import Header from "./Header/Header";
// import { Collection } from "@/lib/types/settings";

// interface NavProps {
//   hclass: string;
//   Logo: string;
//   col1: string;
//   col2: string;
//   col3: string;
//   col4?: string;
//   collections: Collection[];
// }

// export default function Navbar(props: NavProps) {
//   const [scroll, setScroll] = React.useState(0);

//   const handleScroll = () => setScroll(document.documentElement.scrollTop);

//   React.useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const className = scroll > 80 ? "fixed-navbar active" : "fixed-navbar";
//   return (
//     <div className={className}>
//       <Header
//         hclass={props?.hclass}
//         logo={props?.Logo}
//         col1={props?.col1}
//         col2={props?.col2}
//         col3={props?.col3}
//         // col4={props?.col4}
//         collections={props.collections}
//       />
//     </div>
//   );
// }
"use client";
import React from "react";
import Header from "./Header/Header";
import { Collection } from "@/lib/types/settings";

interface NavProps {
  hclass: string;
  Logo: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
  collections: Collection[];
}

export default function Navbar(props: NavProps) {
  const [scroll, setScroll] = React.useState(0);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setScroll(scrollTop);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hidden di posisi paling atas (0-80px)
  // Active/visible setelah scroll > 80px
  const className = scroll <= 80 ? "fixed-navbar" : "fixed-navbar active";

  return (
    <div className={className}>
      <Header
        hclass={props?.hclass}
        logo={props?.Logo}
        col1={props?.col1}
        col2={props?.col2}
        col3={props?.col3}
        collections={props.collections}
      />
    </div>
  );
}
