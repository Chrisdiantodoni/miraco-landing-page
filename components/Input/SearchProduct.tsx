/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ClientSelect from "./ClientSelect";
import { useState } from "react";
import { useDebounce } from "../../lib/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { getProductsAll } from "@/lib/api/queries/product";
import { useMemo } from "react";
import Select from "react-select";
import { Product } from "@/lib/types/product/product";
import { useCallback } from "react";
import { StylesConfig } from "react-select";
import { toast } from "react-toastify";

const getProductFormattedCode = (p: Product | any) => {
  if (!p?.code) return "No code provided";

  const categoryCode = p.sub_collection?.category?.code || "";
  const productCode = p.code;
  const subCategoryCode = p.finishing?.code || "";

  const parts = [categoryCode, productCode, subCategoryCode].filter(
    (part) => part && part.trim()
  );
  return parts.join(" ");
};
interface OptionType {
  label: string;
  value: string | number; // ID produk
}

interface DataProductProps {
  data: {
    data: Product[];
  };
}
const MAX_PRODUCTS = 5;

const SearchProduct = ({ hasError = false, onChange, value, field }: any) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 500);
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const queryParamsForApi = useMemo(() => {
    const params: Record<string, any> = {
      search: debouncedSearchTerm || "",
    };
    return params;
  }, [debouncedSearchTerm]);
  const { data, isFetching } = useQuery<DataProductProps>({
    queryKey: ["searchProductInput", queryParamsForApi],
    queryFn: async () => {
      const response = await getProductsAll(queryParamsForApi);
      return response;
    },
    enabled: hasSearchTerm || isOpen,
  });
  const productOptions: OptionType[] = useMemo(() => {
    // Ambil data dari response (pastikan struktur response API Anda benar)
    const products = data?.data?.data || [];

    return products?.map((p) => ({
      // ✅ Buat label yang informatif
      label: getProductFormattedCode(p),
      value: p.id,
    }));
  }, [data]);
  const handleInputChange = useCallback((inputValue: string) => {
    setSearch(inputValue);
  }, []);
  const handleSelectChange = useCallback(
    (newValue: any) => {
      // ✅ FIX: Validasi KETAT sebelum update
      if (Array.isArray(newValue)) {
        // Cek apakah jumlah AKAN melebihi limit
        if (newValue.length > MAX_PRODUCTS) {
          // ❌ TOLAK: Ambil hanya MAX_PRODUCTS item pertama
          console.log(newValue.length);
          toast.error(
            `Maximum ${MAX_PRODUCTS} products allowed. Only the first ${MAX_PRODUCTS} were selected.`,
            { position: "top-right" }
          );

          // Update dengan value yang sudah di-limit
          onChange(newValue.slice(0, MAX_PRODUCTS));
          return;
        }

        // ✅ Valid: Update state
        onChange(newValue);
      } else if (newValue === null || newValue === undefined) {
        // Clear button ditekan
        onChange([]);
      } else {
        // Single select (seharusnya tidak terjadi karena isMulti=true)
        onChange([newValue]);
      }
    },
    [onChange]
  );
  const safeValue = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.slice(0, MAX_PRODUCTS);
  }, [value]);
  // ✅ Memoize current selection count untuk performance
  const currentSelectionCount = useMemo(() => {
    return Array.isArray(value) ? value.length : 0;
  }, [value]);

  const isOptionDisabled = useCallback(
    () => Array.isArray(value) && value.length >= MAX_PRODUCTS,
    [value]
  );
  // ✅ Check apakah sudah max selection
  return (
    <Select
      isMulti={true as any}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => setIsOpen(false)}
      value={safeValue}
      onChange={handleSelectChange}
      closeMenuOnSelect={false}
      inputValue={search}
      isLoading={isFetching}
      onInputChange={handleInputChange}
      options={productOptions}
      styles={getSelectStyles(hasError)}
      menuPortalTarget={document.body}
      //   isOptionDisabled={isOptionDisabled}
      classNamePrefix="custom-select"
    />
  );
};

export default SearchProduct;

const getSelectStyles = (
  hasError: boolean = false
): StylesConfig<OptionType, false> => ({
  // Container utama select
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "48px",
    height: "auto",
    paddingLeft: "12px",
    paddingRight: "4px",
    borderRadius: "0.375rem",
    backgroundColor: "#fff", // Abu-abu terang
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: hasError
      ? "#ff0000"
      : state.isFocused
      ? "#000000" // Hitam saat focus
      : "#D1D5DB", // Abu-abu border default
    boxShadow: "none",
    "&:hover": {
      borderColor: hasError ? "#ff0000" : "#000000",
      cursor: "pointer",
    },
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  }),

  // Container untuk value dan placeholder
  valueContainer: (base: any) => ({
    ...base,
    minHeight: "46px",
    padding: "8px 4px",
    display: "flex",
    // ✅ PERBAIKAN UTAMA: Izinkan wrapping chip multi-value
    flexWrap: "wrap",
    // Hapus overflow: "visible" jika menyebabkan masalah rendering, tetapi biarkan dulu
    overflow: "visible",
  }),

  // Input field (ketika typing)
  input: (base: any) => ({
    ...base,
    margin: "0",
    padding: "0",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#111827",
    gridTemplateColumns: "0 min-content", // Fix untuk tidak terpotong
  }),

  // Selected value text - FIX TERPOTONG
  singleValue: (base: any) => ({
    ...base,
    margin: "0",
    padding: "0",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#111827",
    position: "static", // PENTING: Ubah dari absolute
    top: "auto",
    transform: "none",
    maxWidth: "100%",
    overflow: "visible", // Tidak terpotong
    textOverflow: "clip",
    whiteSpace: "normal", // Allow wrap jika terlalu panjang
  }),

  // Placeholder text
  placeholder: (base: any) => ({
    ...base,
    margin: "0",
    padding: "0",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#9CA3AF", // Abu-abu untuk placeholder
    position: "static",
    top: "auto",
    transform: "none",
  }),

  // Container untuk indicators (arrow & clear button)
  indicatorsContainer: (base: any) => ({
    ...base,
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
  }),

  // Dropdown arrow indicator
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    padding: "8px",
    color: state.isDisabled ? "#D1D5DB" : "#6B7280", // Abu-abu
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#111827",
    },
  }),

  // Clear button indicator
  clearIndicator: (base: any) => ({
    ...base,
    padding: "8px",
    color: "#9CA3AF",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#ff0000",
    },
  }),

  // Indicator separator (garis vertikal)
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: "#ffffff", // Abu-abu
    marginTop: "10px",
    marginBottom: "10px",
  }),

  // Dropdown menu
  menu: (base: any) => ({
    ...base,
    marginTop: "4px",
    borderRadius: "8px",
    backgroundColor: "white",
    border: "1.5px solid #E5E7EB",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
    overflow: "hidden",
  }),

  // Menu list container
  menuList: (base: any) => ({
    ...base,
    padding: "4px",
    maxHeight: "240px",
    zIndex: 999,
  }),

  // Individual option dalam dropdown
  option: (base: any, state: any) => ({
    ...base,
    zIndex: 999,
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "6px",
    backgroundColor: state.isSelected
      ? "#F3F4F6" // Abu-abu terang untuk selected
      : state.isFocused
      ? "#F9FAFB" // Abu-abu sangat terang untuk hover
      : "transparent",
    color: state.isSelected ? "#111827" : "#374151",
    cursor: "pointer",
    transition: "all 0.15s ease",
    "&:active": {
      backgroundColor: "#E5E7EB",
    },
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999, // PENTING: Untuk memastikan container portal menang melawan modal/navbar lain
  }),

  // Loading indicator
  loadingIndicator: (base: any) => ({
    ...base,
    color: "#6B7280",
  }),

  // Loading message
  loadingMessage: (base: any) => ({
    ...base,
    fontSize: "14px",
    color: "#9CA3AF",
    padding: "8px 12px",
  }),

  // No options message
  noOptionsMessage: (base: any) => ({
    ...base,
    fontSize: "14px",
    color: "#9CA3AF",
    padding: "8px 12px",
  }),
  multiValue: (base: any) => ({
    ...base,
    // Margin di sini membantu spacing antar chip
    margin: "3px 4px",
    backgroundColor: "#E5E7EB", // Latar belakang chip abu-abu
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "14px",
  }),

  // Style untuk Label di dalam Chip
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#1F2937", // Warna teks chip
  }),

  // Style untuk X (Clear button) di Chip
  multiValueRemove: (base: any) => ({
    ...base,
    ":hover": {
      backgroundColor: "#EF4444", // Warna hover merah
      color: "white",
      borderRadius: "0 4px 4px 0",
    },
  }),
});
