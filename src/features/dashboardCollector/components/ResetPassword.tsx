/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";

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
    password: z.string().min(8, { message: "Password minimal 8 karakter" }),
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
  const search = useSearch({ from: "/collector/reset-password" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      // Here you would call your API to reset the password
      // For example: await authService.resetPassword(values.password, search.token);

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

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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
                        className="w-full p-4 pr-10 bg-white border-none rounded-lg"
                        disabled={isSubmitting}
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
                        className="w-full p-4 pr-10 bg-white border-none rounded-lg"
                        disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full py-6 text-white transition-opacity rounded-full bg-gradient-to-b from-[#FE8300] to-[#ED3400] hover:opacity-90"
            >
              {isSubmitting ? "Memproses..." : "Atur ulang password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
