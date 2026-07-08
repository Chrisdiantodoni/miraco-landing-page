/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/lib/types/product/product";
export const capitalizeFirstLetter = (string: string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};
export const getProductFormattedCode = (p: Product) => {
  if (!p?.code) return "No code provided";

  const categoryCode = p?.category?.code || "";
  const productCode = p.code;

  const parts = [categoryCode, productCode].filter(
    (part) => part && part.trim()
  );
  return parts.join(" ");
};

export const normalizeQueryParams = (params: Record<string, any>) => {
  const normalized: Record<string, any> = {};

  // Collection ID - bisa number atau UUID
  if (params.collection_id) {
    const isUUID =
      typeof params.collection_id === "string" &&
      params.collection_id.includes("-") &&
      params.collection_id.length > 20;
    normalized.collection_id = isUUID
      ? params.collection_id
      : Number(params.collection_id) || params.collection_id;
  }

  // Helper function untuk parse array IDs
  const parseIds = (value: any): (string | number)[] | undefined => {
    if (!value) return undefined;

    let ids: string[];

    // Jika sudah array
    if (Array.isArray(value)) {
      ids = value.map((v) => String(v).trim()).filter(Boolean);
    }
    // Jika string (comma-separated)
    else if (typeof value === "string" && value.trim()) {
      const decoded = decodeURIComponent(value);
      ids = decoded
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
    } else {
      return undefined;
    }

    if (ids.length === 0) return undefined;

    // Deteksi apakah UUID atau numeric
    const firstId = ids[0];
    const isUUID = firstId.includes("-") && firstId.length > 20;

    if (isUUID) {
      // Return sebagai string array untuk UUID
      return ids;
    } else {
      // Convert ke number untuk numeric IDs
      const numericIds = ids
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0);
      return numericIds.length > 0 ? numericIds : undefined;
    }
  };

  // Category ID
  const categoryIds = parseIds(params.category_id);
  if (categoryIds) {
    normalized.category_id = categoryIds;
  }

  // Type IDs (untuk filter)
  const typeIds = parseIds(params.types);
  if (typeIds) {
    normalized.types = typeIds;
  }

  // Finishing IDs (untuk filter)
  const finishingIds = parseIds(params.finishing);
  if (finishingIds) {
    normalized.finishing = finishingIds;
  }

  // Features IDs (untuk filter)
  const featureIds = parseIds(params.features);
  if (featureIds) {
    normalized.features = featureIds;
  }

  // Complementary IDs (untuk filter)
  const complementaryIds = parseIds(params.complementary);
  if (complementaryIds) {
    normalized.complementary = complementaryIds;
  }

  // Size IDs (untuk filter)
  const sizeIds = parseIds(params.sizes);
  if (sizeIds) {
    normalized.sizes = sizeIds;
  }

  // Thickness IDs (untuk filter)
  const thicknessIds = parseIds(params.thicknesses);
  if (thicknessIds) {
    normalized.thicknesses = thicknessIds;
  }

  // Boolean filters
  if (params.is_soft_touch !== undefined) {
    normalized.is_soft_touch =
      params.is_soft_touch === true ||
      params.is_soft_touch === "true" ||
      params.is_soft_touch === "1";
  }

  if (params.is_anti_fingerprint !== undefined) {
    normalized.is_anti_fingerprint =
      params.is_anti_fingerprint === true ||
      params.is_anti_fingerprint === "true" ||
      params.is_anti_fingerprint === "1";
  }

  if (params.is_miraedge !== undefined) {
    normalized.is_miraedge =
      params.is_miraedge === true ||
      params.is_miraedge === "true" ||
      params.is_miraedge === "1";
  }

  // Search - hanya jika ada dan tidak kosong
  if (params.search && String(params.search).trim()) {
    normalized.search = String(params.search).trim();
  }

  // Sort by
  if (params.sort_by && String(params.sort_by).trim()) {
    normalized.sort_by = String(params.sort_by).trim();
  }

  // Collection name
  if (params.collection) {
    normalized.collection = decodeURIComponent(String(params.collection));
  }

  // Page - selalu number minimal 1
  normalized.page = Math.max(1, Number(params.page) || 1);

  return normalized;
};
