"use client";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllBrandsResponse,
  BrandModel,
} from "@/models/dashboard/master-data/brand/brand.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Trash, Image as ImageIcon, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageCell } from "@/components/shared/common/image-cell";
import React from "react";

interface BrandTableHandlers {
  handleViewBrand: (brand: BrandModel) => void;
  handleEditBrand: (brand: BrandModel) => void;
  handleDelete: (brand: BrandModel) => void;
}

interface BrandTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: BrandTableHandlers;
}

export const createBrandTableColumns = ({
  data,
  handlers,
}: BrandTableOptions): TableColumn<BrandModel>[] => {
  const { handleViewBrand, handleEditBrand, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Brand Name",
      className: "min-w-[200px]",
      render: (item) => (
        <div className="flex items-center gap-3">
          <ImageCell
            src={item.logoUrl || item.imageUrl}
            alt={item.name}
            objectFit="contain"
          />
          <span className="font-semibold text-foreground">{item.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "min-w-[250px] max-w-[400px]",
      render: (item) => (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {item.description || "No description provided."}
        </p>
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
      key: "createdAt",
      label: "Created At",
      className: "w-[160px]",
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
            onClick={() => handleViewBrand(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Brand"
            onClick={() => handleEditBrand(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Brand"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
