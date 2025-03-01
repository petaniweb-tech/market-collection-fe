/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryObserverResult,
} from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  AuthState,
  User,
  LoginResponseData,
  LoginFormType,
  VerifyEmailResponse,
} from "../types/auth.types";

// Query keys
export const AUTH_QUERY_KEYS = {
  USER: ["auth", "user"],
  SESSION: ["auth", "session"],
  REFRESH: ["auth", "refresh"],
  VERIFY: ["auth", "verify"],
};

// Define auth context types with mutation states
interface AuthContextType {
  authState: AuthState;
  login: (data: LoginResponseData) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<boolean>;
  verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
  isVerifyLoading: boolean;
  isVerifyError: boolean;
  verifyErrorMessage: string | null;
  isLoading: boolean;
  isLoginPending: boolean;
  isLogoutPending: boolean;
  isRefreshPending: boolean;
  refetchUser: () => Promise<QueryObserverResult<User | null>>;
  forgotPassword: (email: string) => Promise<void>;
  isForgotPasswordPending: boolean;
  resetPassword: (
    token: string,
    password: string,
    confirm_password: string
  ) => Promise<void>;
  isResetPasswordPending: boolean;
}

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Default auth state
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  expires_at: null,
};

// Create auth context with type definition
export const AuthContext = createContext<AuthContextType>({
  authState: defaultAuthState,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
  refreshToken: async () => false,
  isLoading: false,
  isLoginPending: false,
  isLogoutPending: false,
  isRefreshPending: false,
  verifyEmail: async () => ({ success: false, message: "Not implemented" }),
  isVerifyLoading: false,
  isVerifyError: false,
  verifyErrorMessage: null,
  forgotPassword: async () => {},
  isForgotPasswordPending: false,
  resetPassword: async () => {},
  isResetPasswordPending: false,
  refetchUser: async () => ({ isSuccess: false }) as any,
});

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize from localStorage if available
    const token = localStorage.getItem("token");
    const expires_at = localStorage.getItem("expires_at");

    if (token && expires_at) {
      return {
        ...defaultAuthState,
        isAuthenticated: authService.isAuthenticated(),
        token,
        expires_at: parseInt(expires_at),
      };
    }
    return defaultAuthState;
  });

  // Fetch current user - will be cached and automatically refetched when needed
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: AUTH_QUERY_KEYS.USER,
    queryFn: authService.getCurrentUser,
    enabled: authState.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // Refresh user data every 15 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (loginData: LoginFormType) => authService.login(loginData),
    onSuccess: (data: LoginResponseData) => {
      // Update auth state with login response
      setAuthState({
        isAuthenticated: true,
        token: data.session.access_token,
        user: data.user,
        expires_at: data.session.expires_at,
      });

      // Update cached user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.USER, data.user);
    },
  });

  // Add a new state for forgot password loading
  const [isForgotPasswordPending, setIsForgotPasswordPending] = useState(false);

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsForgotPasswordPending(true);
      await authService.forgotPassword(email);
    } finally {
      setIsForgotPasswordPending(false);
    }
  };

  // Add state for reset password loading
  const [isResetPasswordPending, setIsResetPasswordPending] = useState(false);

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: {
      token: string;
      password: string;
      confirm_password: string;
    }) => {
      // We don't need to decode the token here since it's handled in the service
      return authService.resetPassword(
        data.token,
        data.password,
        data.confirm_password
      );
    },
  });

  // Reset password function
  const resetPassword = async (
    token: string,
    password: string,
    confirm_password: string
  ): Promise<void> => {
    try {
      setIsResetPasswordPending(true);

      // We don't need to decode the token here since it's handled in the service
      await authService.resetPassword(token, password, confirm_password);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error; // Rethrow to allow component to handle the error
    } finally {
      setIsResetPasswordPending(false);
    }
  };

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onError: (error: Error) => {
      setVerifyErrorMessage(error.message);
    },
    onSuccess: () => {
      setVerifyErrorMessage(null);
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return authService.refreshToken(refreshToken);
    },
    onSuccess: (data: LoginResponseData) => {
      // Update auth state with refreshed session
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        token: data.session.access_token,
        user: data.user,
        expires_at: data.session.expires_at,
      }));

      // Update cached user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.USER, data.user);

      // Signal success to any components waiting on refresh
      queryClient.setQueryData(AUTH_QUERY_KEYS.REFRESH, {
        success: true,
        timestamp: Date.now(),
      });
    },
    onError: () => {
      // Handle refresh failure - log out
      setAuthState(defaultAuthState);
      queryClient.clear();

      // Redirect to login
      window.location.href = "/login";
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Reset auth state
      setAuthState(defaultAuthState);

      // Clear cached queries
      queryClient.clear();
    },
  });

  // Update auth state when user data changes
  useEffect(() => {
    if (user && authState.isAuthenticated) {
      setAuthState((prev) => ({
        ...prev,
        user,
      }));
    }
  }, [user, authState.isAuthenticated]);

  // Check token expiration periodically and refresh if needed
  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      if (!authState.isAuthenticated) return;

      // Check if token is valid but approaching expiration
      if (authService.isAuthenticated() && authService.shouldRefreshToken()) {
        // Token is valid but close to expiry, refresh it
        refreshTokenMutation.mutate();
      } else if (!authService.isAuthenticated()) {
        // Token is expired, try to refresh or log out
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          refreshTokenMutation.mutate();
        } else {
          // No refresh token, just log out
          logoutMutation.mutate();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenInterval);
  }, [authState.isAuthenticated]);

  // Login function - directly updates state without mutation
  const login = (data: LoginResponseData): void => {
    setAuthState({
      isAuthenticated: true,
      token: data.session.access_token,
      user: data.user,
      expires_at: data.session.expires_at,
    });

    // Update cached user data
    queryClient.setQueryData(AUTH_QUERY_KEYS.USER, data.user);
  };

  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [isVerifyError, setIsVerifyError] = useState(false);
  const [verifyErrorMessage, setVerifyErrorMessage] = useState<string | null>(
    null
  );

  const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
    try {
      setIsVerifyLoading(true);
      setIsVerifyError(false);
      setVerifyErrorMessage(null);

      // Special handling for 204 response
      try {
        const response = await authService.verifyEmail(token);
        return response;
      } catch (error) {
        // Double-check for 204 status at this level too
        if (error.response?.status === 204) {
          return { success: true, message: "Email verified successfully" };
        }
        throw error;
      }
    } catch (error) {
      setIsVerifyError(true);
      setVerifyErrorMessage(
        error instanceof Error ? error.message : "Email verification failed"
      );
      throw error;
    } finally {
      setIsVerifyLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  // Refresh token function - can be called manually
  const refreshToken = async (): Promise<boolean> => {
    try {
      await refreshTokenMutation.mutateAsync();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Update user function
  const updateUser = (updatedUser: User): void => {
    if (authState.user && authState.isAuthenticated) {
      // Update local state
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      // Update query cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.USER, updatedUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Calculate loading states
  const isLoading =
    isUserLoading ||
    loginMutation.isPending ||
    logoutMutation.isPending ||
    refreshTokenMutation.isPending;
  const isLoginPending = loginMutation.isPending;
  const isLogoutPending = logoutMutation.isPending;
  const isRefreshPending = refreshTokenMutation.isPending;

  // Return the provider with createElement to avoid JSX type issues
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        authState,
        login,
        logout,
        updateUser,
        refreshToken,
        isLoading,
        isLoginPending,
        isLogoutPending,
        isRefreshPending,
        refetchUser,
        verifyEmail,
        isVerifyLoading,
        isVerifyError,
        verifyErrorMessage,
        forgotPassword,
        isForgotPasswordPending:
          forgotPasswordMutation.isPending || isForgotPasswordPending,
        resetPassword,
        isResetPasswordPending:
          resetPasswordMutation.isPending || isResetPasswordPending,
      },
    },
    !isUserLoading ? children : null
  );
}

// Custom hook to use auth context with React Query
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const {
    authState,
    login,
    logout,
    updateUser,
    refreshToken,
    isLoading,
    isLoginPending,
    isLogoutPending,
    isRefreshPending,
    refetchUser,
    verifyEmail,
    isVerifyLoading,
    isVerifyError,
    verifyErrorMessage,
    forgotPassword,
    isForgotPasswordPending,
    resetPassword,
    isResetPasswordPending,
  } = context;

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    expiresAt: authState.expires_at,
    role: authState.user?.role,
    login,
    logout,
    updateUser,
    refreshToken,
    isLoading,
    isLoginPending,
    isLogoutPending,
    isRefreshPending,
    refetchUser,
    verifyEmail,
    isVerifyLoading,
    isVerifyError,
    verifyErrorMessage,
    forgotPassword,
    isForgotPasswordPending,
    resetPassword,
    isResetPasswordPending,
  };
}
