export interface Member {
  id: string;
  referred_by_id: null;
  referral_count: number;
  fullname: string;
  company_name: string;
  phone_number: string;
  city: string;
  position: string;
  username: string;
  email: string;
  last_seen_at: Date;
  created_at: Date;
  updated_at: Date;
  favourite_ids: string[];
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  member: Member;
  access_token: string;
  token_type: "Bearer";
}
