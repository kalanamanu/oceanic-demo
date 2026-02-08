"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Building, Shield, KeyRound, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "user@company.com" && password === "SecurePass123") {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Logo & Company Name - Outside Card */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-blue-600/10">
            <Building className="size-8 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              OCEANIC MARITIME SERVICES (PVT) LTD
            </h1>
            <p className="text-sm text-gray-600">Internal System</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          {/* Header Inside Card */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Login to Your Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Access the company's internal systems and resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Company Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 pl-10 pr-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <Lock className="size-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Login...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </Button>

            {/* Security Note */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="size-3" />
                <span>Secure connection • All data is encrypted</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-3">
          <div className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact IT Support
            </a>
          </div>
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} CompanyPortal v2.4 • Internal Use Only
          </div>
        </div>
      </div>
    </div>
  );
}
