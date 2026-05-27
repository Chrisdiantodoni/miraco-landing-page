export interface Member {
  id: number;
  name: string;
  email: string;
  username: string;
  company_name: string;
  phone: string;
  role: string;
  profile_photo: string | null;
  address: string;
  city: string;
  position: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  member: Member;
  access_token: string;
  token_type: "Bearer";
}
