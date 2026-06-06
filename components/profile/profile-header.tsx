"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";

import { User } from "@/types/user.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { UploadService } from "@/services/upload.service";
import { UserService } from "@/services/user.service";

// Dialog
import ProfileChangePasswordDialog from "@/components/profile/profile-change-password";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = React.useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [uploadingBackground, setUploadingBackground] = React.useState(false);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const backgroundInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const loadImages = async () => {
      try {
        if (user.profile?.profilePicture_id) {
          const avatar = await UploadService.getFileUrl(
            Number(user.profile.profilePicture_id),
          );
          setAvatarUrl(avatar);
        }

        if (user.profile?.backgroundImage_id) {
          const bg = await UploadService.getFileUrl(
            Number(user.profile.backgroundImage_id),
          );
          setBackgroundUrl(bg);
        }
      } catch (error) {
        console.error("Failed loading profile images", error);
      }
    };

    loadImages();
  }, [user]);

  // Handler to trigger the hidden background input click
  const handleBackgroundButtonClick = () => {
    backgroundInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      {/* Hidden Inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {/* FIXED: Added className="hidden" here */}
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {/* BACKGROUND */}
      <div className="relative h-52 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            className="absolute inset-0 w-full h-full object-cover"
            alt="bg"
          />
        )}

        <div className="absolute inset-0 bg-black/20" />

        {/* FIXED: Added onClick handler here */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 z-10"
          disabled={uploadingBackground}
          onClick={handleBackgroundButtonClick}
        >
          {uploadingBackground ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Change Background
            </>
          )}
        </Button>
      </div>

      {/* PROFILE CONTENT */}
      <div className="relative px-6 pb-6 -mt-12 flex items-end justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-background bg-muted overflow-hidden shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>
              )}
            </div>

            {/* Note: You will want to apply a similar onClick handler here for avatarInputRef.current?.click() */}
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* NAME + INFO */}
          <div className="mb-2">
            <h2 className="text-2xl font-semibold">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{user.accountType}</Badge>
              <Badge variant="outline">{user.role}</Badge>
              <Badge variant="outline">{user.department}</Badge>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (ACTION BUTTONS) */}
        <div className="flex items-center gap-2 self-start mt-2">
          <ProfileChangePasswordDialog />
        </div>
      </div>
    </Card>
  );
}
