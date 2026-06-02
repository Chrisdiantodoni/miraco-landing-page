/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, LaravelResponse } from "../client";
import { ENDPOINTS } from "../endpoints";

export type HomeData = {
  hero: any;
  products: any[];
  projects: any[];
  collections?: any[];
  featured_items?: any[];
};

export async function getHome(params: {
  locale?: string;
}): Promise<LaravelResponse<HomeData>> {
  return api.get<HomeData>(ENDPOINTS.HOME, {
    params,
    revalidate: 60,
  });
}
