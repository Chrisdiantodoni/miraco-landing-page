"use client";
import React from "react";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
// image
import pimg1 from "@/public/images/partners/1.png";
import pimg2 from "@/public/images/partners/2.png";
import pimg3 from "@/public/images/partners/3.png";
import pimg4 from "@/public/images/partners/4.png";
import pimg5 from "@/public/images/partners/5.png";
import pimg6 from "@/public/images/partners/2.png";
import Image from "next/image";

const partners = [
  {
    id: "01",
    pimg: pimg1,
  },
  {
    id: "02",
    pimg: pimg2,
  },
  {
    id: "03",
    pimg: pimg3,
  },
  {
    id: "04",
    pimg: pimg4,
  },
  {
    id: "05",
    pimg: pimg5,
  },
  {
    id: "06",
    pimg: pimg6,
  },
];

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const PartnerSection = (props: { hclass: string }) => {
  const settings = {
    infinite: true,
    autoplay: true,
    arrows: false,
    dots: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 757,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className={"" + props.hclass}>
      <h2 className="d-none">No Content</h2>
      <ul className="partners-slider">
        <Slider {...settings}>
          {partners.map((partner, pitem) => (
            <div key={pitem}>
              <li>
                <Image src={partner.pimg} alt="" />
              </li>
            </div>
          ))}
        </Slider>
      </ul>
    </section>
  );
};

export default PartnerSection;
