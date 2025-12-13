// types/project.ts
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
};
