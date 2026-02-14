"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/users/stats-cards";
import { FilterBar } from "@/components/users/filter-bar";
import { UserTable } from "@/components/users/user-table";
import { UserDetailDialog } from "@/components/users/user-detail-dialog";
import { UserCreateDialog } from "@/components/users/user-create-dialog";
import { UserEditDialog } from "@/components/users/user-edit-dialog";
import { UserDeleteDialog } from "@/components/users/user-delete-dialog";
import { User } from "@/types/user.types";
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.accountType === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (user) => (user.status || "active") === statusFilter,
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, statusFilter, users]);

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => (u.status || "active") === "active")
      .length,
    inactiveUsers: users.filter((u) => u.status === "inactive").length,
    adminUsers: users.filter((u) => u.accountType === "admin").length,
  };

  // Handlers
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    toast.info("Export feature coming soon!");
    // Implement export logic here
  };

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-1">
        <div className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage system users and their permissions
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Filter and Table */}
          <section className="space-y-4">
            <FilterBar
              onExport={handleExport}
              onCreateNew={handleCreateNew}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
            <UserTable
              users={filteredUsers}
              onSelectUser={handleSelectUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </section>
        </div>
      </main>

      {/* Dialogs */}
      <UserDetailDialog
        user={selectedUser}
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        onEdit={handleEditUser}
      />

      <UserCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onUserCreated={fetchUsers}
      />

      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUserUpdated={fetchUsers}
      />

      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onUserDeleted={fetchUsers}
      />
    </div>
  );
}
