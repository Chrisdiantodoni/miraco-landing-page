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
  Heart,
  ShoppingCart,
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
import { getLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";

interface productDetailProps {
  data: {
    meta: Meta;
    data: ProductDetail;
  };
}

const Product = ({ data }: productDetailProps) => {
  const allFeatures = [
    {
      id: 1,
      key: "is_anti_fingerprint", // Sesuaikan dengan field di backend
      image: "/images/features/anti-fingerprint-1.png",
      name: "Anti Fingerprint",
    },
    {
      id: 2,
      key: "is_soft_touch", // Sesuaikan dengan field di backend
      image: "/images/features/soft-touch-2.png",
      name: "Soft Touch",
    },
    {
      id: 3,
      key: "is_high_moisture", // Sesuaikan dengan field di backend
      image: "/images/features/high-moisture-3.png",
      name: "High Moisture",
    },
    {
      id: 4,
      key: "is_low_reflective", // Sesuaikan dengan field di backend
      image: "/images/features/low-reflective-4.png",
      name: "Low Reflective",
    },
    {
      id: 5,
      key: "is_anti_bacteria", // Sesuaikan dengan field di backend
      image: "/images/features/anti-bacteria-5.png",
      name: "Anti Bacteria",
    },
  ];

  const t = useTranslations("collections");
  const tbackTo = useTranslations();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const site_settings = useSiteSettings();
  const { addToCart, removeFromCart, isInCart, toggleFavourite, isFavourite } =
    useCartStore();
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
  console.log({ relatedProducts });

  const [activeProductId, setActiveProductId] = useState<string | number>(
    currentProduct?.id,
  );

  // 3. Cari objek produk aktif berdasarkan ID (derived state)
  // Ini akan digunakan untuk memperbarui konten detail jika Anda mengimplementasikannya
  const activeProduct = allPillProducts.find(
    (p) => p.id === activeProductId,
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
    (find) => find?.type == "product_to_download",
  );
  const thumbnail = allMedia.find((find) => find?.type === "product_thumbnail");
  const otherMedia = allMedia.filter(
    (find) =>
      find?.type !== "product_to_download" &&
      find?.type !== "product_thumbnail" &&
      find?.image_url &&
      find.image_url.length > 0,
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, currentZoomImage]); // Tambahkan dependencies

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
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
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
  const locale = useLocale();

  const getActiveFeatures = () => {
    if (!activeProduct) return [];

    // Jika type = "mira", tampilkan SEMUA features
    const isMira = activeProduct?.type?.type_name?.toLowerCase() === "mira";

    if (isMira) {
      return allFeatures; // Return semua tanpa filter
    }

    // Kalau bukan mira, filter berdasarkan field is_*
    return allFeatures.filter((feature) => {
      const value = (activeProduct as any)[feature.key];
      return value === true || value === 1 || value === "1";
    });
  };

  const activeFeatures = getActiveFeatures();

  const getLink = () => {
    switch (locale) {
      case "en":
        return activeProduct?.design?.collection?.name_en;
      case "zh":
        return activeProduct?.design?.collection?.name_zh;
      case "id":
        return activeProduct?.design?.collection?.name_id;

      default:
        break;
    }
  };

  console.log({ activeProduct });
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
                priority
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
                          priority
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
          <span className="product-sku">{formattedCode}</span>
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
              <div>{t("label_design")}</div>
              <div>
                {activeProduct?.design?.design_name}{" "}
                {activeProduct?.category?.category_name?.toLowerCase() ==
                  "core" && <span>CORE</span>}
              </div>
            </div>
            <div className="product-spec-row">
              <div>{t("label_type")}</div>
              <div>{activeProduct?.type?.type_name}</div>
            </div>
            <div className="product-spec-row">
              <div>{t("label_finish")}</div>
              <div>{activeProduct?.finishing?.finishing_name}</div>
            </div>
            <div className="product-spec-row">
              <div>{t("label_size")}</div>
              <div>
                {activeProduct?.size?.size}{" "}
                <span className="text-muted">
                  ({activeProduct?.size?.size_ft} ft)
                </span>
              </div>
            </div>
            <div className="product-spec-row">
              <div>{t("label_thickness")}</div>
              <div>{activeProduct?.thickness?.thickness}</div>
            </div>

            {activeProduct?.miraedge_detail ? (
              <div className="product-spec-row">
                <div>MiraEDGE</div>
                <div>{activeProduct?.miraedge_detail}</div>
              </div>
            ) : null}
            {activeFeatures.length > 0 && (
              <div className="product-features-grid">
                {activeFeatures.map((feature) => (
                  <div key={feature.id} className="product-features-item">
                    <div className="product-features-logo-wrapper">
                      <Image
                        src={feature.image}
                        alt={feature.name}
                        width={32}
                        height={32}
                        className="product-features-logo"
                      />
                    </div>
                    <span className="product-features-name">
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                    (media: any) => media?.type === "product_thumbnail",
                  );
                  const pillDownloadImage = pillProductMedia.find(
                    (media: any) => media?.type === "product_to_download",
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
            {/* Icon actions */}
            <div className="product-icon-actions">
              {/* Favourite */}
              <button
                className={`product-icon-btn product-icon-btn--favourite ${isFavourite(activeProduct.id as unknown as number) ? "active" : ""}`}
                onClick={() =>
                  toggleFavourite(activeProduct.id as unknown as number)
                }
                title={
                  isFavourite(activeProduct.id as unknown as number)
                    ? t("button_favourited")
                    : t("button_favourite")
                }
              >
                <Heart
                  size={20}
                  fill={
                    isFavourite(activeProduct.id as unknown as number)
                      ? "currentColor"
                      : "none"
                  }
                  className={`product-icon-svg ${isFavourite(activeProduct.id as unknown as number) ? "active" : ""}`}
                />
              </button>

              {/* Chat */}
              <button
                className="product-icon-btn product-icon-btn--chat"
                onClick={() =>
                  handleWhatsAppClick(
                    site_settings?.site_settings?.whatsapp ?? "",
                  )
                }
                title={t("button_wa_chat")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>

              {/* Download */}
              {productDownload && (
                <button
                  className="product-icon-btn product-icon-btn--download"
                  onClick={() => mutateAsync()}
                  title={t("button_download")}
                >
                  {isPending ? (
                    <Loader size={20} className="loadingSpinner" />
                  ) : (
                    <LucideDownload size={20} />
                  )}
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="product-row">
              {isInCart(activeProduct.id as unknown as number) ? (
                <button
                  className="theme-btn2"
                  onClick={() =>
                    removeFromCart(activeProduct.id as unknown as number)
                  }
                >
                  <Check size={16} />
                  {t("button_cart_added")}
                </button>
              ) : (
                <button
                  className="theme-btn2"
                  onClick={() =>
                    addToCart({
                      id: activeProduct.id as unknown as number,
                      name: activeProduct.name,
                      code: getProductFormattedCode(activeProduct),
                      image_url:
                        activeProduct?.media?.find(
                          (find) => find.type == "product_thumbnail",
                        )?.image_url || "",
                      collection_name:
                        activeProduct?.collection?.collection_name || "",
                      thickness: activeProduct?.thickness?.thickness || "",
                      size: activeProduct?.size?.size || "",
                      finishing: activeProduct?.finishing?.finishing_name || "",
                    })
                  }
                >
                  <ShoppingCart size={16} />
                  {t("button_cart")}
                </button>
              )}
              <button
                className="theme-btn ms-2"
                onClick={() =>
                  handleWhatsAppClick(
                    site_settings?.site_settings?.whatsapp ?? "",
                  )
                }
              >
                {t("button_order")}
              </button>
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
            <Link prefetch href={`/collections/${getLink() || ""}`}>
              {tbackTo("button_back_to")} {getLink()} / {getLink()} CORE
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
