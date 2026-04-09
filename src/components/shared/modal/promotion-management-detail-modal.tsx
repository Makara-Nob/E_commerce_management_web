"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PromotionModel } from "@/redux/features/promotions/store/models/response/promotion-response";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Tag, Package, Info, CheckCircle2, XCircle } from "lucide-react";

interface PromotionManagementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: PromotionModel | null;
}

export function PromotionManagementDetailModal({
  isOpen,
  onClose,
  promotion,
}: PromotionManagementDetailModalProps) {
  if (!promotion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] font-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Promotion Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{promotion.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ID: #{promotion.id}
              </p>
            </div>
            <Badge
              variant={promotion.status === "ACTIVE" ? "success" : "destructive"}
              className="flex items-center gap-1"
            >
              {promotion.status === "ACTIVE" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {promotion.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</p>
                  <p className="text-sm font-semibold">{promotion.productName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Discount</p>
                  <p className="text-lg font-bold text-primary">
                    {promotion.discountType === 'PERCENTAGE' 
                      ? `${promotion.discountValue}%` 
                      : `$${promotion.discountValue.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Date</p>
                  <p className="text-sm font-semibold">{format(new Date(promotion.startDate), 'PPP')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End Date</p>
                  <p className="text-sm font-semibold">{format(new Date(promotion.endDate), 'PPP')}</p>
                </div>
              </div>
            </div>
          </div>

          {promotion.description && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="text-sm text-balance mt-1 break-words">
                    {promotion.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
