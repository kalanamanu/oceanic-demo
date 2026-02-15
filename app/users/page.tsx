"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users with pagination
  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await UserService.getAllUsers({ page, pageSize: 20 });
      setUsers(result.data);
      setFilteredUsers(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalUsers(result.pagination.totalUsers);
      setCurrentPage(result.pagination.currentPage);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Apply filters (client-side filtering on current page)
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

  // Calculate stats from all users
  const stats = {
    totalUsers: totalUsers,
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
  };

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div> */}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen bg-background flex flex-col"
    >
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

          {/* Stats Cards with loading state */}
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

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <UserTable
                  users={filteredUsers}
                  onSelectUser={handleSelectUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                  >
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} • Total {totalUsers}{" "}
                      users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1,
                          )
                          .map((page, idx, arr) => (
                            <React.Fragment key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  page === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            </React.Fragment>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
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
        onUserCreated={() => fetchUsers(currentPage)}
      />

      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUserUpdated={() => fetchUsers(currentPage)}
      />

      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onUserDeleted={() => fetchUsers(currentPage)}
      />
    </motion.div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute requiredAccountTypes={["admin"]}>
      <UsersPageContent />
    </ProtectedRoute>
  );
}
