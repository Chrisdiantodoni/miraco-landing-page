import { Category } from "./product/category";
import { Type, Finishing, Thickness } from "./master/master.d";

export interface SiteSettings {
  id?: string;
  email_contacts: string;
  phone_contacts: string;
  logo_white: string;
  logo_dark: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
  logo_white_url: string;
  logo_dark_url: string;
}

export interface Collection {
  id: number;
  name_en: string;
  name_zh: string;
  name_id: string;
  collection_name: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  order: number;
  image_url: string | null;
}

export interface SiteData {
  site_settings: SiteSettings;
  collections: Collection[];
  categories: Category[];
}
