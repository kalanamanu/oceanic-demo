"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api-client";

import { Eye, EyeOff, Check, X } from "lucide-react";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  React.useEffect(() => {
    if (!email || !token) {
      router.replace("/login");
    }
  }, [email, token, router]);

  /* =========================
     PASSWORD RULES
  ========================= */
  const rules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const allValid = Object.values(rules).every(Boolean);
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const canSubmit = allValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Please fix password requirements");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/api/profile/reset-password", {
        email,
        token,
        newPassword,
      });

      toast.success("Password reset successful");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-xl p-6 bg-card">
        <h1 className="text-xl font-semibold mb-4">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PASSWORD FIELD */}
          <div className="space-y-2">
            <Label>New Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="space-y-2">
            <Label>Confirm Password</Label>

            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* PASSWORD RULE BOX */}
          <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground">
              Password must contain:
            </p>

            <RuleItem ok={rules.length}>At least 8 characters</RuleItem>
            <RuleItem ok={rules.upper}>One uppercase letter</RuleItem>
            <RuleItem ok={rules.lower}>One lowercase letter</RuleItem>
            <RuleItem ok={rules.number}>One number</RuleItem>

            {/* MATCH RULE */}
            <RuleItem ok={passwordsMatch}>Passwords must match</RuleItem>
          </div>

          <Button className="w-full" disabled={loading || !canSubmit}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   RULE ITEM COMPONENT
========================= */
function RuleItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {ok ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <X className="w-3 h-3 text-red-400" />
      )}
      <span className={ok ? "text-green-600" : "text-muted-foreground"}>
        {children}
      </span>
    </div>
  );
}
