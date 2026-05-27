/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useDebounce } from "../../lib/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Select from "react-select";
import { useCallback } from "react";
import { StylesConfig } from "react-select";
import { getPositionAll } from "@/lib/api/queries/member";

interface OptionType {
  label: string;
  value: string | number;
}

const SearchPosition = ({
  hasError = false,
  onChange,
  value,
  placeholder,
}: any) => {
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

  const { data, isFetching } = useQuery<any>({
    queryKey: ["searchPositionInput", queryParamsForApi],
    queryFn: async () => {
      const response = await getPositionAll(queryParamsForApi);
      return response;
    },
    enabled: hasSearchTerm || isOpen,
  });

  const positionOptions: OptionType[] = useMemo(() => {
    const positions = data?.data?.data || [];
    return positions?.map((p: any) => ({
      label: p.position_name,
      value: p.id,
    }));
  }, [data]);

  const handleInputChange = useCallback((inputValue: string) => {
    setSearch(inputValue);
  }, []);

  const handleSelectChange = useCallback(
    (newValue: OptionType | null) => {
      onChange(newValue);
    },
    [onChange],
  );

  const safeValue = useMemo(() => {
    if (!value || Array.isArray(value)) return null;
    return value;
  }, [value]);

  return (
    <Select
      isMulti={false}
      isClearable={true}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => setIsOpen(false)}
      value={safeValue}
      onChange={handleSelectChange}
      closeMenuOnSelect={true}
      inputValue={search}
      isLoading={isFetching}
      onInputChange={handleInputChange}
      options={positionOptions}
      styles={getSelectStyles(hasError)}
      menuPortalTarget={document.body}
      placeholder={placeholder}
      classNamePrefix="custom-select"
    />
  );
};

export default SearchPosition;

const getSelectStyles = (
  hasError: boolean = false,
): StylesConfig<OptionType, false> => ({
  // Container utama select
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 0,
    height: "44px",
    paddingLeft: "12px",
    paddingRight: "4px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: hasError
      ? "#ff0000"
      : state.isFocused
        ? "#000000"
        : "#D1D5DB",
    boxShadow: "none",
    "&:hover": {
      borderColor: hasError ? "#ff0000" : "#000000",
      cursor: "pointer",
    },
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  }),

  valueContainer: (base: any) => ({
    ...base,
    minHeight: 0,
    height: "42px",
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
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#111827",
    gridTemplateColumns: "0 min-content", // Fix untuk tidak terpotong
  }),

  // Selected value text - FIX TERPOTONG
  singleValue: (base: any) => ({
    ...base,
    margin: "0",
    padding: "0",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#111827",
    position: "static",
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
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#9CA3AF",
    position: "static",
    top: "auto",
    transform: "none",
  }),

  // Container untuk indicators (arrow & clear button)
  indicatorsContainer: (base: any) => ({
    ...base,
    minHeight: 0,
    height: "42px",
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
