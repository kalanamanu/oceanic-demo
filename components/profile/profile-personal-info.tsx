"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone_number?: string;
  dob?: string;

  onChange: (
    field: "firstName" | "lastName" | "email" | "phone_number" | "dob",
    value: string,
  ) => void;
}

export default function ProfilePersonalInfo({
  firstName,
  lastName,
  email,
  phone_number,
  dob,
  onChange,
}: ProfilePersonalInfoProps) {
  const formattedDob = dob ? new Date(dob).toISOString().split("T")[0] : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>

            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>

            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>

            <Input
              id="phone_number"
              value={phone_number || ""}
              placeholder="+94 77 123 4567"
              onChange={(e) => onChange("phone_number", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>

            <Input
              id="dob"
              type="date"
              value={formattedDob}
              onChange={(e) => onChange("dob", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
