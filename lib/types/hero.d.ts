// types/hero.ts
export type HeroSection = {
  id: number;
  background_color: string | null;
  background_image: string | null;
  order: number;
  section: string;
  created_at: string;
  updated_at: string;
  cta_color: string | null;
  secondary_cta_url: string | null;
  is_active: "1" | "0" | boolean;
  cta_url: string | null;
  secondary_cta_color: string | null;
  hero_image: string | null;
  hero_image_url: string | null;
  background_image_url: string | null;
};

export type HeroTranslation = {
  id: number;
  hero_section_id: number;
  locale: string;
  title: string;
  subtitle: string;
  cta_text: string | null;
  secondary_cta_text: string | null;
  created_at: string;
  updated_at: string;
  hero_section: HeroSection;
};
