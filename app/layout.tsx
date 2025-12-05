import Topbar from "@/components/TopBar";
import React, { Fragment } from "react";
import Logo from "../public/images/logo.svg";
import "../styles/animate.css";
import "../styles/flaticon.css";
import "../styles/font-awesome.min.css";
import "../styles/themify-icons.css";
import "../styles/sass/style.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/Navbar";

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <Fragment>
      <Topbar />
      <Navbar
        hclass={"wpo-site-header wpo-header-style-s9"}
        Logo={Logo}
        col1={"col-lg-3 col-md-3 col-3 d-lg-none dl-block"}
        col2={"col-lg-2 col-md-6 col-6"}
        col3={
          "col-lg-10 col-md-1 col-1 d-flex justify-content-end align-items-center"
        }
        // col4={"col-lg-1 col-md-2 col-2"}
      />
      {children}
    </Fragment>
  );
}
