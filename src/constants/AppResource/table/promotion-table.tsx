"use client";

import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { PromotionModel } from "@/redux/features/promotions/store/models/response/promotion-response";
import { indexDisplay } from "@/utils/common/common";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Eye, Tag } from "lucide-react";
import { format } from "date-fns";

interface PromotionTableHandlers {
  handleView: (promotion: PromotionModel) => void;
  handleEdit: (promotion: PromotionModel) => void;
  handleDelete: (promotion: PromotionModel) => void;
}

interface PromotionTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: PromotionTableHandlers;
}

export const createPromotionTableColumns = ({
  data,
  handlers,
}: PromotionTableOptions): TableColumn<PromotionModel>[] => {
  const { handleView, handleEdit, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Promotion Name",
      className: "min-w-[180px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: "product",
      label: "Product",
      className: "min-w-[180px]",
      render: (item) => (
        <span className="text-sm truncate max-w-[200px] block">
          {item.productName || "No Product"}
        </span>
      ),
    },
    {
      key: "discount",
      label: "Discount",
      className: "w-[120px]",
      render: (item) => (
        <Badge variant="secondary" className="font-bold bg-primary/10 text-primary border-primary/20">
          {item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : `$${item.discountValue.toFixed(2)}`}
        </Badge>
      ),
    },
    {
      key: "validity",
      label: "Validity Period",
      className: "w-[220px]",
      render: (item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return (
          <div className="text-[11px] text-muted-foreground">
            {format(start, 'dd MMM yyyy')} - {format(end, 'dd MMM yyyy')}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "w-[100px]",
      render: (item) => (
        <Badge
          variant={item.status === "ACTIVE" ? "default" : "secondary"}
          className={
            item.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
              : "bg-muted text-muted-foreground"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[140px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleView(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Promotion"
            onClick={() => handleEdit(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Promotion"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
