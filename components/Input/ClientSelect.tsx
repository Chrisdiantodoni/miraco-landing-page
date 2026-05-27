/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Select, { StylesConfig } from "react-select";
import { ControllerRenderProps } from "react-hook-form";

// ============================================
// Type Definitions
// ============================================

interface OptionType {
  label: string;
  value: any;
}

interface ClientSelectProps {
  field: ControllerRenderProps<any, any>;
  options: OptionType[];
  hasError?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  noOptionsMessage?: string;
  id?: string;
}

// ============================================
// Custom Styles Function
// ============================================

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
    padding: "8px 4px", // Padding vertikal yang cukup
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    overflow: "visible", // PENTING: Jangan potong content
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
});

// ============================================
// ClientSelect Component
// ============================================

const ClientSelect: React.FC<ClientSelectProps> = ({
  field,
  options,
  hasError = false,
  placeholder = "Select an option",
  isDisabled = false,
  isClearable = true,
  isSearchable = true,
  noOptionsMessage = "No options available",
  id,
}) => {
  // Find selected value dari options
  const selectedValue =
    options.find((option) => option.value === field.value) || null;

  return (
    <Select
      {...field}
      value={selectedValue}
      onChange={(option) => {
        // Kirim value ke form, bukan object
        field.onChange(option ? option.value : "");
      }}
      onBlur={field.onBlur}
      menuPortalTarget={document.body}
      options={options}
      styles={getSelectStyles(hasError)}
      placeholder={placeholder}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      classNamePrefix="custom-select"
      id={id}
      noOptionsMessage={() => noOptionsMessage}
      loadingMessage={() => "Loading..."}
      // Aksesibilitas
      aria-label={placeholder}
      aria-invalid={hasError}
    />
  );
};

export default ClientSelect;
