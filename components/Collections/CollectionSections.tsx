"use client";
import React, { useState } from "react";
import InImg1 from "@/public/images/instagram/1.jpg";
import InImg2 from "@/public/images/instagram/2.jpg";
import InImg3 from "@/public/images/instagram/3.jpg";
import InImg4 from "@/public/images/instagram/4.jpg";
import InImg5 from "@/public/images/instagram/5.jpg";
// import InImg6 from "@/public/images/instagram/6.jpg";
import Image, { StaticImageData } from "next/image";
import { ModalContent } from "../Modal/Modal";

const images = [InImg1, InImg2, InImg3, InImg4, InImg5];

const CollectionSections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StaticImageData>();

  const openModal = (imgSrc: StaticImageData) => {
    setSelectedImage(imgSrc);
    setIsOpen(true);
  };

  return (
    <section className="wpo-instagram-section section-padding pb-0">
      <h2 className="d-none">hidden content</h2>
      <div className="wraper">
        {images.map((img, index) => (
          <div
            className="instagram-card"
            key={index}
            onClick={() => openModal(img)}
          >
            <Image src={img} alt="" className="img img-responsive" />
            <div className="popup-icon">
              <i className="ti-plus"></i>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <ModalContent onClose={() => setIsOpen(false)}>
          <Image src={selectedImage} alt="Instagram Preview" />
        </ModalContent>
      )}
    </section>
  );
};

export default CollectionSections;
