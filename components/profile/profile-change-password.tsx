"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, Check, X, KeyRound } from "lucide-react";
import { ProfileService } from "@/services/profile.service";

/* =========================
   MAIN COMPONENT
========================= */
export default function ProfileChangePasswordDialog() {
  const [open, setOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* =========================
     VALIDATION
  ========================= */
  const rules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const allValid = Object.values(rules).every(Boolean) && passwordsMatch;

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allValid) {
      toast.error("Please fix password requirements");
      return;
    }

    setLoading(true);

    try {
      await ProfileService.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <KeyRound className="w-4 h-4" />
          Change Password
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* CURRENT PASSWORD */}
          <PasswordField
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            show={showCurrent}
            setShow={setShowCurrent}
          />

          {/* NEW PASSWORD */}
          <PasswordField
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            show={showNew}
            setShow={setShowNew}
          />

          {/* CONFIRM PASSWORD */}
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
          />

          {/* RULE BOX */}
          <div className="border rounded-lg p-3 space-y-1 bg-muted/30">
            <Rule ok={rules.length}>At least 8 characters</Rule>
            <Rule ok={rules.upper}>One uppercase letter</Rule>
            <Rule ok={rules.lower}>One lowercase letter</Rule>
            <Rule ok={rules.number}>One number</Rule>
            <Rule ok={passwordsMatch}>Passwords match</Rule>
          </div>

          {/* ACTION */}
          <Button className="w-full" disabled={loading || !allValid}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   PASSWORD FIELD
========================= */
function PasswordField({
  label,
  value,
  setValue,
  show,
  setShow,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/* =========================
   RULE COMPONENT
========================= */
function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
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
