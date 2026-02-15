"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Briefcase,
  Building2,
  Shield,
  Calendar,
  Edit,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface UserDetailDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export function UserDetailDialog({
  user,
  open,
  onClose,
  onEdit,
}: UserDetailDialogProps) {
  if (!user) return null;

  const getAccountTypeBadge = (accountType: string) => {
    const variants: Record<string, string> = {
      admin:
        "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
      management:
        "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
      team_head:
        "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
      user: "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20",
    };
    return variants[accountType] || variants.user;
  };

  const formatAccountType = (accountType: string) => {
    const formatMap: Record<string, string> = {
      admin: "Admin",
      management: "Management",
      team_head: "Team Head",
      user: "User",
    };
    return formatMap[accountType] || accountType;
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <DialogContent forceMount className="max-w-2xl p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="p-6 max-h-[90vh] overflow-y-auto"
            >
              <DialogHeader className="pb-4">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      User Details
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      View and manage user information
                    </p>
                  </motion.div>
                </motion.div>
              </DialogHeader>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* User Name and Status */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start justify-between bg-muted/30 p-4 rounded-lg"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      User ID: {user.id}
                    </p>
                  </div>
                  <Badge
                    className={getAccountTypeBadge(user.accountType)}
                    variant="outline"
                  >
                    {formatAccountType(user.accountType)}
                  </Badge>
                </motion.div>

                <Separator className="my-4" />

                {/* User Information Grid */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <InfoCard icon={Mail} label="Email" value={user.email} />
                  <InfoCard icon={Briefcase} label="Role" value={user.role} />
                  <InfoCard
                    icon={Building2}
                    label="Department"
                    value={user.department}
                  />
                  <InfoCard
                    icon={Shield}
                    label="Account Type"
                    value={user.accountType}
                    capitalize
                  />
                  {user.createdAt && (
                    <InfoCard
                      icon={Calendar}
                      label="Created At"
                      value={format(new Date(user.createdAt), "PPP")}
                    />
                  )}
                  {user.updatedAt && (
                    <InfoCard
                      icon={Calendar}
                      label="Last Updated"
                      value={format(new Date(user.updatedAt), "PPP")}
                    />
                  )}
                </motion.div>

                <Separator className="my-4" />

                {/* Actions */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-end gap-3"
                >
                  <Button
                    onClick={() => {
                      onEdit(user);
                      onClose();
                    }}
                    className="flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Edit className="h-4 w-4" />
                    Edit User
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="text-foreground dark:text-white hover:bg-muted cursor-pointer"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

// Helper component for info items with consistent styling
function InfoCard({
  icon: Icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
      className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p
        className={`text-foreground font-medium ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </motion.div>
  );
}
