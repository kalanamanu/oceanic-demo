"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Loader2,
  UserCheck,
} from "lucide-react";

import { VendorService } from "@/services/vendor.service";
import apiClient from "@/lib/api-client";

import { toast } from "sonner";

interface Props {
  vendorId: string;

  status: {
    is_manager_approved: boolean;
    is_md_approved: boolean;
    status?: string;
  };

  onRefresh?: () => void;
}

export function VendorApprovalCard({ vendorId, status, onRefresh }: Props) {
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  /* ================= LOAD USER ================= */

  React.useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const res = await apiClient.get("/api/auth/me");

      setRole(res.data.user?.role || "");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ROLE CHECKS ================= */

  const canManagerApprove = role === "Manager" || role === "System Developer";

  const canMDApprove =
    role === "MD" ||
    role === "Managing Director" ||
    role === "System Developer";

  /* ================= APPROVAL ACTION ================= */

  const updateApproval = async (
    managerApproved: boolean,
    mdApproved: boolean,
    successMessage: string,
  ) => {
    try {
      setLoading(true);

      await VendorService.updateVendorStatus(vendorId, {
        is_manager_approved: managerApproved,
        is_md_approved: mdApproved,
      });

      toast.success(successMessage);

      onRefresh?.();
    } catch (err: any) {
      console.error(err);

      toast.error(err?.message || "Failed to update approval");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS HELPERS ================= */

  const fullyApproved = status?.is_manager_approved && status?.is_md_approved;

  const currentStatus = status?.status || "Pending Approval";

  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Approval Workflow
          </CardTitle>

          <Badge
            variant={fullyApproved ? "default" : "secondary"}
            className="capitalize"
          >
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ================= MANAGER ================= */}

        <ApprovalSection
          title="Manager Approval"
          description="First approval stage"
          approved={status?.is_manager_approved}
        >
          {!status?.is_manager_approved && canManagerApprove && (
            <Button
              size="sm"
              className="w-full"
              disabled={loading}
              onClick={() =>
                updateApproval(
                  true,
                  status?.is_md_approved || false,
                  "Vendor approved by Manager",
                )
              }
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              Approve as Manager
            </Button>
          )}
        </ApprovalSection>

        <Separator />

        {/* ================= MD ================= */}

        <ApprovalSection
          title="MD Approval"
          description="Final approval stage"
          approved={status?.is_md_approved}
        >
          {status?.is_manager_approved &&
            !status?.is_md_approved &&
            canMDApprove && (
              <Button
                size="sm"
                className="w-full"
                disabled={loading}
                onClick={() =>
                  updateApproval(true, true, "Vendor approved by MD")
                }
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Approve as MD
              </Button>
            )}
        </ApprovalSection>

        {/* ================= FINAL SUCCESS ================= */}

        {fullyApproved && (
          <>
            <Separator />

            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />

                <div>
                  <p className="font-medium text-sm">Vendor Fully Approved</p>

                  <p className="text-xs text-muted-foreground">
                    Approval workflow completed successfully.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ========================================================= */

interface ApprovalSectionProps {
  title: string;
  description: string;
  approved: boolean;
  children?: React.ReactNode;
}

function ApprovalSection({
  title,
  description,
  approved,
  children,
}: ApprovalSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{title}</p>

          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <Badge variant={approved ? "default" : "secondary"} className="gap-1">
          {approved ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Approved
            </>
          ) : (
            <>
              <Clock3 className="w-3 h-3" />
              Pending
            </>
          )}
        </Badge>
      </div>

      {children}
    </div>
  );
}
