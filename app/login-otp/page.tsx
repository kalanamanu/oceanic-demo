"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

const OTP_LENGTH = 6;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function maskEmail(email: string) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return user[0] + "*".repeat(Math.max(user.length - 1, 1)) + "@" + domain;
}

export default function LoginOtpPage() {
  const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check for credentials and redirect if missing
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otp_email");
    const storedPassword = sessionStorage.getItem("otp_password");

    if (!storedEmail || !storedPassword) {
      // No credentials found, redirect to login
      router.push("/login");
      return;
    }

    setEmail(storedEmail);
    setPassword(storedPassword);

    // Auto-focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (
      otpArray.every((val) => val.length === 1) &&
      !isLoading &&
      !hasAutoSubmitted
    ) {
      setHasAutoSubmitted(true);
      handleVerify();
    }
    if (otpArray.some((val) => val.length === 0)) {
      setHasAutoSubmitted(false);
    }
  }, [otpArray, isLoading, hasAutoSubmitted]);

  /**
   * Handle OTP Resend
   */
  const handleResendOtp = async () => {
    if (!email || !password) {
      setError("Session expired. Please login again.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const response = await AuthService.requestOTP({
        email,
        password,
      });

      if (response.success) {
        // Reset timer and OTP input
        setTimeLeft(300);
        setOtpArray(Array(OTP_LENGTH).fill(""));
        setHasAutoSubmitted(false);

        // Focus first input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);

        // Optional: Show success message
        // You can use a toast library here
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Handle OTP Input Change
   */
  const handleOtpChange = (idx: number, value: string) => {
    // Handle paste of full OTP
    if (value.length > 1) {
      const chars = value.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");
      chars.forEach((c, i) => (next[i] = c));
      setOtpArray(next);
      setTimeout(() => {
        inputRefs.current[Math.min(chars.length, OTP_LENGTH) - 1]?.focus();
      }, 20);
      return;
    }

    // Only allow digits
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otpArray];
    updated[idx] = value;
    setOtpArray(updated);

    // Auto-focus next input
    if (value && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  /**
   * Handle Paste Event
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\s+/g, "");
    if (/^[0-9]{6}$/.test(text)) {
      const chars = text.split("");
      setOtpArray(chars);
      setTimeout(() => {
        inputRefs.current[OTP_LENGTH - 1]?.focus();
      }, 20);
      e.preventDefault();
    }
  };

  /**
   * Handle Keyboard Navigation
   */
  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otpArray[idx]) {
        const updated = [...otpArray];
        updated[idx] = "";
        setOtpArray(updated);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === "Tab" && !e.shiftKey && idx < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    }
  };

  /**
   * Handle OTP Verification (Backend Integration)
   */
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setError("");

    const otp = otpArray.join("");

    // Validate OTP length
    if (otp.length !== OTP_LENGTH) {
      setError("Please enter all OTP digits.");
      setIsLoading(false);
      return;
    }

    // Check if time expired
    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new one.");
      setIsLoading(false);
      return;
    }

    try {
      // Call backend to verify OTP
      const response = await AuthService.verifyOTP({
        email,
        otp,
      });

      if (response.success) {
        // User data is already saved in AuthService.verifyOTP
        // Token is in HttpOnly cookie

        // Clear session storage
        sessionStorage.removeItem("otp_email");
        sessionStorage.removeItem("otp_password");

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");

      // Clear OTP input on error
      setOtpArray(Array(OTP_LENGTH).fill(""));
      setHasAutoSubmitted(false);

      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Back to Login
   */
  const handleBack = () => {
    sessionStorage.removeItem("otp_email");
    sessionStorage.removeItem("otp_password");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo (Optional) */}
          <div className="flex justify-center mb-8">
            <img
              src="/oceanic-logo.png"
              alt="Oceanic Maritime Services Logo"
              className="w-48 h-auto object-contain"
              draggable="false"
            />
          </div>

          {/* OTP Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            {/* Header Inside Card */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-2">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                We've sent a 6-digit code to
                <span className="font-semibold text-blue-700 ml-1">
                  {maskEmail(email)}
                </span>
                . Enter it below to continue.
              </p>
            </div>

            {/* OTP Input Section */}
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex justify-center items-center gap-2 mb-2">
                {otpArray.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    autoFocus={idx === 0}
                    disabled={timeLeft === 0 || isLoading}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-10 h-10 text-lg font-bold text-center rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 shadow-sm"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 text-xs">
                  <Shield className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white mt-2 rounded-xl"
                disabled={
                  isLoading || timeLeft <= 0 || otpArray.some((d) => !d)
                }
              >
                {timeLeft <= 0
                  ? "OTP Expired"
                  : isLoading
                    ? "Verifying..."
                    : "Verify & Continue"}
              </Button>

              {/* Timer + Resend */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4 w-full px-1">
                <span>
                  Remaining time:{" "}
                  <span
                    className={`font-semibold ${timeLeft <= 60 ? "text-red-600" : "text-blue-700"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </span>
                <span>
                  Didn't get the code?{" "}
                  <button
                    type="button"
                    className="text-blue-700 font-semibold hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isResending || isLoading}
                    onClick={handleResendOtp}
                    tabIndex={0}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    {isResending ? "Resending..." : "Resend"}
                  </button>
                </span>
              </div>

              {/* Back to Login */}
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 mt-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              {/* Security Note */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  For security, this code expires in 5 minutes
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
