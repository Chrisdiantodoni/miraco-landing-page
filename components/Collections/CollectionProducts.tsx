/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import arrow from "@/public/images/right-arrow-2.svg";
import Pagination from "../Pagination/Pagination";
import SidebarFilter from "../SidebarFilter.tsx/SidebarFilter";
import SearchInput from "../Input/SearchInput";
import { PaginationMeta } from "@/lib/types/pagination";
import { ProductListResponse } from "@/lib/types/product/product";
import Image from "next/image";
import miraedge from "@/public/images/miraco/miraedge/miraedge.png";

interface CollectionProductProps {
  data: ProductListResponse;
}

const getProductFormattedCode = (p: any) => {
  if (!p?.code) return "No code provided";

  const categoryCode = p.sub_collection?.category?.code || "";
  const productCode = p.code;
  const subCategoryCode = p.finishing?.code || "";

  const parts = [categoryCode, productCode, subCategoryCode].filter(
    (part) => part && part.trim()
  );
  return parts.join(" ");
};

const CollectionProducts = ({ data }: CollectionProductProps) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  // Tentukan ukuran ikon yang Anda inginkan (misalnya 16x16 pixel)
  const ICON_SIZE = 16;
  const dataProducts = data?.data;
  const products = dataProducts?.data || [];

  return (
    <section className="section-padding pt-4">
      <div className="container">
        <div className="row g-5">
          {/* Sidebar - Col 3 */}
          <div className="col col-lg-3 col-12 mb-lg-0 mb-3">
            <SidebarFilter />
          </div>

          {/* Products - Col 9 */}
          <div className="col col-lg-9 col-12">
            <div className="row">
              <div className="col-12" style={{ marginBottom: 30 }}>
                <SearchInput onSearch={() => {}} />
              </div>
            </div>
            <div className="row g-5">
              {/* Search Input */}

              {/* Products Grid */}
              {products.length > 0 ? (
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
                                {/* KIRI: KODE DAN NAMA DALAM SATU GRUP */}
                                <div className="product-text-group">
                                  {/* Baris 1: Kode Terformat */}
                                  <span
                                    className="product-code"
                                    style={{ fontWeight: 500 }}
                                  >
                                    {getProductFormattedCode(product)}
                                  </span>

                                  {/* Baris 2: Nama Produk */}
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
                                {/* KANAN: ICON MIRAEDGE */}
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
              <div className="col-12">
                <Pagination
                  paginationData={data?.data}
                  onPageChange={(page) => {
                    // handle page change
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionProducts;
