/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import Pagination from "../Pagination/Pagination";
import SidebarFilter from "../SidebarFilter.tsx/SidebarFilter";
import SearchInput from "../Input/SearchInput";
import { ProductListResponse } from "@/lib/types/product/product";
import Image from "next/image";
import miraedge from "@/public/images/miraco/miraedge/miraedge.png";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "../../lib/hooks/use-debounce";
import Loading from "../Loader/loading";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/queries/product";
import { getProductFormattedCode } from "@/lib/util";
import MobileSidebar from "../MobileMenu/filter-menu";
import { normalizeQueryParams } from "../../lib/util";
import { useTranslations } from "next-intl";
import image from "@/public/images/miraco/logo/logo-miraco.png";
import { useCartStore } from "@/lib/store/cart";
import { Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/providers/AuthProvider";
import { toggleFavourite as toggleFavouriteApi } from "@/lib/api/queries/favourite";

interface CollectionProductProps {
  initialData: ProductListResponse;
  collection: string;
  sidebar_data: any;
}

interface FilterParams {
  categories?: (string | number)[];
  types?: (string | number)[];
  finishing?: (string | number)[];
  features?: (string | number)[];
  complementary?: (string | number)[];
  sizes?: (string | number)[];
  thicknesses?: (string | number)[];
  is_soft_touch?: boolean;
  is_anti_fingerprint?: boolean;
  is_miraedge?: boolean;
  sort_by?: string;
}

// ✅ PERBAIKAN: Helper function untuk normalize query params (with UUID support)

const CollectionProducts = ({
  collection,
  initialData,
  sidebar_data,
}: CollectionProductProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchTerm = searchParams.get("search") || "";
  const currentPage = searchParams.get("page");
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { addToCart, isInCart, isFavourite } = useCartStore();
  const { token } = useAuth();

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  // ✅ PERBAIKAN: Query params dengan parsing yang benar
  const queryParamsForApi = useMemo(() => {
    const params: Record<string, any> = {
      collection: collection || "",
      search: debouncedSearchTerm || "",
      page: currentPage || "1",
    };

    // Hanya tambahkan parameter jika ada value
    const addIfExists = (key: string, value: string | null) => {
      if (value && value.trim()) {
        params[key] = value;
      }
    };

    addIfExists("category_id", searchParams.get("category_id"));
    addIfExists("types", searchParams.get("types"));
    addIfExists("finishing", searchParams.get("finishing"));
    addIfExists("features", searchParams.get("features"));
    addIfExists("complementary", searchParams.get("complementary"));
    addIfExists("sizes", searchParams.get("sizes"));
    addIfExists("thicknesses", searchParams.get("thicknesses"));
    addIfExists("sort_by", searchParams.get("sort_by"));

    // Boolean params
    const isSoftTouch = searchParams.get("is_soft_touch");
    if (isSoftTouch === "1" || isSoftTouch === "true") {
      params.is_soft_touch = true;
    }

    const isAntiFingerprint = searchParams.get("is_anti_fingerprint");
    if (isAntiFingerprint === "1" || isAntiFingerprint === "true") {
      params.is_anti_fingerprint = true;
    }

    const isMiraedge = searchParams.get("is_miraedge");
    if (isMiraedge === "1" || isMiraedge === "true") {
      params.is_miraedge = true;
    }

    // Normalize params sebelum dikirim ke API
    return normalizeQueryParams(params);
  }, [collection, debouncedSearchTerm, currentPage, searchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  // const STALE_TIME_MS = 30 * 1000;
  // ✅ Query dengan error handling
  const { data, isFetching, isError, error } = useQuery<ProductListResponse>({
    queryKey: ["products", queryParamsForApi],
    queryFn: async () => {
      console.log("🔄 Fetching products for:", collection);
      const result = await getProducts(queryParamsForApi);
      return result;
    },
    placeholderData: initialData, // ✅ Ganti initialData dengan placeholderData
    // staleTime: 5000, // ✅ Data fresh selama 5 detik (kurangi fetch berlebihan)
    staleTime: 0, // ✅ Selalu fetch fresh data saat queryKey berubah
    gcTime: 5 * 60 * 1000, // Cache untuk performa
    // enabled: !!collection,
  });
  // ✅ Effect untuk update URL search
  useEffect(() => {
    if (debouncedSearchTerm === initialSearchTerm) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      params.set("search", debouncedSearchTerm.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm]);

  // ✅ Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rawSortBy = searchParams.get("sort_by");

  const sortByFilter: "new" | "" = rawSortBy === "new" ? "new" : "";
  const initialFilters = useMemo(() => {
    const parseArrayParam = (param: string | null): (string | number)[] => {
      if (!param) return [];
      return param
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .map((id) => {
          // Coba konversi ke number, jika gagal tetap string
          const numId = Number(id);
          return isNaN(numId) ? id : numId;
        });
    };

    const parseBooleanParam = (param: string | null): boolean => {
      return param === "1" || param === "true";
    };

    return {
      categories: parseArrayParam(searchParams.get("category_id")),
      types: parseArrayParam(searchParams.get("types")),
      finishing: parseArrayParam(searchParams.get("finishing")),
      features: parseArrayParam(searchParams.get("features")),
      complementary: parseArrayParam(searchParams.get("complementary")),
      sizes: parseArrayParam(searchParams.get("sizes")),
      thicknesses: parseArrayParam(searchParams.get("thicknesses")),
      is_soft_touch: parseBooleanParam(searchParams.get("is_soft_touch")),
      is_anti_fingerprint: parseBooleanParam(
        searchParams.get("is_anti_fingerprint")
      ),
      is_miraedge: parseBooleanParam(searchParams.get("is_miraedge")),
      sort_by: (searchParams.get("sort_by") || "") as "new" | "",
    };
  }, [searchParams]);

  // ✅ Handler untuk filters - akan dipanggil dari SidebarFilter
  const handleFilters = useCallback(
    (filters: FilterParams) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset page saat filter berubah
      params.delete("page");

      // Helper untuk set array params
      const setArrayParam = (key: string, value?: (string | number)[]) => {
        params.delete(key);
        if (value && value.length > 0) {
          params.set(key, value.join(","));
        }
      };

      // Helper untuk set boolean params
      const setBooleanParam = (key: string, value?: boolean) => {
        params.delete(key);
        if (value === true) {
          params.set(key, "1");
        }
      };

      // Set array filters
      setArrayParam("category_id", filters.categories);
      setArrayParam("types", filters.types);
      setArrayParam("finishing", filters.finishing);
      setArrayParam("features", filters.features);
      setArrayParam("complementary", filters.complementary);
      setArrayParam("sizes", filters.sizes);
      setArrayParam("thicknesses", filters.thicknesses);

      // Set boolean filters
      setBooleanParam("is_soft_touch", filters.is_soft_touch);
      setBooleanParam("is_anti_fingerprint", filters.is_anti_fingerprint);
      setBooleanParam("is_miraedge", filters.is_miraedge);

      // Set sort_by
      if (filters.sort_by && filters.sort_by.trim()) {
        params.set("sort_by", filters.sort_by);
      } else {
        params.delete("sort_by");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const ICON_SIZE = 16;
  const dataProducts = data?.data;
  const products = dataProducts?.data || [];

  useEffect(() => {
    console.log("🔍 Current Query Params:", {
      raw: Object.fromEntries(searchParams.entries()),
      normalized: queryParamsForApi,
      filters: initialFilters,
    });
  }, [searchParams, queryParamsForApi, initialFilters]);

  const t = useTranslations("collections");

  if (isError) {
    return (
      <section className="section-padding pt-4">
        <div className="container">
          <p className="text-danger text-center">
            Terjadi kesalahan saat memuat data: {(error as Error).message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding pt-5">
      <div className="container-fluid">
        <div className="row g-5  mx-5 mx-md-0">
          {/* Sidebar - Col 3 */}
          <div className="col col-lg-3 col-12 mb-lg-0 d-none d-lg-block">
            <SidebarFilter
              collection_name={collection}
              onFilterChange={handleFilters}
              initialFilters={initialFilters}
              sidebar_data={sidebar_data}
            />
          </div>
          <div className="col col-lg-3 col-12 mb-lg-0 d-block d-lg-none">
            <MobileSidebar
              collection_name={collection}
              onFilterChange={handleFilters}
              initialFilters={initialFilters}
              sidebar_data={sidebar_data}
            />
          </div>

          {/* Products - Col 9 */}
          <div className="col col-lg-9 col-12">
            <div className="row">
              <div className="col-12" style={{ marginBottom: 30 }}>
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={t("button_search")}
                />
              </div>
            </div>

            <div className="row g-5">
              {isFetching ? (
                <Loading
                  size="medium"
                  // fullScreen={true}
                  text="Loading..."
                  image={image}
                  imageSize={100}
                />
              ) : products.length > 0 ? (
                products.map((product, index) => {
                  const productImage = product?.media?.find(
                    (find) => find?.type == "product_thumbnail"
                  )?.image_url;

                  return (
                    <div
                      className="col col-lg-3 col-md-6 col-12 fade_bottom"
                      key={product?.id || index}
                    >
                      <Link
                        onClick={ClickHandler}
                        href={`/collections/products/${product?.id}`}
                      >
                        <div className="shop-card">
                          <div className="image">
                            {/* <span className="new-badge">NEW</span> */}
                            {/* ATAU */}
                            {product?.is_new == 1 && (
                              <span className="new-badge-pill">NEW</span>
                            )}
                            {/* <span className="new-ribbon">NEW</span> */}
                            {/* <span className="new-circle">NEW</span> */}
                            {/* <span className="new-outline">NEW</span> */}
                            {productImage ? (
                              <Image
                                src={productImage}
                                alt={product?.name || "Product image"}
                                width={350}
                                height={350}
                                // unoptimized
                                style={{
                                  objectFit: "contain",
                                  width: "100%",
                                  height: "auto",
                                }}
                                priority={index < 2}
                              />
                            ) : (
                              <div className="placeholder">
                                No Image Available
                              </div>
                            )}

                            <div
                              className="shop-card-hover-actions"
                              onClick={(e) => e.preventDefault()}
                            >
                              <button
                                className={`shop-card-action-btn shop-card-action-btn--favourite ${isFavourite(product.id as unknown as number) ? "active" : ""}`}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!token) {
                                    router.push("/login");
                                    return;
                                  }
                                  try {
                                    await toggleFavouriteApi(String(product.id));
                                  } catch {}
                                }}
                              >
                                <Heart
                                  size={16}
                                  fill={
                                    isFavourite(product.id as unknown as number)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              <button
                                className={`shop-card-action-btn shop-card-action-btn--cart ${isInCart(product.id as unknown as number) ? "in-cart" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (isInCart(product.id as unknown as number)) return;
                                  addToCart({
                                    id: product.id as unknown as number,
                                    name: product.name,
                                    code: getProductFormattedCode(product),
                                    image_url: productImage || "",
                                    collection_name:
                                      product?.collection?.collection_name || "",
                                    thickness: product?.thickness?.size || "",
                                    size: product?.size?.size || "",
                                    finishing:
                                      product?.finishing?.finishing_name || "",
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
                            {product?.name && (
                              <>
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
                                  {!!product?.miraedge_detail && (
                                    <Image
                                      src={miraedge}
                                      alt="Product Icon"
                                      width={ICON_SIZE}
                                      height={ICON_SIZE}
                                      className="product-icon"
                                      style={{
                                        objectFit: "contain",
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                </div>
                                {/*
                                {product.price != null && (
                                  <div className="product-price">
                                    {product.promo_price ? (
                                      <>
                                        <span className="product-price-current">
                                          Rp{" "}
                                          {product.promo_price.toLocaleString(
                                            "id-ID",
                                          )}
                                        </span>
                                        <span className="product-price-old">
                                          Rp{" "}
                                          {product.price.toLocaleString(
                                            "id-ID",
                                          )}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="product-price-current">
                                        Rp{" "}
                                        {product.price.toLocaleString("id-ID")}
                                      </span>
                                    )}
                                  </div>
                                )}
                                */}
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <p>No products found</p>
                </div>
              )}

              {/* Pagination - Full Width */}
              {products.length > 0 && (
                <div className="col-12">
                  <Pagination
                    paginationData={data?.data}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionProducts;
