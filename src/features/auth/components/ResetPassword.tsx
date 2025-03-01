/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Define Zod schema for form validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .regex(/[A-Z]/, {
        message: "Password harus mengandung setidaknya satu huruf kapital",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Konfirmasi password harus diisi" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

// Infer TypeScript type from Zod schema
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const search = useSearch({ from: "/reset-password" });
  const token = (search as { token?: string }).token || "";

  const { resetPassword, isResetPasswordPending } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Check if token exists when component mounts
  useEffect(() => {
    if (!token) {
      setTokenError("Token reset password tidak ditemukan");
    }
  }, [token]);

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast({
        title: "Token tidak valid",
        description: "Token reset password tidak ditemukan",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call resetPassword from useAuth hook
      await resetPassword(token, values.password, values.confirmPassword);

      // If we get here, the request was successful
      toast({
        title: "Password berhasil diubah",
        description: "Silahkan login dengan password baru Anda",
      });

      // Navigate to login page
      navigate({ to: "/login" });
    } catch (error: any) {
      toast({
        title: "Gagal mengubah password",
        description:
          error?.message || "Terjadi kesalahan saat mengubah password",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    navigate({ to: "/login" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // If there's a token error, show error message
  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-sm rounded-xl">
          <h1 className="mb-4 text-xl font-semibold text-red-600">
            Link Reset Password Tidak Valid
          </h1>
          <p className="mb-6 text-[#909090]">{tokenError}</p>
          <Button
            onClick={handleGoBack}
            className="px-6 py-3 text-white transition-opacity rounded-full bg-gradient-to-b from-[#FE8300] to-[#ED3400] hover:opacity-90"
          >
            Kembali ke Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:flex lg:items-center lg:justify-center bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 lg:hidden">
        <button
          onClick={handleGoBack}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="px-6 py-2 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-center">
            Atur ulang password
          </h2>
        </div>
        <div className="w-9"></div> {/* Empty div for spacing */}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        <h1 className="mb-2 text-2xl font-semibold">Atur ulang password</h1>
        <p className="mb-6 text-[#909090]">
          Silahkan atur ulang password baru anda
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password baru"
                        className="w-full p-4 pr-10 bg-white border rounded-lg"
                        disabled={isResetPasswordPending}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi password baru"
                        className="w-full p-4 pr-10 bg-white border rounded-lg"
                        disabled={isResetPasswordPending}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isResetPasswordPending}
              className="w-full py-6 text-white transition-opacity rounded-full bg-gradient-to-b from-[#FE8300] to-[#ED3400] hover:opacity-90"
            >
              {isResetPasswordPending ? "Memproses..." : "Atur ulang password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
