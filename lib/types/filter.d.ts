// types/filters.ts

export interface Category {
  id: string | number;
  category_name: string;
}

export interface Collection {
  id: string | number;
  collection_name: string;
}

export interface SubCollection {
  id: string | number;
  sub_collection_name: string;
  collection_id: string | number;
}

export interface FilterItem {
  id: string | number;
  name: string;
}

export type FilterType = "categories" | "subCollections";

export interface ActiveFilters {
  categories: (string | number)[];
  sort_by: "new" | "";
  //   types: (string | number)[];
  subCollections: (string | number)[];
}

export interface SiteSettings {
  categories?: Category[];
  sub_collections?: SubCollection[];
}

// Props interfaces
export interface SidebarFilterProps {
  onFilterChange?: (filters: ActiveFilters) => void;
  collection_id?: string | number;
  initialFilters: ActiveFilters;
}

export interface FilterBlockProps {
  title: string;
  data: (Category | Collection | SubCollection)[];
  filterType: FilterType;
  activeFilters: ActiveFilters;
  handleCheckboxChange: (filterType: FilterType, slug: string | number) => void;
}
