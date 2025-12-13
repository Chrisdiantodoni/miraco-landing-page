/* eslint-disable @typescript-eslint/no-explicit-any */
export type Media = {
  id: number;
  model_type: string; // e.g., "App\\Models\\Product"
  model_id: string;
  path: string;
  type:
    | "image"
    | "images"
    | "product_thumbnail"
    | "product_to_download"
    | "thumbnail"
    | "additional_image_products";
  order: number | null;
  meta: any | null;
  created_at: string;
  updated_at: string;
  image_url: string;
};
