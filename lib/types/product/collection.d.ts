import { Category } from "./category";

// types/collection.ts
export type Collection = {
  id: number;
  collection_name: string;
  name_en: string;
  name_id: string;
  name_zh: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  order: number;
  image_url: string | null;
};

export type SubCollection = {
  id: number;
  sub_collection_name: string;
  created_at: string;
  updated_at: string;
  collection_id: string;
  category_id: string;
  category: Category;
};
