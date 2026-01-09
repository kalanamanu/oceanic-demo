"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Static user data (replace with real user info as needed)
  const name = "Jane Doe";
  const department = "Operations";

  // Dummy stats (replace with real data)
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

  // Sample recent activities
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
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-8">
          {/* Welcome */}
          <section>
            <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
            <p className="text-muted-foreground text-lg">
              Department: <span className="font-semibold">{department}</span>
            </p>
          </section>

          {/* Stat Cards */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-lg p-4 shadow ${s.color}`}
                >
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <Button onClick={() => alert("Create Inquiry Form Opens")}>
                Create Inquiry
              </Button>
            </div>
            {/* Activities Table */}
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
      </main>
    </div>
  );
}
