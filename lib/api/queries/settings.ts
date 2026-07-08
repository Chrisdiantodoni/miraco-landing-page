/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getSiteData(params: { locale?: string }) {
  return api
    .get(ENDPOINTS.SITE_SETTINGS, {
      params,
      revalidate: 60,
    })
    ?.then((res) => res.data);
}

export async function getSubCollection() {
  return api
    .get(ENDPOINTS.SUB_COLLECTION, {
      revalidate: 60,
    })
    .then((res) => res.data);
}

export async function getCollection() {
  return api
    .get(ENDPOINTS.COLLECTION_MASTER, {
      revalidate: 60,
    })
    .then((res) => res.data);
}
