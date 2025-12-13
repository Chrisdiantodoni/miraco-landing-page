/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getSiteData(params?: Record<string, any>) {
  return api
    .get(ENDPOINTS.SITE_SETTINGS, {
      params,
      revalidate: 60,
    })
    ?.then((res) => res.data);
}
