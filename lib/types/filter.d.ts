/* eslint-disable @typescript-eslint/no-explicit-any */
// types/filters.ts
import { Type } from "./master/master.d";
import { Size, Thickness } from "./master/master.d";
import { Finishing } from "./master/master.d";

export interface FilterItem {
  id: string | number;
  name: string;
}

export interface Category {
  id: string | number;
  category_name: string;
}

export type FilterType =
  | "types"
  | "finishing"
  | "complementary"
  | "features"
  | "sizes"
  | "thicknesses";

export interface ActiveFilters {
  // categories: (string | number)[];
  features: any;
  complementary: any;
  sort_by?: "new" | "";
  types: (string | number)[];
  finishing: (string | number)[];
  sizes: (string | number)[];
  thicknesses: (string | number)[];
  is_soft_touch: boolean;
  is_anti_fingerprint: boolean;
  is_miraedge: boolean;
  // subCollections: (string | number)[];
}

// Props interfaces
export interface SidebarFilterProps {
  onFilterChange?: (filters: ActiveFilters) => void;
  initialFilters: ActiveFilters;
  collection_id: string;
  sidebar_data: {
    types: Type[];
    finishing: Finishing[];
    sizes: Size[];
    thicknesses: Thickness[];
  };
}

export interface FilterBlockProps {
  title: string;
  data: (Category | Type | Size | Thickness | Finishing)[];
  filterType: FilterType;
  activeFilters: ActiveFilters;
  handleCheckboxChange: (filterType: FilterType, slug: string | number) => void;
}
