"use client";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllProductsResponse,
  ProductModel,
} from "@/models/dashboard/master-data/product/product.response.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash, Package, Layers, Link as LinkIcon, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductTableHandlers {
  handleEditProduct: (product: ProductModel) => void;
  handleViewProductDetail: (product: ProductModel) => void;
  handleDelete: (product: ProductModel) => void;
}

interface ProductTableOptions {
  data: AllProductsResponse | null;
  handlers: ProductTableHandlers;
}

export const createProductTableColumns = ({
  data,
  handlers,
}: ProductTableOptions): TableColumn<ProductModel>[] => {
  const { 
    handleEditProduct, 
    handleViewProductDetail, 
    handleDelete,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Product Name",
      className: "min-w-[200px]",
      render: (item) => {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);

        return (
          <div className="flex items-center gap-2">
            {item.imageUrl && !error ? (
              <div className="relative h-8 w-8">
                {loading && (
                  <div className="absolute inset-0 animate-pulse rounded-md bg-muted" />
                )}

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={`h-8 w-8 rounded-md object-cover ${
                    loading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setLoading(false);
                    setError(true);
                  }}
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Package className="h-4 w-4" />
              </div>
            )}

            <span className="font-medium">{item.name}</span>
          </div>
        );
      },
    },
    {
      key: "sku",
      label: "SKU",
      className: "max-w-[150px]",
      render: (item) => (
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{item.sku}</code>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "max-w-[150px]",
      render: (item) => item.category?.name || "Uncategorized",
    },
    {
      key: "sellingPrice",
      label: "Price",
      className: "max-w-[120px]",
      render: (item) => `$${item.sellingPrice.toFixed(2)}`,
    },
    {
      key: "quantity",
      label: "Stock",
      className: "max-w-[100px]",
      render: (item) => (
        <div className="flex flex-col">
          <span
            className={
              item.quantity <= item.minStock ? "text-destructive font-bold" : ""
            }
          >
            {item.quantity}
          </span>
          {item.quantity <= item.minStock && (
            <span className="text-[10px] text-destructive">Low Stock</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (item) => (
        <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
          {item.status}
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
      className: "w-[160px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleViewProductDetail(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Product"
            onClick={() => handleEditProduct(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Product"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
