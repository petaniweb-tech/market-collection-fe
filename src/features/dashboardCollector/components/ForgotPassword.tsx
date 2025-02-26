/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
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
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Email tidak valid" }),
});

// Infer TypeScript type from Zod schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      // Replace this with your actual API call
      // await authService.requestPasswordReset(values.email);
      
      // Show success toast
      toast({
        title: "Email terkirim",
        description: "Silahkan periksa email Anda untuk reset password",
      });
      
      // Navigate to confirmation page
      navigate({ 
        to: "/collector/reset-password-confirmation",
        search: { email: values.email } 
      });
    } catch (error: any) {
      toast({
        title: "Gagal mengirim email reset",
        description: error?.message || "Terjadi kesalahan saat mengirim email reset",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleGoBack}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="px-6 py-2 bg-white rounded-full shadow-sm">
          <h2 className="text-sm font-medium text-center">Lupa password</h2>
        </div>
        <div className="w-9"></div> {/* Empty div for spacing */}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        <h1 className="mb-2 text-2xl font-semibold">Lupa password</h1>
        <p className="mb-6 text-gray-500">
          Silahkan masukkan email untuk menerima tautan untuk
          mengatur ulang password anda
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@gmail.com"
                      className="w-full p-4 bg-white border-none rounded-lg"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-white transition-opacity rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            >
              {isSubmitting ? "Mengirim..." : "Konfirmasi"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;