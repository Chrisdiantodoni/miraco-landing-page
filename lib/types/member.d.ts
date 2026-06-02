import { Media } from "./media";

export interface Member {
  id: string;
  referred_by_id: null;
  referral_count: number;
  fullname: string;
  company_name: string;
  phone_number: string;
  profile_photo: string;
  region: Region;
  position: Position;
  username: string;
  email: string;
  last_seen_at: Date;
  created_at: Date;
  updated_at: Date;
  media?: Media[];
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

export interface Position {
  position_name: string;
  id: string;
}
export interface Region {
  id: string;
  region_name: string;
}
