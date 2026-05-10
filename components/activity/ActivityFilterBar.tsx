"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ActivityFilterBar({
  selectedUser,
  setSelectedUser,
}: {
  selectedUser: string;
  setSelectedUser: (val: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      {/* SEARCH */}
      <Input
        placeholder="Search by User ID or Username..."
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full"
      />

      {/* CLEAR */}
      <Button
        variant="outline"
        onClick={() => setSelectedUser("")}
        className="w-full md:w-auto"
      >
        Clear
      </Button>
    </div>
  );
}
