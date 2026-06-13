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
  XCircle,
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

  const canManagerApprove =
    role === "Purchasing - Manager" || role === "System Developer";

  const canMDApprove = role === "MD" || role === "System Developer";

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

      toast.error(err?.message || "Failed to update vendor status");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS HELPERS ================= */

  const fullyApproved = status?.is_manager_approved && status?.is_md_approved;

  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: React.ReactNode;
    }
  > = {
    "Pending Approval": {
      label: "Pending Approval",
      variant: "secondary",
      icon: <Clock3 className="w-3 h-3" />,
    },

    "Manager Approved": {
      label: "Manager Approved",
      variant: "outline",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },

    "Manager Rejected": {
      label: "Manager Rejected",
      variant: "destructive",
      icon: <XCircle className="w-3 h-3" />,
    },

    "MD Approved": {
      label: "MD Approved",
      variant: "outline",
      icon: <ShieldCheck className="w-3 h-3" />,
    },

    "MD Rejected": {
      label: "MD Rejected",
      variant: "destructive",
      icon: <XCircle className="w-3 h-3" />,
    },

    Approved: {
      label: "Approved",
      variant: "default",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },

    Rejected: {
      label: "Rejected",
      variant: "destructive",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const currentStatus = statusConfig[status?.status || "Pending Approval"];

  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Approval Workflow
          </CardTitle>

          <Badge variant={currentStatus.variant} className="capitalize gap-1">
            {currentStatus.icon}
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ================= MANAGER ================= */}

        <ApprovalSection
          title="Purchasing Manager Approval"
          description="First approval stage"
          approved={status?.is_manager_approved}
        >
          {!status?.is_manager_approved && canManagerApprove && (
            <div className="flex gap-2">
              {/* APPROVE */}
              <Button
                size="sm"
                className="flex-1"
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
                Approve
              </Button>

              {/* REJECT */}
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                disabled={loading}
                onClick={() =>
                  updateApproval(false, false, "Vendor rejected by Manager")
                }
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
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
              <div className="flex gap-2">
                {/* APPROVE */}
                <Button
                  size="sm"
                  className="flex-1"
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
                  Approve
                </Button>

                {/* REJECT */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  disabled={loading}
                  onClick={() =>
                    updateApproval(false, false, "Vendor rejected by MD")
                  }
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
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
