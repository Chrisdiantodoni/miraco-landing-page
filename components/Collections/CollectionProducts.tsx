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

interface CollectionProductProps {
  initialData: ProductListResponse;
  collection: string;
}

// ✅ PERBAIKAN: Helper function untuk normalize query params (with UUID support)
export const normalizeQueryParams = (params: Record<string, any>) => {
  const normalized: Record<string, any> = {};

  // Collection ID - could be number or UUID
  if (params.collection_id) {
    // Check if it's a number or UUID
    const isNumber = !isNaN(Number(params.collection_id));
    normalized.collection_id = isNumber
      ? Number(params.collection_id)
      : params.collection_id;
  }

  // ✅ Category ID - parse dari comma-separated string (UUID or number)
  if (params.category_id) {
    if (typeof params.category_id === "string" && params.category_id.trim()) {
      // Decode URL encoded string (%2C -> ,)
      const decoded = decodeURIComponent(params.category_id);

      // Split by comma
      const ids = decoded
        .split(",")
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0);

      if (ids.length > 0) {
        // ✅ PENTING: Jangan convert ke number kalau UUID!
        // Check if first ID looks like a UUID (has dashes)
        const firstId = ids[0];
        const looksLikeUUID = firstId.includes("-") && firstId.length > 20;

        if (looksLikeUUID) {
          // Keep as string array for UUIDs
          normalized.category_id = ids;
        } else {
          // Convert to numbers for integer IDs
          const numericIds = ids
            .map((id) => Number(id))
            .filter((id) => !isNaN(id) && id > 0);
          if (numericIds.length > 0) {
            normalized.category_id = numericIds;
          }
        }
      }
    } else if (Array.isArray(params.category_id)) {
      // Already array, just filter empty values
      const filtered = params.category_id.filter(
        (id: any) => id && String(id).trim()
      );
      if (filtered.length > 0) {
        normalized.category_id = filtered;
      }
    }
  }

  // ✅ Sub Collection ID - parse dari comma-separated string (UUID or number)
  if (params.sub_collection_id) {
    if (
      typeof params.sub_collection_id === "string" &&
      params.sub_collection_id.trim()
    ) {
      // Decode URL encoded string
      const decoded = decodeURIComponent(params.sub_collection_id);

      // Split by comma
      const ids = decoded
        .split(",")
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0);

      if (ids.length > 0) {
        // Check if first ID looks like a UUID
        const firstId = ids[0];
        const looksLikeUUID = firstId.includes("-") && firstId.length > 20;

        if (looksLikeUUID) {
          normalized.sub_collection_id = ids;
        } else {
          const numericIds = ids
            .map((id) => Number(id))
            .filter((id) => !isNaN(id) && id > 0);
          if (numericIds.length > 0) {
            normalized.sub_collection_id = numericIds;
          }
        }
      }
    } else if (Array.isArray(params.sub_collection_id)) {
      const filtered = params.sub_collection_id.filter(
        (id: any) => id && String(id).trim()
      );
      if (filtered.length > 0) {
        normalized.sub_collection_id = filtered;
      }
    }
  }

  // Search - hanya jika ada dan tidak kosong
  if (params.search && params.search.trim()) {
    normalized.search = params.search.trim();
  }

  // Page - selalu number minimal 1
  normalized.page = params.page ? Number(params.page) : 1;
  normalized.collection = decodeURIComponent(params.collection ?? "");

  return normalized;
};
const CollectionProducts = ({
  collection,
  initialData,
}: CollectionProductProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sub_collection_id = searchParams.get("sub_collection_id");
  const category_id = searchParams.get("category_id");
  const initialSearchTerm = searchParams.get("search") || "";
  const currentPage = searchParams.get("page");
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  // ✅ PERBAIKAN: Query params dengan parsing yang benar
  const queryParamsForApi = useMemo(() => {
    // ✅ PENTING: Jangan set default value sebagai empty array!
    const params: Record<string, any> = {
      collection: collection || "",
      search: debouncedSearchTerm || "",
      page: currentPage || "1",
    };

    // ✅ Hanya tambahkan jika ada value
    if (category_id) {
      params.category_id = category_id;
    }

    if (sub_collection_id) {
      params.sub_collection_id = sub_collection_id;
    }

    const normalized = normalizeQueryParams(params);

    return normalized;
  }, [
    collection,
    category_id,
    sub_collection_id,
    debouncedSearchTerm,
    currentPage,
  ]);

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

  const initialFilters = {
    categories: searchParams.get("category_id")?.split(",") || [],
    subCollections: searchParams.get("sub_collection_id")?.split(",") || [],
  };

  // ✅ Handler untuk filters - akan dipanggil dari SidebarFilter
  const handleFilters = useCallback(
    (filters: {
      categories: (string | number)[];
      subCollections: (string | number)[];
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset page
      params.delete("page");

      // Clear old filters
      params.delete("category_id");
      params.delete("sub_collection_id");

      // Set new filters (comma-separated)
      if (filters?.categories?.length > 0) {
        params.set("category_id", filters.categories.join(","));
      }

      if (filters?.subCollections?.length > 0) {
        params.set("sub_collection_id", filters.subCollections.join(","));
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const ICON_SIZE = 16;
  const dataProducts = data?.data;
  const products = dataProducts?.data || [];

  console.log({ data });

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
    <section className="section-padding pt-4">
      <div className="container">
        <div className="row g-5">
          {/* Sidebar - Col 3 */}
          <div className="col col-lg-3 col-12 mb-lg-0 mb-3">
            <SidebarFilter
              collection_id={products[0]?.collection_id as string}
              onFilterChange={handleFilters}
              initialFilters={initialFilters}
            />
          </div>

          {/* Products - Col 9 */}
          <div className="col col-lg-9 col-12">
            <div className="row">
              <div className="col-12" style={{ marginBottom: 30 }}>
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Cari Finishing, Texture, Sub Collection..."
                />
              </div>
            </div>

            <div className="row g-5">
              {isFetching ? (
                <Loading />
              ) : products.length > 0 ? (
                products.map((product, index) => {
                  const productImage = product?.media?.find(
                    (find) => find?.type == "product_thumbnail"
                  )?.image_url;

                  return (
                    <div
                      className="col col-lg-3 col-md-6 col-6 fade_bottom"
                      key={product?.id || index}
                    >
                      <Link
                        onClick={ClickHandler}
                        href={`/collections/products/${product?.id}`}
                      >
                        <div className="shop-card">
                          <div className="image">
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
                              <div className="placeholder">
                                No Image Available
                              </div>
                            )}
                          </div>
                          <div className="content">
                            {product?.name && (
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
                                {product?.is_available_in_miraedge == 1 && (
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
