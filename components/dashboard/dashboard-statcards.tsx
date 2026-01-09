"use client";

interface StatCardItem {
  label: string;
  value: number;
  color: string;
}

interface StatCardsProps {
  stats: StatCardItem[];
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-lg p-4 shadow ${s.color}`}>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-sm mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
