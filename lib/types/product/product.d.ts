/* eslint-disable @typescript-eslint/no-explicit-any */
// types/product.ts
import { Media } from "../media";
import { RelatedProduct } from "./product-related";
import { Finishing } from "./category";
import { Collection, SubCollection } from "./collection";
import { Category } from "./category";
import { Thickness } from "@/lib/types/master/master.d";
import { Size, Design } from "../master/master.d";
import { Type } from "../master/master.d";

export type Product = {
  id: string;
  name: string;
  code: string;
  thickness: Thickness;
  type: Type;
  size: Size;
  price: number;
  promo_price: number;
  description: string;
  barcode: string | null;
  product_type_id: string;
  sub_category_id: string;
  created_at: string;
  updated_at: string;
  is_available_in_miraedge: 0 | 1;
  category_id: string | null;
  collection_id: string | null;
  barcode_url: string | null;
  is_new: 1 | 0;
  miraedge_detail: string;
  // Relationships
  collection: Collection | null;
  category: Category | null;
  sub_collection: SubCollection | null;
  finishing: Finishing;
  media: Media[];
  design: Design;
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
