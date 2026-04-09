"use client";

import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { BannerModel } from "@/redux/features/banners/store/models/response/banner-response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Trash, Eye, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface BannerTableHandlers {
  handleView: (banner: BannerModel) => void;
  handleEdit: (banner: BannerModel) => void;
  handleDelete: (banner: BannerModel) => void;
}

interface BannerTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: BannerTableHandlers;
}

export const createBannerTableColumns = ({
  data,
  handlers,
}: BannerTableOptions): TableColumn<BannerModel>[] => {
  const { handleView, handleEdit, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "image",
      label: "Banner Image",
      className: "w-[150px]",
      render: (item) => (
        <div className="relative w-24 h-12 rounded overflow-hidden border bg-muted flex items-center justify-center">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      className: "min-w-[200px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground line-clamp-1">{item.title}</span>
          {item.description && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</span>
          )}
        </div>
      ),
    },
    {
      key: "displayOrder",
      label: "Order",
      className: "w-[80px]",
      render: (item) => (
        <Badge variant="outline" className="font-mono">
          {item.displayOrder}
        </Badge>
      ),
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
        key: "linkUrl",
        label: "Link",
        className: "w-[100px]",
        render: (item) => item.linkUrl ? (
            <a 
                href={item.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
                <ExternalLink className="w-3 h-3" /> Visit
            </a>
        ) : <span className="text-xs text-muted-foreground">---</span>,
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
            tooltip="Edit Banner"
            onClick={() => handleEdit(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Banner"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
