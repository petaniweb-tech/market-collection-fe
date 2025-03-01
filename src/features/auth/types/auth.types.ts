import { z } from "zod";

// Login form validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email atau nomor HP diperlukan" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(100)
});

// Login form type
export type LoginFormType = z.infer<typeof loginSchema>;

// API Response format
// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// User type
export interface User {
  id: string;
  name: string;
  role: string;
  phone_number: string;
  email: string;
  location_id: string | null;
  active: boolean;
  verified_at: string;
  created_at: string;
  updated_at: string;
}

// Session type
export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
}

// Login response data
export interface LoginResponseData {
  user: User;
  session: Session;
}

// Auth state for context
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  expires_at: number | null;
}

export type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

// Extend the AuthContextType to include verification methods
export interface VerificationMethods {
  verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
  isVerifyLoading: boolean;
  isVerifyError: boolean;
  verifyErrorMessage: string | null;
}

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}