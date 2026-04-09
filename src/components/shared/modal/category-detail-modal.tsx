"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tag,
  Calendar,
  Hash,
  AlignLeft,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import { CategoryModel } from "@/models/dashboard/master-data/category/category.model";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { getAssetUrl } from "@/utils/common/common";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryModel | null;
}

export function CategoryDetailModal({
  isOpen,
  onClose,
  category,
}: CategoryDetailModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>Category Details</DialogTitle>
              <DialogDescription>
                Full overview of the selected category.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            {category.imageUrl ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border bg-muted/50 shadow-inner group">
                <Image
                  src={getAssetUrl(category.imageUrl)}
                  alt={category.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl overflow-hidden border bg-muted/30 flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageIcon className="w-10 h-10 opacity-20" />
                <p className="text-xs">No image available</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                  Category Name
                </div>
                <h2 className="text-2xl font-bold tracking-tight break-words">
                  {category.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Hash className="w-3 h-3 flex-shrink-0" />
                    Code
                  </div>
                  <p className="text-sm font-mono font-medium border rounded-md px-3 py-2 bg-muted/50 w-fit max-w-full overflow-auto">
                    {category.code || "---"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Activity className="w-3 h-3 flex-shrink-0" />
                    Status
                  </div>
                  <div>
                    <Badge
                      variant={
                        category.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className="px-3"
                    >
                      {category.status || "ACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <AlignLeft className="w-3 h-3 flex-shrink-0" />
                Description
              </div>
              <p className="text-sm leading-relaxed text-balance">
                {category.description ||
                  "No description provided for this category."}
              </p>
            </div>

            <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  Created At
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateTimeFormat(category.createdAt)}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  Last Updatedd
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateTimeFormat(category.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-card">
          <Button type="button" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
