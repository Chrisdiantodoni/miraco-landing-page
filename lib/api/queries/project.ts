/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export async function getProjects(params?: Record<string, any>) {
  return api.get(ENDPOINTS.PROJECT, {
    params,
    revalidate: 60,
  });
}

export async function getProjectById(id: string | number) {
  return api.get(ENDPOINTS.PROJECT_BY_ID(id), {
    revalidate: 60,
  });
}
