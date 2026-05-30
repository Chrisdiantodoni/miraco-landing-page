import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position: z.any(),
  city: z.any(),
  fullname: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  confirm_password: z.string().min(1, "Please confirm your password"),
  referral_code: z.string().optional(),
  profile_photo: z.any().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
