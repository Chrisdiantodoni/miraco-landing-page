/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getRequestPages(params?: Record<string, any>) {
  return api.get(ENDPOINTS.REQUESTS, {
    params,
    revalidate: 60,
  });
}

export async function storeRequest(body: Record<string, any>) {
  return api.post(ENDPOINTS.REQUESTS, body);
}

export async function sendFormSpree(body: Record<string, any>) {
  return api.post(ENDPOINTS.FORMSPREE, body);
}
export async function sendFormSpreeDONI(body: Record<string, any>) {
  return api.post(ENDPOINTS.FORMSPREE_DONI, body);
}
