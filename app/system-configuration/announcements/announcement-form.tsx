"use client";

import { useState } from "react";
import { NotificationService } from "@/services/notification.service";

export function AnnouncementForm() {
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await NotificationService.createNotification({
        notificationHeadline: headline,
        notificationDescription: description,
        notificationType: "ANNOUNCEMENT",
      });

      setHeadline("");
      setDescription("");

      alert("Announcement created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-5 bg-card"
    >
      <h2 className="font-semibold text-lg">Create Announcement</h2>

      <input
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder="Announcement headline"
        className="w-full border rounded-md p-2 bg-background"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Announcement description..."
        className="w-full border rounded-md p-2 bg-background min-h-[120px]"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
      >
        {loading ? "Creating..." : "Create Announcement"}
      </button>
    </form>
  );
}
