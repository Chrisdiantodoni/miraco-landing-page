import React from "react";

import hbg from "@/public/images/slider/slide-9.jpg";
import slide9 from "@/public/images/slider/slide-9-1.jpg";
import Image from "next/image";

const Hero9 = () => {
  return (
    <section className="wpo-hero-static-s7">
      <div className="content">
        {/* <h2 className="fade_bottom">Timeless</h2>
        <h3 className="fade_bottom">Furniture,</h3> */}
        <p className="fade_bottom">
          Furnishing Your Dreams, One Piece at a Time
        </p>
        <h4 className="fade_bottom">Modern Living</h4>
      </div>
      <div className="bg-img">
        <Image src={hbg} alt="" />
      </div>
      {/* <div className="rigth-image">
        <Image src={slide9} alt="" />
      </div> */}
    </section>
  );
};

export default Hero9;
