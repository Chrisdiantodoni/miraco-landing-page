"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { Link } from "@/i18n/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CollectionSections = () => {
  const sliderRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = useSiteSettings();

  const settingSlider = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 757,
        settings: {
          slidesToShow: 2,
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

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <section className="wpo-instagram-section section-padding pb-0">
      <h2 className="d-none">hidden content</h2>

      <div className="slider-controls ">
        <button
          onClick={goToPrev}
          className="slider-btn slider-btn-prev"
          aria-label="Previous slide"
        >
          <svg
            className="slider-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="slider-btn slider-btn-next"
          aria-label="Next slide"
        >
          <svg
            className="slider-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="wrapper">
        <Slider ref={sliderRef} {...settingSlider}>
          {settings?.collections.map((col, index) => (
            <div key={index} className="slider-item">
              <Link
                className="instagram-card"
                href={`/collections/${col?.collection_name?.toLowerCase()}`}
              >
                {col?.image_url && (
                  <Image
                    src={col.image_url}
                    alt={col.collection_name || "Collection Image"}
                    className="img img-responsive"
                    width={350}
                    height={350}
                  />
                )}

                <div className="card-overlay">
                  <span className="card-title">{col.collection_name}</span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CollectionSections;
