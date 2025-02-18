import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormType } from "../types/auth.types";
// import { authService } from "../services/auth.service";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize React Hook Form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const onSubmit = async (formData: LoginFormType) => {
  
    setIsLoading(true);
    try {
      // Call the login API
      // const response = await authService.login(formData);

      // Handle successful login
      //   localStorage.setItem('token', response.token);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Set isLoggedIn to true after a short delay
      console.log("Login successful:", formData);

      // Redirect or handle further actions
      if(isAuthenticated) {
        setIsLoggedIn(true);
        navigate({
          to: "/home",
        });
      }
 
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate({
        to: "/home",
      });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">SIKAP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistem Informasi Keuangan Pasar
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 text-start"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                pattern="[0-9]*"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  validate: (value) => {
                    const isValid = /^\d{10,15}$/.test(value);
                    if (!isValid) {
                      return "Phone number must be between 10 and 15 digits and contain only numbers";
                    }
                    return true;
                  },
                })}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-start"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-600 top-1"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
