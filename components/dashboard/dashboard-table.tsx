"use client";

import { Button } from "@/components/ui/button";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  activity: string;
  by: string;
  time: string;
}

interface DashboardTableProps {
  activities: Activity[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const row = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function DashboardTable({ activities }: DashboardTableProps) {
  return (
    <section className="pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Recent Activities
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track the latest updates and changes
          </p>
        </div>
        <VesselInquiryDialog>
          <Button size="lg" className="shadow-sm">
            Create Inquiry
          </Button>
        </VesselInquiryDialog>
      </motion.div>

      {/* Enhanced Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Activity
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  By
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-border"
            >
              {activities.map((a) => (
                <motion.tr
                  key={a.id}
                  variants={row}
                  whileHover={{
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    transition: { duration: 0.2 },
                  }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-medium text-foreground">
                    {a.activity}
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground">{a.by}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {a.time}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
