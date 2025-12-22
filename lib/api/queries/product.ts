/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getProducts(params?: Record<string, any>) {
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

export async function getProductsAll(params?: Record<string, any>) {
  return api.get(ENDPOINTS.COLLECTION_ALL, {
    params,
    revalidate: 60,
  });
}

export async function downloads(
  id: string | number,
  body: {
    image_path: string;
    type: string;
    download_type: string;
  }
) {
  return api.post(ENDPOINTS.DOWNLOAD(id), {
    body,
  });
}
