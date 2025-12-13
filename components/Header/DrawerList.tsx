// components/SearchDrawerContent.tsx
"use client";

import React, { useState, useMemo } from "react";
import SearchInput from "@/components/Input/SearchInput";
import styles from "./SearchDrawerContent.module.scss";
import { Product } from "@/lib/types/product/product";

const getProductFormattedCode = (p: Product) => {
  if (!p?.code) return "No code provided";

  const categoryCode = p.sub_collection?.category?.code || "";
  const productCode = p.code;
  const subCategoryCode = p.finishing?.code || "";

  const parts = [categoryCode, productCode, subCategoryCode].filter(
    (part) => part && part.trim()
  );
  return parts.join(" ");
};
export const SearchDrawerContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={`${styles.searchBarWrapper} container`}>
        <SearchInput
          placeholder="Cari produk, warna, atau tipe..."
          onSearch={setSearchQuery}
        />
      </div>
      <div></div>
    </div>
  );
};
