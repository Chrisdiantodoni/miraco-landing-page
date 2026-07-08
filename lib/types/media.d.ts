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
    | "additional_image_products"
    | "project_thumbnail"
    | "additional_image_projects"
    | "content_image"
    | "profile_photo";

  order: number | null;
  meta: any | null;
  created_at: string;
  updated_at: string;
  image_url: string;
};
