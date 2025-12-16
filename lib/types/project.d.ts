// types/project.ts
import { Media } from "@/lib/types/media";
import { Product } from "@/lib/types/product/product";

export type Project = {
  id: string;
  project_name: string;
  designed_by: string | null;
  caption: string;
  created_at: string;
  updated_at: string;
  country: string;
  photos_by: string | null;
  link_photos_by: string | null;
  link_designed_by: string | null;
  project_type_id: string;
  // Optional fields jika ada
  featured_image?: string;
  featured_image_url?: string;
  gallery?: string[];
  project_type: ProjectType;
  media: Media[];
  featured_products: Product[];
};

interface ProjectType {
  id: string;
  project_type: string;
}
