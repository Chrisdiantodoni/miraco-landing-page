/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Link } from "@/i18n/navigation";
import { Meta } from "@/lib/types";
import { Product as ProductDetail } from "@/lib/types/product/product";
import {
  BadgeCheck,
  Check,
  LucideDownload,
  ChevronDown,
  Maximize,
  X,
  Loader,
  Loader2,
  Info,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import "react-medium-image-zoom/dist/styles.css";
import Slider from "react-slick";
import { getProductFormattedCode } from "@/lib/util";
import { useMutation } from "@tanstack/react-query";
import { downloads } from "@/lib/api/queries/product";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Dropdown from "../../../../../../components/ui/dropdown";
import { useTranslations } from "next-intl";

interface productDetailProps {
  data: {
    meta: Meta;
    data: ProductDetail;
  };
}

const Product = ({ data }: productDetailProps) => {
  const t = useTranslations("collections");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const site_settings = useSiteSettings();
  const product = data?.data;
  const relatedProducts = product?.related_products;
  const currentProduct = product;
  const allPillProducts: (ProductDetail | any)[] = [];
  if (currentProduct) {
    allPillProducts.push(currentProduct);
  }
  relatedProducts.forEach((rp: any) => {
    if (rp.id !== currentProduct?.id) {
      allPillProducts.push(rp);
    }
  });

  const [activeProductId, setActiveProductId] = useState<string | number>(
    currentProduct?.id
  );

  // 3. Cari objek produk aktif berdasarkan ID (derived state)
  // Ini akan digunakan untuk memperbarui konten detail jika Anda mengimplementasikannya
  const activeProduct = allPillProducts.find(
    (p) => p.id === activeProductId
  ) as ProductDetail;

  // 4. Handler klik pada pill
  const handlePillClick = (productId: string | number) => {
    // HANYA MENGUBAH STATE, tidak mengubah URL halaman
    setActiveProductId(productId);
    // Anda bisa menambahkan logika lain di sini (misalnya, fetch data jika diperlukan)
  };

  // Menggunakan kode produk dari activeProduct (jika Anda ingin detail berubah berdasarkan pill)
  const formattedCode = getProductFormattedCode(activeProduct);

  const allMedia = activeProduct?.media || [];
  const productDownload = allMedia.find(
    (find) => find?.type == "product_to_download"
  );
  const thumbnail = allMedia.find((find) => find?.type === "product_thumbnail");
  const otherMedia = allMedia.filter(
    (find) =>
      find?.type !== "product_to_download" &&
      find?.type !== "product_thumbnail" &&
      find?.image_url &&
      find.image_url.length > 0
  );

  const sliderMedia: { image_url: string; alt: string }[] = [];

  // 1. Tambahkan Media Download (Indeks 0)
  if (productDownload?.image_url?.trim()) {
    sliderMedia.push({
      image_url: productDownload.image_url,
      alt: activeProduct?.name || "Product Download Image",
    });
  }

  // 2. Tambahkan Thumbnail (Indeks 1, atau Indeks 0 jika downloadMedia tidak ada)
  if (thumbnail?.image_url?.trim()) {
    sliderMedia.push({
      image_url: thumbnail.image_url,
      alt: activeProduct?.name || "Product Thumbnail",
    });
  }

  // 3. Tambahkan Media Lain (Setelahnya)
  otherMedia.forEach((media) => {
    if (media?.image_url?.trim()) {
      sliderMedia.push({
        image_url: media.image_url,
        alt: activeProduct?.name || "Product Image",
      });
    }
  });
  const hasImages = sliderMedia.length > 0;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentZoomImage, setCurrentZoomImage] = useState<{
    url: string;
    alt: string;
    index: number;
  } | null>(null);

  const handleZoomClick = (url: string, alt: string) => {
    // Cari indeks gambar di sliderMedia untuk navigasi
    const index = sliderMedia.findIndex((item) => item.image_url === url);

    setCurrentZoomImage({ url, alt, index });
    setLightboxOpen(true);
  };

  // Tutup lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentZoomImage(null);
  };

  // const testingDownload = activeProduct?.media?.find(
  //   (find) => find?.type == "additional_image_products"
  // )?.path;
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        image_path: productDownload?.path,
        type: "product",
        download_type: "product",
      };
      const response = await downloads(activeProduct?.id, body);
      return response;
    },
    onSuccess: (response) => {
      console.log("Response:", response); // ✅ Debug

      const blob = response.blob;
      const contentDisposition = response.contentDisposition; // ✅ Udah string langsung
      console.log({ response });
      // Ekstrak filename
      let filename = "download.jpg";

      if (contentDisposition) {
        console.log("Content-Disposition:", contentDisposition); // ✅ Debug

        // Match pattern: filename="..." atau filename=...
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );

        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, ""); // Remove quotes
          console.log("Extracted filename:", filename); // ✅ Debug
        }
      }

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`✅ File "${filename}" berhasil didownload!`);
    },
    onError: (error: any) => {
      console.error("❌ Download gagal:", error);
    },
  });

  const handleWhatsAppClick = (phoneNumber: string) => {
    const currentLink = window.location.href;
    const message = `Selamat siang,
Order HPL dengan kode: ${getProductFormattedCode(activeProduct)}
Link produk:
${currentLink}

Mohon info ketersediaan, harga, dan estimasi pengiriman.
Terima kasih.`;
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}${
      message ? `?text=${encodedMessage}` : ""
    }`;
    window.open(url, "_blank");
  };
  const hasMultipleProducts = allPillProducts.length > 1;
  return (
    <div className="row mt-5">
      {lightboxOpen && currentZoomImage && (
        <div className="custom-lightbox-overlay" onClick={closeLightbox}>
          {/* TOMBOL CLOSE DIPINDAHKAN DI SINI (Anak langsung dari Overlay) */}
          <button
            className="lightbox-close-btn"
            onClick={closeLightbox}
            aria-label="Tutup"
          >
            <X />
          </button>

          <div
            className="custom-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tampilkan Gambar Besar */}
            <div className="lightbox-image-container">
              <Image
                src={currentZoomImage.url}
                alt={currentZoomImage.alt}
                sizes="100vw"
                fill
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="col col-lg-5 col-12">
        <div className="shop-single-slider">
          <div className="slider-nav">
            {hasImages ? (
              <Slider {...settings}>
                {sliderMedia.map((mediaItem, index) => {
                  return (
                    <div key={index}>
                      <div
                        className="product-image-wrapper"
                        onClick={() =>
                          handleZoomClick(mediaItem.image_url, mediaItem.alt)
                        }
                      >
                        {product?.is_new && (
                          <span className="new-badge-pill">NEW</span>
                        )}
                        <Image
                          src={mediaItem?.image_url}
                          alt={mediaItem.alt}
                          sizes="(max-width: 991px) 100vw, 40vw"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        {/* Icon Zoom Overlay */}
                        <button
                          className="zoom-icon-btn d-block d-lg-none"
                          // Ganti `handleZoomClick` dengan fungsi yang sebenarnya memicu modal/fungsi zoom Anda

                          aria-label="Perbesar Gambar"
                        >
                          <Maximize size={24} />{" "}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              // =========================================================
              <div className="placeholder-detail-shop">
                {product?.is_new == 1 && (
                  <span className="new-badge-pill">NEW</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col col-lg-7 col-12">
        <div className="product-details">
          <span>{formattedCode}</span>
          <h2>{activeProduct?.name}</h2>

          {/* <div className="price">
            <span className="current">{item.price}</span>
            <span className="old">{item.delPrice}</span>
          </div> */}

          <div className="product-specification">
            {/* {activeProduct?.category?.category_name == "CORE" && (
              <div className="product-spec-row">
                <div>Category</div>
                <div>{activeProduct?.category?.category_name}</div>
              </div>
            )}
          */}
            <div className="product-spec-row">
              <div>Design</div>
              <div>
                {activeProduct?.design?.design_name}{" "}
                {activeProduct?.category?.category_name?.toLowerCase() ==
                  "core" && <span>CORE</span>}
              </div>
            </div>
            <div className="product-spec-row">
              <div>Type</div>
              <div>{activeProduct?.type?.type_name}</div>
            </div>
            <div className="product-spec-row">
              <div>Finish</div>
              <div>{activeProduct?.finishing?.finishing_name}</div>
            </div>
            <div className="product-spec-row">
              <div>Size</div>
              <div>
                {activeProduct?.size?.size}{" "}
                <span className="text-muted">
                  ({activeProduct?.size?.size_ft} ft)
                </span>
              </div>
            </div>
            <div className="product-spec-row">
              <div>Thickness</div>
              <div>{activeProduct?.thickness?.thickness}</div>
            </div>
            {activeProduct?.miraedge_detail ? (
              <div className="product-spec-row">
                <div>MIRAEDGE</div>
                <div>{activeProduct?.miraedge_detail}</div>
              </div>
            ) : null}
            {/* <div className="d-flex gx-2">
                <Check className="text-success me-2" />
                <div>MiraEdge</div>
              </div> */}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: activeProduct?.description,
            }}
          />
          {allPillProducts && allPillProducts.length > 0 && (
            <div className="related-products-pills">
              <div className="pills-container">
                {allPillProducts.map((p: any) => {
                  const pillFormattedCode = getProductFormattedCode(p);
                  const isActive = p.id === activeProductId;

                  // Ambil gambar thumbnail dari produk terkait
                  const pillProductMedia = p?.media || [];
                  const pillThumbnail = pillProductMedia.find(
                    (media: any) => media?.type === "product_thumbnail"
                  );
                  const pillDownloadImage = pillProductMedia.find(
                    (media: any) => media?.type === "product_to_download"
                  );

                  // Prioritas: thumbnail dulu, kalau tidak ada gunakan download image
                  const pillImageUrl =
                    pillThumbnail?.image_url || pillDownloadImage?.image_url;

                  // Dapatkan HEX Warna
                  const colorHex = p.color_hex;

                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handlePillClick(p.id)}
                      className={`product-pill ${
                        isActive ? "active-pill" : ""
                      }`}
                    >
                      {/* =================================================== */}
                      {/* INDIKATOR WARNA - PRIORITAS: IMAGE > COLOR HEX > BLACK */}
                      {/* =================================================== */}
                      {pillImageUrl ? (
                        // Jika ada gambar, tampilkan gambar
                        <div className="color-dot-image">
                          <Image
                            src={pillImageUrl}
                            alt={p.name || "Product color"}
                            width={25}
                            height={25}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      ) : (
                        // Jika tidak ada gambar, tampilkan color dot (hex atau hitam default)
                        <div
                          className="color-dot"
                          style={{
                            backgroundColor: colorHex || "#000000",
                          }}
                        />
                      )}
                      {/* =================================================== */}

                      {pillFormattedCode}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="product-option">
            <div className="product-row">
              <button
                className="theme-btn2"
                onClick={() =>
                  handleWhatsAppClick(
                    site_settings?.site_settings?.whatsapp ?? ""
                  )
                }
              >
                Order
              </button>
              {productDownload && (
                <button
                  className="theme-btn ms-2 "
                  onClick={() => mutateAsync()}
                >
                  {isPending ? (
                    <Loader className="loadingSpinner" />
                  ) : (
                    <LucideDownload />
                  )}
                  Download
                </button>
              )}
              {/* <Dropdown
                triggerClassName="theme-btn ms-2"
                trigger={
                  <>
                    <LucideDownload />
                  </>
                }
              >
                <button
                  className="theme-btn-dropdown bg-none d-flex w-100"
                  onClick={() => mutateAsync()}
                >
                  {isPending ? (
                    <Loader className="loadingSpinner" />
                  ) : (
                    <LucideDownload />
                  )}
                  Download
                </button>
                <button
                  className="theme-btn-dropdown bg-none  d-flex  w-100 "
                  onClick={() => mutateAsync()}
                >
                  {isPending ? (
                    <Loader className="loadingSpinner" />
                  ) : (
                    <LucideDownload />
                  )}
                  Download All
                </button>
              </Dropdown> */}
              {/* <button className="theme-btn ms-2 " onClick={() => mutateAsync()}>
                {isPending ? (
                  <Loader className="loadingSpinner" />
                ) : (
                  <LucideDownload />
                )}
                Download
              </button> */}
            </div>
          </div>
          <div className="product-disclaimer">
            {/* <Info className="product-disclaimer__icon" /> */}
            <div className="product-disclaimer__text">
              {t("disclaimer")
                .split("\n")
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < t("disclaimer").split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div className="product-back-btn">
            <Link
              prefetch
              href={`/collections/${
                activeProduct?.collection?.name_en?.toLowerCase() || ""
              }`}
            >
              Back to {activeProduct?.collection?.name_en} /{" "}
              {activeProduct?.collection?.name_en} CORE
            </Link>
          </div>
          {/* <div className="tg-btm">
            <p>
              <span>Categories:</span>
              {item.brand}
            </p>
            <p>
              <span>Tags:</span>
              {item.category}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Product;
