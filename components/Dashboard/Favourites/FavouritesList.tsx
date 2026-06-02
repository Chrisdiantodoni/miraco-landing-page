/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getFavourites } from "@/lib/api/queries/favourite";
import { getProductFormattedCode } from "@/lib/util";
import Loading from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function FavouritesList() {
  const t = useTranslations("dashboard");
  const { isAuthenticated } = useAuth();

  const { isInCart, addToCart } = useCartStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(),
    enabled: isAuthenticated,
  });

  const products = data?.data?.data || data?.data || [];

  if (isLoading) {
    return (
      <Loading
        size="medium"
        text="Loading favourites..."
        image={image}
        imageSize={100}
      />
    );
  }

  if (isError) {
    return (
      <div className="text-center py-5">
        <p>Failed to load favourites. Please try again.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="dash-page-container"
        style={{ textAlign: "center", padding: "64px 28px" }}
      >
        <p style={{ color: "#8c8c8c", fontSize: 15, marginBottom: 20 }}>
          {t("favourites_empty")}
        </p>
        <Link
          href="/collections"
          style={{
            display: "inline-flex",
            padding: "10px 24px",
            background: "#1a1c1c",
            color: "#fff",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {t("favourites_empty_cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="dash-page-container">
      <div
        style={{
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1a1c1c",
            margin: "0 0 4px",
          }}
        >
          {t("favourites_heading", { count: products.length })}
        </h2>
        <p style={{ fontSize: 13, color: "#8c8c8c", margin: 0 }}>
          {t("favourites_subtitle")}
        </p>
      </div>
      <div className="row g-5">
        {products.map((product: any, index: number) => {
          const productImage = product?.media?.find(
            (find: any) => find?.type === "product_thumbnail",
          )?.image_url;

          return (
            <div
              className="col col-lg-3 col-md-6 col-12 fade_bottom"
              key={product?.id || index}
            >
              <Link
                onClick={() => window.scrollTo(0, 0)}
                href={`/collections/products/${product?.id}`}
              >
                <div className="shop-card">
                  <div className="image">
                    {product?.is_new == 1 && (
                      <span className="new-badge-pill">NEW</span>
                    )}
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={product?.name || "Product image"}
                        width={350}
                        height={350}
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "auto",
                        }}
                        priority={index < 2}
                      />
                    ) : (
                      <div className="placeholder">No Image Available</div>
                    )}
                    <div
                      className="shop-card-hover-actions"
                      onClick={(e) => e.preventDefault()}
                    >
                      <button
                        className={`shop-card-action-btn shop-card-action-btn--cart ${isInCart(product.id) ? "in-cart" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isInCart(product.id)) return;
                          addToCart({
                            id: product.id,
                            name: product.name,
                            code: getProductFormattedCode(product),
                            image_url: productImage || "",
                            collection_name:
                              product?.collection?.collection_name || "",
                            thickness: product?.thickness?.size || "",
                            size: product?.size?.size || "",
                            finishing: product?.finishing?.finishing_name || "",
                            price: product.price,
                            promo_price: product.promo_price || undefined,
                          });
                        }}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="content">
                    <div className="product-info-row">
                      <div className="product-text-group">
                        <span
                          className="product-code"
                          style={{ fontWeight: 500 }}
                        >
                          {getProductFormattedCode(product)}
                        </span>
                        <span className="product-name-text">
                          {product.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
