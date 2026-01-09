"use client";

import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/dashboard-statcards";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";

export default function Dashboard() {
  const name = "Jane Doe";
  const department = "Operations";

  const stats = [
    {
      label: "Total Inquiries",
      value: 120,
      color: "bg-blue-600 text-white",
    },
    {
      label: "Pending Inquiries",
      value: 24,
      color: "bg-orange-400 text-white",
    },
    {
      label: "Confirmed Inquiries",
      value: 52,
      color: "bg-green-500 text-white",
    },
    {
      label: "Active Vendors",
      value: 12,
      color: "bg-cyan-600 text-white",
    },
    {
      label: "Active Products",
      value: 47,
      color: "bg-violet-500 text-white",
    },
  ];

  const activities = [
    {
      id: "1",
      activity: "Inquiry OMS-2026-005 created",
      by: "Maria Santos",
      time: "2 hours ago",
    },
    {
      id: "2",
      activity: "OMS-2026-003 confirmed by vendor",
      by: "John Silva",
      time: "4 hours ago",
    },
    {
      id: "3",
      activity: "New vendor 'Pacific Supplies' activated",
      by: "Purchasing Head",
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
        <p className="text-muted-foreground text-lg">
          Department: <span className="font-semibold">{department}</span>
        </p>
      </section>

      {/* Stat Cards */}
      <section>
        <StatCards stats={stats} />
      </section>

      {/* Quick Actions and Recent Activities Table */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activities</h2>
          <VesselInquiryDialog>
            <Button>Create Inquiry</Button>
          </VesselInquiryDialog>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm rounded-lg shadow bg-card border">
            <thead className="bg-muted border-b">
              <tr>
                <th className="py-2 px-4">Activity</th>
                <th className="py-2 px-4">By</th>
                <th className="py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{a.activity}</td>
                  <td className="py-2 px-4">{a.by}</td>
                  <td className="py-2 px-4">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
