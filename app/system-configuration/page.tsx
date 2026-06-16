"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Layers3,
  FolderKanban,
  ShieldCheck,
  Users,
  ArrowRight,
  Sliders,
} from "lucide-react";

import { AuthService } from "@/services/auth.service";

const configItems = [
  {
    title: "Basis",
    description: "Manage quotation basis, active rates, and global parameters.",
    href: "/system-configuration/basis",
    icon: Layers3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Categories",
    description: "Manage inquiry structures and global quotation categories.",
    href: "/system-configuration/categories",
    icon: FolderKanban,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Permissions",
    description: "Manage system permissions, attributes, and access layers.",
    href: "/system-configuration/permissions",
    icon: ShieldCheck,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Roles",
    description: "Manage structural corporate roles and access scopes.",
    href: "/system-configuration/roles",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export default function ConfigurationPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AuthService.checkAuth().then(setUser);
  }, []);

  const restrictedRoles = ["Purchasing - Manager", "General Manager"];

  const filteredConfigItems = useMemo(() => {
    if (!user?.role) return configItems;

    if (restrictedRoles.includes(user.role)) {
      return configItems.filter(
        (item) => item.title !== "Permissions" && item.title !== "Roles",
      );
    }

    return configItems;
  }, [user]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
            <p className="text-muted-foreground">
              Centralized architecture settings and administrative module
              profiles.
            </p>
          </div>
        </div>

        {/* Configuration Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConfigItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={item.href} className="block h-full">
                <Card className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary/50 shadow-sm h-full flex flex-col justify-between">
                  <CardHeader className="space-y-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bgColor}`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-sm font-semibold text-primary">
                      Configure Settings
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fallback Screen (No Modules Authorized) */}
        {filteredConfigItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Sliders className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No modules available</h3>
            <p className="text-muted-foreground">
              Your account group role lacks configuration rights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
