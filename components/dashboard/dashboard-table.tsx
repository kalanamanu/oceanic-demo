"use client";

import { Button } from "@/components/ui/button";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { motion } from "framer-motion";
import { Ship, MapPin, CalendarDays, Clock } from "lucide-react";

interface RecentInquiry {
  title: string;
  agent: string;
  eta: string;
  port: string;
  received_date: string;
  received_time: string;
  createdAt: string;
}

interface DashboardTableProps {
  activities: RecentInquiry[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const row = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0 },
};

export default function DashboardTable({ activities }: DashboardTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <section className="pt-4">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Recent Inquiries
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest vessel inquiries received by the system
          </p>
        </div>

        <VesselInquiryDialog>
          <Button size="lg" className="shadow-sm">
            Create Inquiry
          </Button>
        </VesselInquiryDialog>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Vessel
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Agent
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Port
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  ETA
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Received
                </th>
              </tr>
            </thead>

            <motion.tbody
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-border"
            >
              {activities.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No recent inquiries found
                  </td>
                </tr>
              ) : (
                activities.map((a, index) => (
                  <motion.tr
                    key={index}
                    variants={row}
                    whileHover={{
                      backgroundColor: "rgba(0,0,0,0.02)",
                    }}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Vessel */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                          <Ship className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <p className="font-medium text-foreground">
                            {a.title}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Created {new Date(a.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Agent */}
                    <td className="px-6 py-4 text-sm text-foreground">
                      {a.agent}
                    </td>

                    {/* Port */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {a.port}
                      </div>
                    </td>

                    {/* ETA */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                        {formatDate(a.eta)}
                      </div>
                    </td>

                    {/* Received */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />

                          {formatDate(a.received_date)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />

                          {a.received_time?.slice(0, 5)}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
