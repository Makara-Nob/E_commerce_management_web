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
import { ProductModel, ProductVariantModel } from "@/models/dashboard/master-data/product/product.response.model";
import {
  addVariantService,
  updateVariantService,
  deleteVariantService,
} from "@/services/dashboard/product/product.service";
import { AppToast } from "@/components/shared/common/app-toast";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

interface ManageVariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModel | null;
  onSuccess: () => void;
}

export function ManageVariantsModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ManageVariantsModalProps) {
  const [variants, setVariants] = useState<ProductVariantModel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for new/edit
  const [formData, setFormData] = useState<Partial<ProductVariantModel>>({
    variantName: "",
    sku: "",
    stockQuantity: 0,
    additionalPrice: 0,
    status: "ACTIVE",
    discountType: "PERCENTAGE",
    discountValue: 0,
    optionValues: [],
  });

  useEffect(() => {
    if (product) {
      setVariants(product.variants || []);
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      variantName: "",
      sku: "",
      stockQuantity: 0,
      additionalPrice: 0,
      status: "ACTIVE",
      discountType: "PERCENTAGE",
      discountValue: 0,
      optionValues: [],
    });
    setEditingId(null);
  };

  const handleEdit = (variant: ProductVariantModel) => {
    setFormData({
      variantName: variant.variantName,
      sku: variant.sku,
      stockQuantity: variant.stockQuantity,
      additionalPrice: variant.additionalPrice,
      status: variant.status,
      discountType: variant.discountType || "PERCENTAGE",
      discountValue: variant.discountValue || 0,
      optionValues: variant.optionValues || [],
    });
    setEditingId(variant._id || null);
  };

  const handleDelete = async (variantId: string) => {
    if (!product || !confirm("Are you sure you want to delete this variant?")) return;

    try {
      await deleteVariantService(product.id, variantId);
      setVariants((prev) => prev.filter((v) => v._id !== variantId));
      AppToast({ type: "success", message: "Variant deleted" });
      onSuccess();
    } catch (e: any) {
      AppToast({ type: "error", message: e.message || "Failed to delete" });
    }
  };

  const handleSaveVariant = async () => {
    if (!product) return;

    if (!formData.variantName || !formData.sku) {
      AppToast({ type: "error", message: "Variant Name and SKU are required" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update
        const updated = await updateVariantService(product.id, editingId, formData);
        setVariants((prev) => prev.map((v) => (v._id === editingId ? updated : v)));
        AppToast({ type: "success", message: "Variant updated" });
      } else {
        // Create
        const added = await addVariantService(product.id, formData);
        setVariants((prev) => [...prev, added]);
        AppToast({ type: "success", message: "Variant added" });
      }
      resetForm();
      onSuccess();
    } catch (error: any) {
      AppToast({
        type: "error",
        message: error?.message || "Failed to save variant",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Variants</DialogTitle>
          <DialogDescription>
            Manage variants (e.g., sizes, colors) for <strong>{product?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
          {/* Variant List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Existing Variants</h4>
            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground border p-4 rounded-md text-center bg-muted/20">
                No variants added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {variants.map((v) => (
                  <div key={v._id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                    <div>
                      <div className="font-semibold text-sm">{v.variantName} <span className="text-muted-foreground font-normal ml-2">({v.sku})</span></div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {v.stockQuantity} | Add. Price: ${v.additionalPrice} | 
                        Discount: {v.discountValue}{v.discountType === 'PERCENTAGE' ? '%' : '$'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}>
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => v._id && handleDelete(v._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-4">
              {editingId ? "Edit Variant" : "Add New Variant"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Variant Name *</Label>
                <Input
                  placeholder="e.g. Red / Large"
                  value={formData.variantName}
                  onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  placeholder="e.g. PROD-RED-LG"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.additionalPrice}
                  onChange={(e) => setFormData({ ...formData, additionalPrice: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {editingId && (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
              <Button onClick={handleSaveVariant} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? "Update Variant" : "Add Variant"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 border-t pt-4">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
