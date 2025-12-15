/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getProducts(params?: Record<string, any>) {
  console.log({ params });
  return api.get(ENDPOINTS.COLLECTION, {
    params,
    revalidate: 60,
  });
}

export async function getProductById(id: string | number) {
  return api.get(ENDPOINTS.COLLECTION_BY_ID(id), {
    revalidate: 60,
  });
}
