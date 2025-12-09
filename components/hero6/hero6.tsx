"use client";
import React from "react";
import Link from "next/link";

import arrow from "/public/images/bottom-arrow.svg";
import Image from "next/image";

const Hero6 = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  return (
    <section
      className="wpo-hero-static-s4"
      style={{ backgroundImage: `url(${"/images/slider/slide-8.jpg"})` }}
    >
      <div className="wrapper">
        <h2 className="">
          Making Every Space <br />
          <span> a Masterpiece</span>
        </h2>
        <div className="content fade_bottom">
          <p>
            Blaze is a trailblazing architecture agency renowned for its
            innovative approach to design, where creativity meets functionality.
          </p>
          <Link onClick={ClickHandler} href="/about" className="theme-btn-s2">
            <span className="rolling-text">Explore Our Work</span>
          </Link>
        </div>
      </div>

      {/* <AnchorLink href="#about" className="scroll-btn fade_bottom">
        <div className="scroll-befor">
          <Image src={arrow} alt="" />
        </div>
        <span>Scroll For More</span>
      </AnchorLink> */}
    </section>
  );
};

export default Hero6;
