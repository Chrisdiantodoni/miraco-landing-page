// "use client";
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// import arrow from "/public/images/bottom-arrow.svg";
// import { HeroTranslation } from "@/lib/types";

// interface HeroProps {
//   hero: HeroTranslation;
// }

// const Hero6 = ({ hero }: HeroProps) => {
//   const ClickHandler = () => {
//     window.scrollTo(0, 0);
//   };

//   return (
//     <section className="wpo-hero-static-s4">
//       {/* Background Image menggunakan Next.js Image Component */}
//       {hero?.hero_section?.background_image_url && (
//         <Image
//           src={hero.hero_section.background_image_url}
//           alt="Hero Background"
//           fill
//           priority
//           quality={90}
//           className="hero-background-image"
//           style={{
//             objectFit: "cover",
//             objectPosition: "center",
//           }}
//         />
//       )}

//       <div className="wrapper">
//         {/* Baris Judul */}
//         <h2
//           style={{
//             fontWeight: 400,
//           }}
//         >
//           <span>{hero?.title}</span>
//         </h2>

//         {/* Baris Konten Teks & Tombol */}
//         <div className="content fade_bottom">
//           {hero?.subtitle && (
//             <div
//               dangerouslySetInnerHTML={{
//                 __html: hero.subtitle,
//               }}
//             />
//           )}

//           {hero?.cta_text && (
//             <Link onClick={ClickHandler} href="/about" className="theme-btn-s2">
//               <span className="rolling-text">{hero.cta_text}</span>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Scroll Button - Uncomment jika diperlukan */}
//       {/* <Link href="#about" className="scroll-btn fade_bottom">
//         <div className="scroll-befor">
//           <Image src={arrow} alt="Scroll Down" width={20} height={20} />
//         </div>
//         <span>Scroll For More</span>
//       </Link> */}
//     </section>
//   );
// };

// export default Hero6;

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroTranslation } from "@/lib/types";

interface HeroProps {
  hero: HeroTranslation;
}

const Hero6 = ({ hero }: HeroProps) => {
  const ClickHandler = () => {
    window.scrollTo(0, 0);
  };

  // Fallback values
  const backgroundColor = hero?.hero_section?.background_color || "#1a1a1a";
  const backgroundImage =
    hero?.hero_section?.background_image_url ||
    hero?.hero_section?.background_image;
  const ctaUrl = hero?.hero_section?.cta_url || "/collections/woods";
  const ctaColor = hero?.hero_section?.cta_color || "#ffffff";
  const secondaryCtaUrl = hero?.hero_section?.secondary_cta_url;
  const secondaryCtaColor =
    hero?.hero_section?.secondary_cta_color || "#666666";

  return (
    <section
      className="wpo-hero-static-s4"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="hero-background-wrapper">
          <Image
            src={backgroundImage}
            alt={hero?.title || "Hero Background"}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="hero-background-image"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="hero-overlay" />

      <div className="wrapper container container-sm">
        {/* Title */}
        {hero?.title && (
          <h2 className="">
            <span>{hero.title}</span>
          </h2>
        )}

        {/* Content */}
        <div className="content">
          {/* Subtitle */}
          {hero?.subtitle && (
            <div
              className="hero-subtitle"
              dangerouslySetInnerHTML={{
                __html: hero.subtitle,
              }}
            />
          )}

          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            {/* Primary CTA */}
            {hero?.cta_text && ctaUrl && (
              <Link
                onClick={ClickHandler}
                href={ctaUrl}
                className="theme-btn-s2-hero primary-cta"
                style={{
                  backgroundColor: ctaColor,
                  color: ctaColor === "#ffffff" ? "#000000" : "#ffffff",
                }}
              >
                <span className="rolling-text">{hero.cta_text}</span>
              </Link>
            )}

            {/* Secondary CTA */}
            {hero?.secondary_cta_text && secondaryCtaUrl && (
              <Link
                onClick={ClickHandler}
                href={secondaryCtaUrl}
                className="theme-btn-s2-hero secondary-cta"
                style={{
                  backgroundColor: secondaryCtaColor,
                  color:
                    secondaryCtaColor === "#ffffff" ? "#000000" : "#ffffff",
                  borderColor: secondaryCtaColor,
                }}
              >
                <span className="rolling-text">{hero.secondary_cta_text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero6;
