"use client";

import * as React from "react";
import { Shield, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types/permission.types";

interface RolesTableProps {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDeleteClick: (role: Role) => void;
}

export default function RolesTable({
  roles,
  loading,
  onEdit,
  onDeleteClick,
}: RolesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Roles List
        </CardTitle>
        <CardDescription>System roles and assigned permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading roles...
                    </div>
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.role_id}>
                    <TableCell className="font-medium">
                      {role.roleName}
                    </TableCell>
                    <TableCell>{role.roleDescription}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.rolePermissions?.map((p) => (
                          <Badge key={p.permission_id} variant="secondary">
                            {p.permission?.permissionName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onEdit(role)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => onDeleteClick(role)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
