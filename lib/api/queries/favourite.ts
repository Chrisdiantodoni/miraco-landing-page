/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getFavourites() {
  return api.get(ENDPOINTS.FAVOURITE_ALL);
}

export async function toggleFavourite(productId: string | number) {
  return api.post(ENDPOINTS.TOGGLE_FAVOURITE(productId), {});
}
