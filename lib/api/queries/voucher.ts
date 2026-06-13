/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export interface MemberVoucher {
  id: string;
  voucher_id: string;
  member_id: string;
  voucher_code: string;
  verification_code: string | null;
  used_count: number;
  is_terminated: number;
  is_pending: number;
  created_at: string;
  updated_at: string;
  voucher: {
    id: string;
    name: string;
    discount_type: "fixed" | "percentage";
    discount_value: number;
    description: string | null;
    usage_type: string;
    is_active: number;
    min_transaction: number;
    min_product: number;
    created_at: string;
    updated_at: string;
  };
}

export interface GetVouchersParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export async function getVouchers(params?: GetVouchersParams) {
  return api.get<MemberVoucher[]>(ENDPOINTS.VOUCHERS, { params });
}

export async function getVoucherActive(params?: GetVouchersParams) {
  return api.get<MemberVoucher[]>(ENDPOINTS.VOUCHERS_ACTIVE, { params });
}

export async function validateVoucher(body: { voucher_code: string }) {
  return api.post(ENDPOINTS.VOUCHER_VALIDATE, body);
}
