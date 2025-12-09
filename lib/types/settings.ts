export interface SiteSettings {
  id: string;
  email_contacts: string;
  phone_contacts: string;
  logo_white: string;
  logo_dark: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  created_at: string;
  updated_at: string;
  logo_white_url: string;
  logo_dark_url: string;
}

export interface Collection {
  id: number;
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
}
