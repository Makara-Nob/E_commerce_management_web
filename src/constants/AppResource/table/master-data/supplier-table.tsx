"use client";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { 
  SupplierModel,
  AllSuppliersResponse 
} from "@/models/dashboard/master-data/supplier/supplier.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Trash, Eye, User, Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SupplierTableHandlers {
  handleViewSupplier: (supplier: SupplierModel) => void;
  handleEditSupplier: (supplier: SupplierModel) => void;
  handleDelete: (supplier: SupplierModel) => void;
}

interface SupplierTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: SupplierTableHandlers;
}

export const createSupplierTableColumns = ({
  data,
  handlers,
}: SupplierTableOptions): TableColumn<SupplierModel>[] => {
  const { handleViewSupplier, handleEditSupplier, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Supplier Name",
      className: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">{item.name}</span>
          {item.contactPerson && (
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{item.contactPerson}</span>
             </div>
          )}
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      className: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-1.5">
          {item.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{item.phone}</span>
            </div>
          )}
          {item.email && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[150px]">{item.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      className: "min-w-[200px] max-w-[300px]",
      render: (item) => (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
          <p className="line-clamp-2">{item.address || "---"}</p>
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
              : ""
          }
        >
          {item.status}
        </Badge>
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
            onClick={() => handleViewSupplier(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Supplier"
            onClick={() => handleEditSupplier(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Supplier"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
