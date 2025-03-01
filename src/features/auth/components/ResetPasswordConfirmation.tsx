/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import EmailSquare from "@/assets/icon/ic_email_square.svg";
import { useAuth } from "../hooks/useAuth";

interface ResetPasswordConfirmationProps {
  // Optional props if needed
}

const ResetPasswordConfirmation: React.FC<
  ResetPasswordConfirmationProps
> = () => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number>(60); // 60 seconds = 1 minute
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const { forgotPassword } = useAuth();

  // Get email from URL params if available
  const search = useSearch({ from: "/reset-password-confirmation" });
  const email = (search as { email?: string }).email || "johndoe@gmail.com";

  useEffect(() => {
    // Set up countdown timer
    let timer: NodeJS.Timeout | undefined;

    if (isResendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    // Clean up timer on component unmount
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isResendDisabled, countdown]);

  const handleResendEmail = async () => {
    try {
      // Implement your resend email logic here
      await forgotPassword(email);

      toast({
        title: "Email terkirim ulang",
        description: "Silahkan periksa email Anda untuk reset password",
      });

      // Reset the countdown and disable the button again
      setCountdown(60);
      setIsResendDisabled(true);
    } catch (error: any) {
      toast({
        title: "Gagal mengirim ulang email",
        description:
          error?.message || "Terjadi kesalahan saat mengirim ulang email",
        variant: "destructive",
      });
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Email Icon */}
      <img src={EmailSquare} alt="Profile" className="mb-6" />

      {/* Main Content */}
      <div className="text-center">
        <h1 className="mb-2 text-xl font-semibold">Cek email anda</h1>

        <p className="max-w-xs mx-auto mb-6 text-[#909090]">
          Tautan telah dikirimkan ke{" "}
          <span className="font-medium text-[#222222]">{email}</span> untuk
          mengatur ulang password anda. Pastikan untuk memeriksa Spam jika email
          tidak masuk.
        </p>

        <div className="flex items-center justify-center text-sm">
          <span className="text-[#909090]">Tidak menerima email?</span>
          {isResendDisabled ? (
            <span className="ml-1 text-gray-400">
              Kirim ulang email ({formatTime(countdown)})
            </span>
          ) : (
            <button
              onClick={handleResendEmail}
              className="ml-1 text-[#085EC5] hover:text-orange-600 focus:outline-none"
            >
              Kirim ulang email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmation;
