import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormType } from "../types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "../services/auth.service";

export default function LoginMobileForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // Initialize React Hook Form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginFormType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API with username/password
      const response = await authService.login(formData);

      // Handle successful login using the login method from useAuth
      login(response);

      // Navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col w-full h-full bg-gradient-to-r from-[#ED3400] to-[#FE8300]">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex items-center mb-12 space-x-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
              fill="#FFFFFF"
            />
            <path
              d="M12 21.5a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
          <span className="text-xl font-semibold">Sitemark</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold md:text-4xl">Halo,</h1>
          <h2 className="text-3xl font-bold md:text-4xl">selamat datang!</h2>
          <p className="mt-2 text-sm opacity-90">
            Silahkan masukkan email dan password untuk masuk
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex flex-col flex-1 px-6 py-8 mt-4 bg-white rounded-t-3xl">
        <h3 className="mb-6 text-xl font-bold text-gray-800">Masuk</h3>

        {error && (
          <Alert variant="destructive" className="mb-6 rounded-lg">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 space-y-5"
        >
          <div className="space-y-1">
            <Input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Nomor HP / Email"
              className={`border h-12 rounded-lg ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Masukkan password"
                className={`border h-12 rounded-lg pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600"
              onClick={() => navigate({ to: "/lupa-password" })}
            >
              Lupa password?
            </button>
          </div>

          <div className="pt-10 mt-auto">
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Masuk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
