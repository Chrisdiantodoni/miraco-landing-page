"use client";
import React, { useState } from "react";
import InImg1 from "@/public/images/instagram/1.jpg";
import InImg2 from "@/public/images/instagram/2.jpg";
import InImg3 from "@/public/images/instagram/3.jpg";
import InImg4 from "@/public/images/instagram/4.jpg";
import InImg5 from "@/public/images/instagram/5.jpg";
import Image, { StaticImageData } from "next/image";
import { ModalContent } from "../Modal/Modal";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { Link } from "@/i18n/navigation";

const images = [InImg1, InImg2, InImg3, InImg4, InImg5];

const CollectionSections = () => {
  const [isOpen, setIsOpen] = useState(false);

  const settings = useSiteSettings();
  console.log(settings, "setting collections");
  return (
    <section className="wpo-instagram-section section-padding pb-0">
      <h2 className="d-none">hidden content</h2>
      <div className="wraper">
        {settings?.collections
          ?.filter((filter) => filter?.image_url != null)
          .map((col, index) => (
            <Link
              className="instagram-card"
              key={index}
              href={`/collections/${col?.collection_name?.toLowerCase()}?id=${
                col?.id
              }`}
            >
              {col?.image_url && (
                <Image
                  src={col.image_url}
                  alt={col.collection_name || "Collection Image"} // Aksesibilitas
                  className="img img-responsive"
                  width={350}
                  priority
                  height={350}
                />
              )}
              {/* Tempatkan tag Image di sini */}

              <div className="card-overlay">
                <span className="card-title">{col.collection_name}</span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CollectionSections;
