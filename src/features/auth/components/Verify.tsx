/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import LogoIcon from "@/assets/icon/ic_union.svg";
import successAnimation from "@/assets/lotties/lottie_success.json";
import lottie from "lottie-web";

const Verify = () => {
  const navigate = useNavigate();
  // Get the token from URL parameters directly
  const token = new URLSearchParams(window.location.search).get("token");
  const animationContainer = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const verificationAttempted = useRef(false);

  const { verifyEmail, isVerifyLoading, isVerifyError, verifyErrorMessage } =
    useAuth();

  useEffect(() => {
    let animationInstance: any = null;
    let animationFrame: ReturnType<typeof setTimeout>;

    // Only run verification once
    if (token && !verificationAttempted.current) {
      const verifyUserEmail = async () => {
        try {
          verificationAttempted.current = true;
          setStatus("loading");

          // Call the verifyEmail function
          try {
            const response = await verifyEmail(token);
            setStatus("success");
            setMessage(response?.message || "Email verified successfully");
          } catch (error) {
            // Special handling for 204 status (No Content) - treat as success
            if (error?.response?.status === 204) {
              setStatus("success");
              setMessage("Email verified successfully");
            } else {
              throw error;
            }
          }
        } catch (error) {
          setStatus("error");
          setMessage("Email verifikasi gagal, Silahkan hubungi admin");
        }
      };

      verifyUserEmail();
    } else if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
    }

    // Load success animation if status is success
    if (status === "success" && animationContainer.current) {
      // Load Lottie animation
      animationInstance = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: successAnimation,
      });

      animationFrame = setTimeout(() => {
        if (animationContainer.current) {
          const svg = animationContainer.current.querySelector("svg");
          if (svg) {
            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.style.borderRadius = "50%";
            svg.style.overflow = "hidden";

            const backgroundElements = svg.querySelectorAll(
              'rect[fill="rgb(255,255,255)"], rect[fill="#FFFFFF"], rect[fill="#ffffff"]'
            );
            backgroundElements.forEach((el) => {
              el.parentNode?.removeChild(el);
            });
          }
        }
      }, 100);
    }

    return () => {
      if (animationFrame) {
        clearTimeout(animationFrame);
      }
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, [token, verifyEmail, status]);

  const redirectToLogin = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 mx-4 my-4 bg-white shadow-md rounded-2xl sm:my-0">
        <div className="flex flex-col items-center mb-8 space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center w-full pt-4">
            <img src={LogoIcon} alt="Logo" className="h-8" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              Disperindag
            </span>
          </div>

          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {(status === "loading" || isVerifyLoading) && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                <p className="text-lg">Memverifikasi email kamu...</p>
              </div>
            )}

            {(status === "error" || isVerifyError) && status !== "success" && (
              <div className="flex flex-col items-center gap-3">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <p className="text-lg font-medium text-red-500">
                  Verifikasi gagal
                </p>
                <p className="text-sm text-gray-500">
                  {message ||
                    verifyErrorMessage ||
                    "Unable to verify your email address"}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-6">
                <div
                  ref={animationContainer}
                  className="flex items-center justify-center w-24 h-24 overflow-hidden bg-orange-500 rounded-full"
                ></div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Email berhasil diverifikasi
                  </h2>
                  <p className="text-gray-500">
                    Email Anda telah berhasil diverifikasi! Sekarang Anda dapat
                    melanjutkan proses login
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center w-full">
            <Button
              size="lg"
              onClick={redirectToLogin}
              className="w-full py-2 text-white transition-opacity rounded-full bg-gradient-to-b from-orange-500 to-red-500 hover:opacity-90"
            >
              Masuk
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default Verify;
