import { Meta } from "../base";

interface Location {
  id: string;
  name_company: string;
  address: string;
  contacts: string;
  image: string;
  lat?: number;
  long?: number;
  order?: number;
  link_google_maps?: string;
  image_url?: string;
}

export type LocationListResponse = {
  meta: Meta;
  data: Location[];
};
