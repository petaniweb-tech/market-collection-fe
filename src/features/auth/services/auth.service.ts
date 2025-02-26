import axiosInstance from "@/lib/axios";
import {
  LoginFormType,
  LoginResponseData,
  User,
  VerifyEmailResponse,
} from "../types/auth.types";
import { ApiResponse } from "@/types/api.types";

// API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/signin",
  LOGOUT: "/api/auth/signout",
  CURRENT_USER: "/api/auth/me",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  UPDATE_PROFILE: "/api/auth/updateProfile",
  VERIFY_EMAIL: "/api/auth/verifyEmail",
  REFRESH_TOKEN: "/api/auth/refresh-token",
};

export const authService = {
  // Login with identifier (email/phone) and password
  async login({
    username,
    password,
  }: LoginFormType): Promise<LoginResponseData> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
        AUTH_ENDPOINTS.LOGIN,
        {
          username,
          password,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Authentication failed");
      }

      const { user, session } = response.data.data;

      // Store auth data in localStorage
      localStorage.setItem("token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
      localStorage.setItem("expires_at", session.expires_at.toString());
      localStorage.setItem("user", JSON.stringify(user));

      return response.data.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // Extract error message from API response if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Authentication failed";

      throw new Error(errorMessage);
    }
  },

  // Verify email with token
  // Verify email with token
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await axiosInstance.get<
        ApiResponse<VerifyEmailResponse>
      >(`${AUTH_ENDPOINTS.VERIFY_EMAIL}?token=${token}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Email verification failed");
      }

      return response.data.data;
    } catch (error) {
      console.error(
        "Email verification error:",
        error.response?.data || error.message
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Email verification failed";

      throw new Error(errorMessage);
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<LoginResponseData> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        { refresh_token: refreshToken }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to refresh token");
      }

      const { user, session } = response.data.data;

      // Update auth data in localStorage
      localStorage.setItem("token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
      localStorage.setItem("expires_at", session.expires_at.toString());
      localStorage.setItem("user", JSON.stringify(user));

      return response.data.data;
    } catch (error) {
      console.error(
        "Refresh token error:",
        error.response?.data || error.message
      );

      // Clean up storage on refresh failure
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user");

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to refresh token";

      throw new Error(errorMessage);
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage on logout
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user");
    }
  },

  // Get current user from localStorage or API
  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from localStorage
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      // If not in localStorage, fetch from API
      const response = await axiosInstance.get<ApiResponse<User>>(
        AUTH_ENDPOINTS.CURRENT_USER
      );

      if (!response.data.success) {
        throw new Error("Failed to get current user");
      }

      // Cache the user data
      localStorage.setItem("user", JSON.stringify(response.data.data));

      return response.data.data;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Check if user is authenticated and token is not expired
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return now < parseInt(expiresAt);
  },

  // Check if token needs refresh (less than 5 minutes until expiration)
  shouldRefreshToken(): boolean {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) return false;

    const now = Math.floor(Date.now() / 1000);
    // Return true if token expires in less than 5 minutes
    return expiresAt - now < 300;
  },

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  },

  // Get token expiration time
  getTokenExpiresAt(): number | null {
    const expiresAt = localStorage.getItem("expires_at");
    return expiresAt ? parseInt(expiresAt) : null;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await axiosInstance.post<ApiResponse<unknown>>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        {
          email,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to send password reset email"
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send password reset email"
      );
    }
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response = await axiosInstance.post<ApiResponse<unknown>>(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        {
          token,
          password,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axiosInstance.put<ApiResponse<User>>(
        AUTH_ENDPOINTS.UPDATE_PROFILE,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      // Update cached user data
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};
