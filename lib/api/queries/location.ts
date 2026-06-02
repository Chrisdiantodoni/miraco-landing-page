/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getLocations(params?: Record<string, any>) {
  return api.get(ENDPOINTS.LOCATE_US, {
    params,
    revalidate: 60,
  });
}
