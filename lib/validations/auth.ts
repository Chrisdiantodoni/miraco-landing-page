import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position_id: z.any(),
  region_id: z.any(),
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

export const updateProfileSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  company_name: z.string().min(1, "Company name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  region_id: z.any(),
  position_id: z.any(),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  profile_photo: z.any().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "Minimum 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
