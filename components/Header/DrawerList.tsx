/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SearchDrawerContent.tsx
"use client";

import React, { useState, useMemo } from "react";
import SearchInput from "@/components/Input/SearchInput";
import styles from "./SearchDrawerContent.module.scss";
import { Product } from "@/lib/types/product/product";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { getProductsAll } from "@/lib/api/queries/product";
import { useDebounce } from "../../lib/hooks/use-debounce";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Loading from "../Loader/loading";
import { ProductListResponse } from "@/lib/types/product/product";
import miraedge from "@/public/images/miraco/miraedge/miraedge.png";
import Pagination from "../Pagination/Pagination";
import image from "@/public/images/miraco/logo/logo-miraco.png";

import { useEffect } from "react";
import { getProductFormattedCode } from "@/lib/util";
import createStore from "../../context/index";

export const SearchDrawerContent: React.FC<{
  onSearch: (value: any) => void;
}> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { handle } = createStore();
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const queryParamsForApi = useMemo(() => {
    const params: Record<string, any> = {
      search: debouncedSearchTerm || "",
      page: page,
    };
    return params;
  }, [debouncedSearchTerm, page]);
  const { data, isFetching, isError } = useQuery<ProductListResponse>({
    queryKey: ["searchProducts", queryParamsForApi],
    queryFn: async () => {
      const result = await getProductsAll(queryParamsForApi);
      return result;
    },
    enabled: hasSearchTerm,
  });

  const dataProducts = data?.data;
  const products = dataProducts?.data || [];

  useEffect(() => {
    let heightState = "compact"; // Default: 15vh (Search Bar saja)

    if (products.length > 0) {
      // Ada banyak hasil, gunakan tinggi penuh
      heightState = "full"; // 80vh
    } else if (isFetching || hasSearchTerm) {
      // Sedang mencari atau Not Found, gunakan tinggi Auto/Compact
      heightState = "auto"; // Tinggi yang cukup untuk Loading/Pesan
    }

    onSearch(heightState);
  }, [onSearch, isFetching, products.length, hasSearchTerm]);
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset halaman saat pencarian baru dimulai
  }, []);
  const ICON_SIZE = 16;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleClickedProduct = () => {
    handle!("isOpenDrawer", false);
  };

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={`${styles.searchBarWrapper} container-fluid mt-4`}>
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari Finishing, Texture, Sub Collection..."
        />

        <div className="row g-5 mt-2">
          {isFetching ? (
            <Loading
              size="medium"
              // fullScreen={true}
              text="Memuat..."
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
                    href={`/collections/products/${product?.id}`}
                    onClick={handleClickedProduct}
                  >
                    <div className="shop-card">
                      <div className="image">
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={product?.name || "Product image"}
                            width={250}
                            height={250}
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
  );
};
