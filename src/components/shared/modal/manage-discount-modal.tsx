import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { updateProductService } from "@/services/dashboard/product/product.service";
import { AppToast } from "@/components/shared/common/app-toast";
import { Loader2, Percent, DollarSign } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Sync TS module


interface ManageDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModel | null;
  onSuccess: () => void;
}

export function ManageDiscountModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ManageDiscountModalProps) {
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setDiscountType(product.discountType || "PERCENTAGE");
      setDiscountValue(product.discountValue || 0);
    }
  }, [product, isOpen]);

  const handleSave = async () => {
    if (!product) return;

    // Validation
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      AppToast({ type: "error", message: "Percentage cannot exceed 100%" });
      return;
    }
    if (discountType === "FIXED" && discountValue > product.sellingPrice) {
      AppToast({ type: "error", message: "Discount cannot exceed selling price" });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProductService(product.id, {
        ...product, // Send existing product data
        discountType,
        discountValue: Number(discountValue), // update discount
      } as any);

      const symbol = discountType === "PERCENTAGE" ? "%" : "$";
      AppToast({
        type: "success",
        message: `Discount updated to ${discountType === "FIXED" ? "$" : ""}${discountValue}${symbol} successfully`,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      AppToast({
        type: "error",
        message: error?.message || "Failed to update discount",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNewPrice = () => {
    if (!product) return 0;
    if (discountType === "PERCENTAGE") {
      return product.sellingPrice * (1 - discountValue / 100);
    }
    return Math.max(0, product.sellingPrice - discountValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Discount</DialogTitle>
          <DialogDescription>
            Set a discount for <strong>{product?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label>Discount Type</Label>
            <RadioGroup 
              value={discountType} 
              onValueChange={(val: "PERCENTAGE" | "FIXED") => setDiscountType(val)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
                <Label htmlFor="percentage" className="font-normal cursor-pointer">Percentage (%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIXED" id="fixed" />
                <Label htmlFor="fixed" className="font-normal cursor-pointer">Fixed Amount ($)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount Value</Label>
            <div className="relative">
              <Input
                id="discount"
                type="number"
                min="0"
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="pl-8"
              />
              {discountType === "PERCENTAGE" ? (
                <Percent className="w-4 h-4 text-muted-foreground absolute left-2.5 top-3" />
              ) : (
                <DollarSign className="w-4 h-4 text-muted-foreground absolute left-2.5 top-3" />
              )}
            </div>
            
            <div className="p-3 bg-muted/30 rounded-md mt-4 border border-muted">
               <p className="text-sm font-medium">Pricing Preview</p>
               <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>Current Price:</span>
                  <span className="line-through">${product?.sellingPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center mt-1 text-sm font-semibold text-green-600 border-t pt-1 border-muted">
                  <span>New Price:</span>
                  <span>${calculateNewPrice().toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Discount"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
