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

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otp_email");
    const storedPassword = sessionStorage.getItem("otp_password");

    if (!storedEmail || !storedPassword) {
      router.push("/login");
      return;
    }

    setEmail(storedEmail);
    setPassword(storedPassword);

    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
        setTimeLeft(300);
        setOtpArray(Array(OTP_LENGTH).fill(""));
        setHasAutoSubmitted(false);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);

        toast.success("A new verification code was sent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
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

    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otpArray];
    updated[idx] = value;
    setOtpArray(updated);

    if (value && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

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

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setError("");

    const otp = otpArray.join("");

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter all OTP digits.");
      setIsLoading(false);
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new one.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.verifyOTP({
        email,
        otp,
      });

      if (response.success) {
        sessionStorage.removeItem("otp_email");
        sessionStorage.removeItem("otp_password");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtpArray(Array(OTP_LENGTH).fill(""));
      setHasAutoSubmitted(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("otp_email");
    sessionStorage.removeItem("otp_password");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-br from-background via-background to-secondary/40">
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/oceanic-logo.png"
              alt="Oceanic Maritime Services Logo"
              className="w-48 h-auto object-contain"
              draggable="false"
            />
          </div>

          {/* OTP Card */}
          <div className="rounded-2xl shadow-lg border border-border bg-card/90 backdrop-blur p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>

              <h2 className="text-xl font-semibold text-foreground">
                Enter Verification Code
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ve sent a 6-digit code to
                <span className="font-semibold text-primary ml-1">
                  {maskEmail(email)}
                </span>
                . Enter it below to continue.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              {/* OTP Inputs */}
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={[
                      "w-10 h-10 text-lg font-bold text-center rounded-xl border-2 shadow-sm",
                      "bg-background text-foreground",
                      "border-input",
                      "hover:bg-muted/40",
                      "focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:border-ring",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      "transition-all",
                    ].join(" ")}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 text-xs border border-destructive/25 bg-destructive/10 text-destructive">
                  <Shield className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
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
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 w-full px-1">
                <span>
                  Remaining time:{" "}
                  <span
                    className={[
                      "font-semibold",
                      timeLeft <= 60 ? "text-destructive" : "text-primary",
                    ].join(" ")}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </span>

                <span>
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 mt-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              {/* Security Note */}
              <div className="mt-4 pt-4 border-t border-border/60 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
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
