"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import arrow from "/public/images/bottom-arrow.svg";
import { HeroTranslation } from "@/lib/types";

interface HeroProps {
  hero: HeroTranslation;
}

const Hero6 = ({ hero }: HeroProps) => {
  const ClickHandler = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="wpo-hero-static-s4">
      {/* Background Image menggunakan Next.js Image Component */}
      {hero?.hero_section?.background_image_url && (
        <Image
          src={hero.hero_section.background_image_url}
          alt="Hero Background"
          fill
          priority
          quality={90}
          className="hero-background-image"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}

      <div className="wrapper">
        {/* Baris Judul */}
        <h2
          style={{
            fontWeight: 400,
          }}
        >
          <span>{hero?.title}</span>
        </h2>

        {/* Baris Konten Teks & Tombol */}
        <div className="content fade_bottom">
          {hero?.subtitle && (
            <div
              dangerouslySetInnerHTML={{
                __html: hero.subtitle,
              }}
            />
          )}

          {hero?.cta_text && (
            <Link onClick={ClickHandler} href="/about" className="theme-btn-s2">
              <span className="rolling-text">{hero.cta_text}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Scroll Button - Uncomment jika diperlukan */}
      {/* <Link href="#about" className="scroll-btn fade_bottom">
        <div className="scroll-befor">
          <Image src={arrow} alt="Scroll Down" width={20} height={20} />
        </div>
        <span>Scroll For More</span>
      </Link> */}
    </section>
  );
};

export default Hero6;
