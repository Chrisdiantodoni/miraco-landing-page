export type RelatedProductPivot = {
  product_id: string;
  related_product_id: string;
  created_at: string;
  updated_at: string;
};

export type RelatedProduct = {
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
  barcode_url: string | null;
  pivot: RelatedProductPivot;
};
