"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";

import { User } from "@/types/user.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { UploadService } from "@/services/upload.service";
import { UserService } from "@/services/user.service";

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

  /**
   * Load signed URLs for existing uploads
   */
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

  /**
   * Upload Avatar
   */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingAvatar(true);

      const upload = await UploadService.uploadFile({
        file,
        useFor: `${user.firstName.toLowerCase()}_avatar`,
      });

      await UserService.updateUser({
        id: user.id,
        profilePicture_id: String(upload.id),
      });

      setAvatarUrl(upload.file_url);

      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  /**
   * Upload Background
   */
  const handleBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingBackground(true);

      const upload = await UploadService.uploadFile({
        file,
        useFor: `${user.firstName.toLowerCase()}_background`,
      });

      await UserService.updateUser({
        id: user.id,
        backgroundImage_id: String(upload.id),
      });

      setBackgroundUrl(upload.file_url);

      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to upload background image");
    } finally {
      setUploadingBackground(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Hidden Inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBackgroundUpload}
      />

      {/* Background Section */}
      <div className="relative h-52 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/20" />

        {/* Background Upload Button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 z-10"
          disabled={uploadingBackground}
          onClick={() => backgroundInputRef.current?.click()}
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

      {/* Profile Content */}
      <div className="relative px-6 pb-6 -mt-12 flex items-end justify-between">
        <div className="flex items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-background bg-muted overflow-hidden shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
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

            {/* Avatar Upload */}
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              disabled={uploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* User Info */}
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
      </div>
    </Card>
  );
}
