import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormType } from "../types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "../services/auth.service";
import LogoIcon from "@/assets/icon/ic_union.svg";
import { usePermissions } from "@/hooks/usePermission";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (isAuthenticated) {
      // Get user from localStorage to ensure we have the latest data
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          navigateBasedOnRole(userData.role);
        } catch (e) {
          console.error("Error parsing user data:", e);
          navigate({ to: "/dashboard" }); // Fallback
        }
      } else {
        navigate({ to: "/dashboard" }); // Fallback if no user data
      }
    }
  }, [isAuthenticated, navigate]);

  // Function to navigate based on user role
  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
        navigate({ to: "/dashboard" });
        break;
      case "collector":
        navigate({ to: "/collector" });
        break;
      case "manager":
        navigate({ to: "/manajer" });
        break;
      case "supervisor":
        navigate({ to: "/dashboard" }); // Adjust as needed
        break;
      default:
        navigate({ to: "/dashboard" }); // Default fallback
    }
  };

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
      // Call the login API
      const response = await authService.login(formData);

      // Handle successful login using the login method from useAuth
      login(response);

      // Navigate based on role from the response
      navigateBasedOnRole(response.user.role);
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
    <div className="flex items-center justify-center h-full min-h-screen bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <Card className="w-full max-w-md p-2 mx-4 my-4 bg-white bg-opacity-50 shadow-lg rounded-2xl sm:my-0">
        <div className="p-5 bg-white rounded-2xl">
          <div className="flex flex-col items-center mb-8 space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={LogoIcon} alt="Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-800">
                Disperindag
              </span>
            </div>

            <div className="w-full space-y-1 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Selamat datang
              </h2>
              <p className="text-gray-500">
                Silahkan masukkan email dan password untuk masuk
              </p>
            </div>
          </div>

          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-lg">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  id="username"
                  type="text"
                  {...register("username")}
                  placeholder="Masukkan Nomor HP / Email"
                  className={`rounded-xl h-14 px-4 ${errors.username ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Masukkan password"
                    className={`rounded-xl h-14 px-4 ${errors.password ? "border-red-500 pr-12" : "border-gray-200 pr-12"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Button
                  variant="link"
                  className="px-0 text-sm font-medium text-blue-600 hover:text-blue-800"
                  type="button"
                  onClick={() => navigate({ to: "/lupa-password" })}
                >
                  Lupa password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}