// components/SearchInput.tsx
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Cari sesuatu...",
  onSearch,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={"formControl"}
          aria-label="Search input"
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className={"btnClear"}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className={"btnSearch"}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
