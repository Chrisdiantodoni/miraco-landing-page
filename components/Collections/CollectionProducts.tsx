"use client";
import React from "react";
import Link from "next/link";
import arrow from "@/public/images/right-arrow-2.svg";
import Pagination from "../Pagination/Pagination";
import { PaginationProps } from "@mui/material/Pagination";
import SidebarFilter from "../SidebarFilter.tsx/SidebarFilter";
import SearchInput from "../Input/SearchInput";

export const INITIAL_PAGINATION_DATA: PaginationProps["paginationData"] = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: 0,
    to: 0,
  },
  links: {
    first: null,
    last: null,
    prev: null,
    next: null,
  },
};

export const getDefaultPaginationData = (
  total = 0,
  perPage = 10,
  currentPage = 1
) => ({
  data: [],
  meta: {
    current_page: currentPage,
    last_page: Math.ceil(total / perPage) || 1,
    total,
    per_page: perPage,
    from: total === 0 ? 0 : (currentPage - 1) * perPage + 1,
    to: Math.min(currentPage * perPage, total),
  },
  links: {
    first: null,
    last: null,
    prev: null,
    next: null,
  },
});

const CollectionProducts = ({
  //   hclass,
  products,
  //   addToCartProduct,
  //   addToWishListProduct,
}) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <section
      //   className={hclass}
      className="wpo-shop-section section-padding pt-4"
    >
      <div className="container">
        <div className="row">
          {/* Sidebar - Col 3 */}
          <div className="col col-lg-3 col-12 mb-lg-0 mb-3">
            <SidebarFilter />
          </div>

          {/* Products - Col 9 */}
          <div className="col col-lg-9 col-12">
            <div className="row">
              <div
                className="col-12"
                style={{
                  marginBottom: 20,
                }}
              >
                <SearchInput />
              </div>
              {products.map((product, index) => (
                <div
                  className="col col-lg-3 col-md-6 col-12 fade_bottom"
                  key={index}
                >
                  <div className="shop-card">
                    <div className="image">
                      <img src={product.proImg} alt="" />
                    </div>
                    <div className="content">
                      <h2>
                        <Link
                          onClick={ClickHandler}
                          href={"/shop-single/[slug]"}
                          as={`/shop-single/${product.slug}`}
                        >
                          {product.title}
                        </Link>
                      </h2>
                      <del>${product.delPrice}</del>
                      <span>${product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Full Width */}
            <div className="col-12">
              <Pagination
                paginationData={getDefaultPaginationData(100, 10, 1)}
                onPageChange={(page) => {
                  // handle page change
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionProducts;
