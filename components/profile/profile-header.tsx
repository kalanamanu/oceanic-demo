"use client";

import { User } from "@/types/user.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Card className="overflow-hidden">
      {/* Background */}
      <div className="relative h-40 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background">
        {user.profile?.backgroundImage_id ? (
          <img
            src={user.profile.backgroundImage_id}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6 -mt-12 flex items-end justify-between">
        <div className="flex items-end gap-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-background bg-muted overflow-hidden shadow-md">
            {user.profile?.profilePicture_id ? (
              <img
                src={user.profile.profilePicture_id}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold">{fullName}</h2>

            <p className="text-sm text-muted-foreground">{user.email}</p>

            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{user.accountType}</Badge>

              <Badge variant="outline">{user.role}</Badge>

              <Badge variant="outline">{user.department}</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
