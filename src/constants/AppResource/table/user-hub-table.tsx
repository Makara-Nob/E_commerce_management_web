"use client";

import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { 
  UserModel 
} from "@/redux/features/auth/store/models/response/users-response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Trash, Eye, RotateCw, User, Mail, Phone, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/common/custom-avator";

interface UserTableHandlers {
  handleViewUser: (user: UserModel) => void;
  handleEditUser: (user: UserModel) => void;
  handleResetPassword: (user: UserModel) => void;
  handleDelete: (user: UserModel) => void;
}

interface UserTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: UserTableHandlers;
}

export const createUserHubTableColumns = ({
  data,
  handlers,
}: UserTableOptions): TableColumn<UserModel>[] => {
  const { handleViewUser, handleEditUser, handleResetPassword, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "user",
      label: "User Profile",
      className: "min-w-[250px]",
      render: (item) => (
        <div className="flex items-center gap-3">
          <CustomAvatar
            imageUrl={item.profileUrl}
            name={item.fullName}
            size="md"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground line-clamp-1">{item.fullName}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <User className="h-3 w-3" />
              <span>@{item.username}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      className: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[160px]">{item.email}</span>
          </div>
          {item.phone && (
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span>{item.phone}</span>
             </div>
          )}
        </div>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      className: "min-w-[150px]",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {(item.roles || []).map((role) => (
            <Badge 
              key={role} 
              variant="outline" 
              className="text-[10px] px-1.5 py-0 h-5 bg-primary/5 border-primary/20 text-primary capitalize"
            >
              <Shield className="w-2.5 h-2.5 mr-1" />
              {role.toLowerCase()}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-[120px]",
      render: (item) => (
        <Badge
          variant={item.status === "ACTIVE" ? "default" : "secondary"}
          className={
            item.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
              : item.status === "SUSPENDED" 
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                : ""
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      className: "w-[140px]",
      render: (item) => (
        <span className="text-xs text-muted-foreground">
          {dateTimeFormat(item.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleViewUser(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit User"
            onClick={() => handleEditUser(item)}
          />
          <ActionButton
            icon={<RotateCw className="h-4 w-4" />}
            tooltip="Reset Password"
            onClick={() => handleResetPassword(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete User"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
