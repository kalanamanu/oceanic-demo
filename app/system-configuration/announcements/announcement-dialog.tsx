"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Loader2, Megaphone } from "lucide-react";

import { NotificationService } from "@/services/notification.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  onCreated?: () => void;
}

export function AnnouncementDialog({ onCreated }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [headline, setHeadline] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!headline.trim() || !description.trim()) {
      toast.error("Please fill out all mandatory communication parameters.");
      return;
    }

    try {
      setLoading(true);

      await NotificationService.createNotification({
        notificationHeadline: headline.trim(),
        notificationDescription: description.trim(),
        notificationType: "ANNOUNCEMENT",
      });

      toast.success("Broadcast notice compiled and distributed successfully");

      // Clear fields and drop state
      setHeadline("");
      setDescription("");
      setOpen(false);

      onCreated?.();
    } catch (err: any) {
      console.error("Broadcast generation failure:", err);
      toast.error(
        err.message || "Failed to commit system broadsheet announcement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs font-medium h-9 shadow-sm gap-1.5">
          <Plus className="h-4 w-4" />
          Create Announcement
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] gap-0 antialiased">
        <DialogHeader className="pb-4 border-b border-border/60">
          <DialogTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
            Publish Broadcast Announcement
          </DialogTitle>
          <DialogDescription className="text-xs mt-1">
            Publish a formal wide-system notification layer targeted across
            global administrative channels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          {/* HEADLINE FIELD MODULE */}
          <div className="space-y-1.5">
            <Label
              htmlFor="announcement-headline"
              className="text-xs font-semibold text-foreground/90"
            >
              Notice Headline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="announcement-headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., Scheduled Core Infrastructure Maintenance Window"
              className="h-10 text-sm bg-background border-muted-foreground/20 focus-visible:ring-1"
              disabled={loading}
              maxLength={150}
              required
            />
          </div>

          {/* DESCRIPTION AREA FIELD MODULE */}
          <div className="space-y-1.5">
            <Label
              htmlFor="announcement-description"
              className="text-xs font-semibold text-foreground/90"
            >
              Broadsheet Description Payload{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="announcement-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clean, descriptive details detailing the purpose or timeline metrics for this broadsheet deployment..."
              className="min-h-[130px] text-xs bg-background border-muted-foreground/20 focus-visible:ring-1 leading-relaxed resize-none"
              disabled={loading}
              required
            />
          </div>

          {/* CONTROL OVERLAY ACTION BUTTONBAR */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="text-xs font-medium h-10 px-4 border-muted/80"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="text-xs font-medium h-10 px-5 shadow-sm min-w-[110px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Publishing...
                </>
              ) : (
                "Publish Announcement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
