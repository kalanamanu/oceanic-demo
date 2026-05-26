"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Layers3,
  FolderKanban,
  ChevronRight,
  ShieldCheck,
  Users,
} from "lucide-react";

const configItems = [
  {
    title: "Basis",
    description: "Manage quotation basis and related settings",
    href: "/system-configuration/basis",
    icon: Layers3,
  },

  {
    title: "Categories",
    description: "Manage inquiry and quotation categories",
    href: "/system-configuration/categories",
    icon: FolderKanban,
  },

  {
    title: "Permissions",
    description: "Manage permissions, roles and user access control",
    href: "/system-configuration/permissions",
    icon: ShieldCheck,
  },

  {
    title: "Roles",
    description: "Manage system roles and role permissions",
    href: "/system-configuration/roles",
    icon: Users,
  },
];

export default function ConfigurationPage() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>

        <p className="text-muted-foreground text-sm">
          Manage system configuration modules
        </p>
      </div>

      {/* CONFIG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {configItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Card className="group hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>

                    <CardDescription className="pt-1 text-sm">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
