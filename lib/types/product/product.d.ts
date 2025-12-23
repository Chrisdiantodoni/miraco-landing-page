/* eslint-disable @typescript-eslint/no-explicit-any */
// types/product.ts
import { Media } from "../media";
import { RelatedProduct } from "./product-related";
import { Finishing } from "./category";
import { Collection, SubCollection } from "./collection";
import { Category } from "./category";

export type Product = {
  id: string;
  name: string;
  code: string;
  thickness: string;
  size: string;
  description: string;
  barcode: string | null;
  product_type_id: string;
  sub_category_id: string;
  created_at: string;
  updated_at: string;
  is_available_in_miraedge: 0 | 1;
  category_id: string | null;
  collection_id: string | null;
  sub_collection_id: string | null;
  barcode_url: string | null;
  is_new: 1 | 0;
  // Relationships
  collection: Collection | null;
  category: Category | null;
  sub_collection: SubCollection | null;
  finishing: Finishing;
  media: Media[];
  related_products: RelatedProduct[];
};

// Simplified product type for lists
export type ProductListItem = Pick<
  Product,
  | "id"
  | "name"
  | "code"
  | "description"
  | "thickness"
  | "size"
  | "barcode_url"
  | "is_available_in_miraedge"
> & {
  image_url?: string;
  finishing_name?: string;
};

export type ProductListResponse = {
  meta: Meta;
  data: {
    data: Product[];
  };
};

// Alternative flat structure
export type FlatProductListResponse = {
  meta: Meta;
  data: {
    data: Product[];
  };
};
