/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordConfirmationProps {
  // Optional props if needed
}

const ResetPasswordConfirmation: React.FC<ResetPasswordConfirmationProps> = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get email from URL params if available
  const search = useSearch({ from: "/collector/reset-password-confirmation" });
  const email = (search as { email?: string }).email || "johndoe@gmail.com";
  
  const handleResendEmail = async () => {
    try {
      // Implement your resend email logic here
      // await authService.requestPasswordReset(email);
      
      toast({
        title: "Email terkirim ulang",
        description: "Silahkan periksa email Anda untuk reset password",
      });
    } catch (error: any) {
      toast({
        title: "Gagal mengirim ulang email",
        description: error?.message || "Terjadi kesalahan saat mengirim ulang email",
        variant: "destructive",
      });
    }
  };
  
  const handleGoToLogin = () => {
    navigate({ to: "/collector/login" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Email Icon */}
      <div className="p-4 mb-6 shadow-md rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
        <Mail className="w-10 h-10 text-white" />
      </div>
      
      {/* Main Content */}
      <div className="text-center">
        <h1 className="mb-2 text-xl font-semibold">Cek email anda</h1>
        
        <p className="max-w-xs mx-auto mb-6 text-gray-600">
          Tautan telah dikirimkan ke <span className="font-medium">{email}</span> untuk 
          mengatur ulang password anda. Pastikan untuk memeriksa Spam jika email tidak masuk.
        </p>
        
        <div className="flex items-center justify-center text-sm">
          <span className="text-gray-500">Tidak menerima email?</span>
          <button 
            onClick={handleResendEmail}
            className="ml-1 text-orange-500 hover:text-orange-600 focus:outline-none"
          >
            Kirim ulang email
          </button>
        </div>
      </div>
      
      {/* Hidden back to login button, can be shown if needed */}
      <Button
        variant="ghost"
        onClick={handleGoToLogin}
        className="mt-8 text-gray-500 hover:text-gray-700"
      >
        Kembali ke login
      </Button>
    </div>
  );
};

export default ResetPasswordConfirmation;