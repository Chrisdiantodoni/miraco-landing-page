/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, LaravelResponse } from "../client";
import { ENDPOINTS } from "../endpoints";
import { LoginPayload, LoginResponse, Member } from "@/lib/types/member";

export async function login(
  body: LoginPayload
): Promise<LaravelResponse<LoginResponse>> {
  return api.post<LoginResponse>(ENDPOINTS.LOGIN, body);
}

export async function register(body?: Record<string, any>) {
  return api.post(ENDPOINTS.REGISTER, body);
}

export async function me(
  token: string
): Promise<LaravelResponse<Member>> {
  return api.get<Member>(ENDPOINTS.ME, { token });
}

export async function getPositionAll(params?: Record<string, any>) {
  return api.get(ENDPOINTS.POSITION, { params });
}
