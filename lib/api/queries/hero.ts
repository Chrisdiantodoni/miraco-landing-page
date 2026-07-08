/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getHero(params?: Record<string, any>) {
  return api.get(ENDPOINTS.HERO, {
    params,
    revalidate: 60,
  });
}
