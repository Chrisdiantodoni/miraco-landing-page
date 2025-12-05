"use client";
import React from "react";
import Link from "next/link";

const Topbar = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div className="topbar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-4 col-12">
            <div className="contact-into">
              <ul className="social-media">
                <li>
                  <Link onClick={ClickHandler} href="#">
                    <i className="ti-facebook"></i>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="#">
                    <i className="ti-twitter-alt"></i>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="#">
                    <i className="ti-linkedin"></i>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="#">
                    <i className="ti-instagram"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8 col-12">
            <ul className="contact-info">
              <li>
                <Link href="tel:+887869587496">
                  Need help? Call Us:
                  <span>+869 968 236</span>
                </Link>
              </li>
              <li>
                <select defaultValue="english">
                  <option lang="de" value="deutsch">
                    Deutsch
                  </option>
                  <option lang="en" value="english">
                    English
                  </option>
                  <option lang="fr" value="francais">
                    Français
                  </option>
                  <option lang="it" value="italiano">
                    Italiano
                  </option>
                </select>
              </li>
              <li>
                <select defaultValue="USD">
                  <option value="PEN">PEN</option>
                  <option value="USD">USD</option>
                  <option value="PLN">PLN</option>
                  <option value="QAR">QAR</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
