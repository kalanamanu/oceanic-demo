"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, KeyRound, Lock } from "lucide-react";
import { AuthService } from "@/services/auth.service";

export default function LoginPage() {
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

    try {
      const response = await AuthService.requestOTP({
        email,
        password,
      });

      if (response.success) {
        sessionStorage.setItem("otp_email", email);
        sessionStorage.setItem("otp_password", password);
        router.push("/login-otp");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-br from-background via-background to-secondary/40">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img
              src="/oceanic-logo.png"
              alt="Oceanic Maritime Services Logo"
              className="w-64 h-auto object-contain"
              draggable="false"
            />
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card/90 backdrop-blur shadow-lg p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Login to Your Account
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Access the company&apos;s internal systems and resources
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
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
                    className={[
                      "h-12 pl-10",
                      "bg-background text-foreground placeholder:text-muted-foreground",
                      "border-input",
                      "focus-visible:ring-ring/30 focus-visible:ring-4",
                      "transition-all",
                    ].join(" ")}
                  />

                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>

                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
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
                    className={[
                      "h-12 pl-10 pr-10",
                      "bg-background text-foreground placeholder:text-muted-foreground",
                      "border-input",
                      "focus-visible:ring-ring/30 focus-visible:ring-4",
                      "transition-all",
                    ].join(" ")}
                  />

                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <KeyRound className="w-5 h-5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 text-sm rounded-lg flex items-center gap-2 border border-destructive/25 bg-destructive/10 text-destructive">
                      <Lock className="size-4" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"
                    />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>

              {/* Security Note */}
              <div className="pt-6 border-t border-border/60">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="size-3.5" />
                  <span>Secure connection • All data is encrypted</span>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
