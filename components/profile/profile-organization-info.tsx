"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileOrganizationInfoProps {
  role?: string;
  department?: string;
  accountType?: string;
}

export default function ProfileOrganizationInfo({
  role,
  department,
  accountType,
}: ProfileOrganizationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={role || ""} disabled />
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Input value={department || ""} disabled />
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <Input value={accountType || ""} disabled />
        </div>
      </CardContent>
    </Card>
  );
}
