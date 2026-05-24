"use client";

import { useMemo, useState } from "react";
import { UserActivity } from "@/types/activity.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export function ActivityFeed({
  data,
  loading,
  onSelect,
}: {
  data: UserActivity[];
  loading: boolean;
  onSelect: (a: UserActivity) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return data.slice(start, end);
  }, [data, currentPage]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="p-4 animate-pulse border bg-muted/20 h-[100px]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Activity List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {paginatedData.length > 0 ? (
          paginatedData.map((a) => (
            <Card
              key={a.id}
              onClick={() => onSelect(a)}
              className="
                p-4
                cursor-pointer
                hover:bg-muted/40
                transition-all
                hover:shadow-md
                rounded-2xl
              "
            >
              <div className="flex justify-between gap-4">
                {/* Left */}
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-sm">{a.username}</p>

                    <p className="text-sm text-muted-foreground mt-1">
                      {a.activity_description}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge>{a.activity_type}</Badge>

                    {a.module && <Badge variant="secondary">{a.module}</Badge>}
                  </div>
                </div>

                {/* Right */}
                <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                  <p>{new Date(a.activity_time).toLocaleDateString()}</p>

                  <p className="mt-1">
                    {new Date(a.activity_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center rounded-2xl">
            <p className="text-sm text-muted-foreground">
              No activities found.
            </p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          {/* Left */}
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
