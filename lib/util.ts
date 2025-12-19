import { Product } from "@/lib/types/product/product";
export const capitalizeFirstLetter = (string: string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};
export const getProductFormattedCode = (p: Product) => {
  if (!p?.code) return "No code provided";

  const categoryCode = p?.category?.code || "";
  const productCode = p.code;
  const subCategoryCode = p.finishing?.code || "";

  const parts = [categoryCode, productCode, subCategoryCode].filter(
    (part) => part && part.trim()
  );
  return parts.join(" ");
};
