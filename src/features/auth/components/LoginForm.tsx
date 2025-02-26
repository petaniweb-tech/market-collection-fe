import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormType } from "../types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "../services/auth.service";

export default function LoginForm() {
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
      // Call the login API
      const response = await authService.login(formData);
      
      // Handle successful login using the login method from useAuth
      login(response);
      
      // Navigate to dashboard
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <Card className="w-full max-w-md p-2 bg-white bg-opacity-50 shadow-lg rounded-2xl">
        <div className="p-5 bg-white rounded-2xl">


        <div className="flex flex-col items-center mb-8 space-y-8">
          {/* Sitemark Logo */}
          <div className="flex items-center space-x-2">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-orange-500"
            >
              <path d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" fill="#FF5C00"/>
              <path d="M12 21.5a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" stroke="#FF5C00" strokeWidth="1.5"/>
              <path d="M12 5v14M5 12h14" stroke="#FF5C00" strokeWidth="1.5"/>
            </svg>
            <span className="text-xl font-bold text-gray-800">Sitemark</span>
          </div>
          
          <div className="w-full space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Selamat datang</h2>
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
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
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
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-end">
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-300 rounded" />
                <Label htmlFor="remember" className="text-sm text-gray-500">Remember me</Label>
              </div> */}
              <Button
                variant="link"
                className="px-0 text-sm font-medium text-blue-600 hover:text-blue-800"
                type="button"
                //TODO: ADD FORGOT PASSWORD PAGE
                // onClick={() => navigate({ to: "/auth/forgot-password" })}
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