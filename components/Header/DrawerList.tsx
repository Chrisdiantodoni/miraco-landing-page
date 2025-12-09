// components/SearchDrawerContent.tsx
"use client";

import React, { useState, useMemo } from "react";
import SearchInput from "@/components/Input/SearchInput";
import styles from "./SearchDrawerContent.module.scss";

// --- Data Dummy ---
const searchResults = [
  {
    id: 1,
    name: "Designer White",
    type: "Solids",
    image: "/images/designer_white.jpg",
    colors: ["#ffffff", "#d3d3d3", "#808080", "#a9a9a9"],
  },
  {
    id: 2,
    name: "Faux Denim",
    type: "Patterns",
    image: "/images/faux_denim.jpg",
    colors: ["#d2b48c", "#8b4513", "#808080", "#000000"],
  },
  {
    id: 3,
    name: "Dandelion",
    type: "Solids",
    image: "/images/dandelion.jpg",
    colors: ["#ffff00", "#ffffe0", "#ffd700", "#ffa500"],
  },
  {
    id: 4,
    name: "Ocean Blue",
    type: "Solids",
    image: "/images/ocean_blue.jpg",
    colors: ["#0077be", "#0096ff", "#00a8e8", "#005d8c"],
  },
  {
    id: 5,
    name: "Forest Green",
    type: "Patterns",
    image: "/images/forest_green.jpg",
    colors: ["#1b4332", "#2d6a4f", "#40916c", "#52b788"],
  },
];

// --- Sub-Komponen ---

interface ResultCardProps {
  result: (typeof searchResults)[0];
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  return (
    <div className={styles.resultCard}>
      {/* Image Container */}
      <div className={styles.imageContainer}>
        <img
          src={result.image}
          alt={result.name}
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      {/* Color Chips */}
      <div className={styles.colorChips}>
        {result.colors.map((color, index) => (
          <button
            key={index}
            className={`${styles.colorChip} ${
              selectedColorIndex === index ? styles.active : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColorIndex(index)}
            title={color}
            aria-label={`Color ${index + 1}: ${color}`}
          />
        ))}
      </div>

      {/* Name and Type */}
      <div className={styles.info}>
        <h3 className={styles.name}>{result.name}</h3>
        <p className={styles.type}>{result.type}</p>
      </div>
    </div>
  );
};

// --- Komponen Utama ---

export const SearchDrawerContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter results berdasarkan search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchResults;
    }

    return searchResults.filter(
      (result) =>
        result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={`${styles.searchBarWrapper} container`}>
        <SearchInput
          placeholder="Cari produk, warna, atau tipe..."
          onSearch={setSearchQuery}
        />
      </div>
    </div>
  );
};
