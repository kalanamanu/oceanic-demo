"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UpdateUserRequest } from "@/types/user.types";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function UserEditDialog({
  user,
  open,
  onClose,
  onUserUpdated,
}: UserEditDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<UpdateUserRequest>({
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "",
    accountType: user?.accountType || "user",
    department: user?.department || "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        department: user.department,
      });
    }
  }, [user]);

  const handleChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await UserService.updateUser(formData);
      toast.success("User updated successfully!");
      onUserUpdated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user information</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Label htmlFor="role">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.2 }}
                >
                  <Label htmlFor="department">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <Label htmlFor="accountType">
                    Account Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value: any) =>
                      handleChange("accountType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin Account</SelectItem>
                      <SelectItem value="management">
                        Management Account
                      </SelectItem>
                      <SelectItem value="team_head">
                        Team Head Account
                      </SelectItem>
                      <SelectItem value="user">User Account</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <DialogFooter className="gap-2 mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="text-foreground dark:text-white hover:bg-muted cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
