// components/SearchInput.tsx
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Cari sesuatu...",
  value,
  onChange,
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  // const handleSearch = () => {
  //   onSearch?.(searchValue);
  // };

  const handleClear = () => {
    onChange?.("");
  };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  return (
    <div className={"searchWrapper"}>
      <div className={"searchInputGroup"}>
        {/* Search Icon */}
        <span className={"searchIcon"}>
          <Search size={20} />
        </span>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={"formControl"}
          aria-label="Search input"
        />

        {/* Clear Button */}
        {value?.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={"btnClear"}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
