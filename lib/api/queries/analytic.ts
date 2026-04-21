/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function storeAnalytic(body: Record<string, any>) {
  return api.post(ENDPOINTS.TRACKING, body);
}
