"use client";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { 
  CategoryModel, 
  AllCategoriesResponse 
} from "@/models/dashboard/master-data/category/category.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Trash, Tag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CategoryTableHandlers {
  handleEdit: (category: CategoryModel) => void;
  handleView: (category: CategoryModel) => void;
  handleDelete: (category: CategoryModel) => void;
}

interface CategoryTableOptions {
  data: AllCategoriesResponse | null;
  handlers: CategoryTableHandlers;
}

export const createCategoryTableColumns = ({
  data,
  handlers,
}: CategoryTableOptions): TableColumn<CategoryModel>[] => {
  const { handleEdit, handleView, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Category Name",
      className: "min-w-[200px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground overflow-hidden border">
            {item.imageUrl ? (
              <Image 
                src={item.imageUrl.startsWith("http") ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imageUrl}`}
                alt={item.name}
                width={40}
                height={40}
                className="object-cover h-full w-full"
              />
            ) : (
              <Tag className="h-4 w-4" />
            )}
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: "code",
      label: "Code",
      className: "max-w-[120px]",
      render: (item) => (
        <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{item.code || "---"}</code>
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "min-w-[250px]",
      render: (item) => (
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {item.description || "No description provided."}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (item) => (
        <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
          {item.status || "ACTIVE"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[160px]",
      render: (item) => dateTimeFormat(item.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleView(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Category"
            onClick={() => handleEdit(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Category"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
