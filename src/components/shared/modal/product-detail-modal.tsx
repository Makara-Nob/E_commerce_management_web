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
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Tag, 
  Layers, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  AlertCircle,
  Truck,
  Building2,
  Plus,
  Eye
} from "lucide-react";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModel | null;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  if (!product) return null;

  const discountAmount = product.discountType === "PERCENTAGE" 
    ? (product.sellingPrice * product.discountValue) / 100 
    : product.discountValue;
  
  const finalPrice = Math.max(0, product.sellingPrice - discountAmount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </div>
              <DialogDescription className="font-mono text-sm">
                SKU: {product.sku}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-8">
            {/* Primary Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl border border-muted flex flex-col items-center justify-center text-center">
                <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Selling Price</span>
                <div className="flex flex-col">
                  {product.discountValue > 0 && (
                    <span className="text-xs line-through text-muted-foreground">${product.sellingPrice.toFixed(2)}</span>
                  )}
                  <span className="text-xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl border border-muted flex flex-col items-center justify-center text-center">
                <ShoppingCart className="w-5 h-5 text-blue-600 mb-2" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Stock</span>
                <span className={`text-xl font-bold ${product.quantity <= product.minStock ? 'text-destructive' : 'text-primary'}`}>
                  {product.quantity}
                </span>
                {product.quantity <= product.minStock && (
                  <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full mt-1 font-medium">LOW STOCK</span>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-xl border border-muted flex flex-col items-center justify-center text-center">
                 <Tag className="w-5 h-5 text-purple-600 mb-2" />
                 <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Discount</span>
                 <span className="text-xl font-bold text-primary">
                    {product.discountValue > 0 
                      ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : '$'}`
                      : 'None'}
                 </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" /> Description
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 bg-background p-4 rounded-lg border italic">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {/* Detailed Relationships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Layers className="w-4 h-4" /> Categorization
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline" className="font-normal">{product.category?.name || "N/A"}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Brand</span>
                    <Badge variant="outline" className="font-normal">{product.brand?.name || "N/A"}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Truck className="w-4 h-4" /> Logistics
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Supplier</span>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{product.supplier?.name || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cost Price</span>
                    <span className="font-medium">${product.costPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Variants Section */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Plus className="w-4 h-4" /> Variants List
                </div>
                <Badge variant="secondary" className="text-[10px]">{product.variants?.length || 0} Variants</Badge>
              </div>

              {product.variants && product.variants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((v, idx) => (
                    <div key={v._id || idx} className="p-3 border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{v.variantName}</span>
                        <span className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border">{v.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                         <div className="flex items-center gap-1 text-muted-foreground">
                            <span>Stock:</span>
                            <span className="text-foreground font-semibold">{v.stockQuantity}</span>
                         </div>
                         <div className="flex items-center gap-1 text-muted-foreground justify-end">
                            <span>Add. Price:</span>
                            <span className="text-foreground font-semibold">+${v.additionalPrice.toFixed(2)}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                  This product has no variants.
                </div>
              )}
            </div>

            {/* Dates / Metadata */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-4 italic">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created: {dateTimeFormat(product.createdAt)}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated: {dateTimeFormat(product.updatedAt)}</span>
              </div>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Views: {product.viewCount}</span>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-muted/20 border-t">
          <Button onClick={onClose} className="w-full sm:w-auto">Close Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


