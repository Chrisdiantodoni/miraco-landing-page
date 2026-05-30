/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, LaravelResponse } from "../client";
import { ENDPOINTS } from "../endpoints";
import { LoginPayload, LoginResponse, Member } from "@/lib/types/member";

export async function login(
  body: LoginPayload,
): Promise<LaravelResponse<LoginResponse>> {
  return api.post<LoginResponse>(ENDPOINTS.LOGIN, body);
}

export async function register(
  body?: Record<string, any> | FormData,
  isFormData?: boolean,
) {
  if (isFormData && body instanceof FormData) {
    return api.postFormData(ENDPOINTS.REGISTER, body);
  }
  return api.post(ENDPOINTS.REGISTER, body as Record<string, any>);
}

export async function me(): Promise<LaravelResponse<Member>> {
  return api.get<Member>(ENDPOINTS.ME);
}

export async function getPositionAll(params?: Record<string, any>) {
  return api.get(ENDPOINTS.POSITION, { params });
}

export async function checkUsername(username: string) {
  return api.get(ENDPOINTS.CHECK_USERNAME, { params: { username } });
}

export async function checkReferral(code: string) {
  return api.get(ENDPOINTS.CHECK_REFERRAL_USERNAME, { params: { code } });
}

export async function submitOrder(body: Record<string, any>) {
  return api.post(ENDPOINTS.ORDER_REQUEST, body);
}

export async function validateVoucher(body: { voucher_code: string }) {
  return api.post(ENDPOINTS.VOUCHER_VALIDATE, body);
}

export interface GetOrdersParams {
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
}

export async function getOrders(params?: GetOrdersParams) {
  return api.get(ENDPOINTS.ORDERS, { params });
}

export async function getOrderDetail(orderId: string) {
  return api.get(ENDPOINTS.ORDERS_DETAIL(orderId));
}
