"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Tag, Layers, ShoppingCart, 
  AlertCircle, Truck, Building2, Eye, 
  Image as ImageIcon, Link2, Info, Settings2
} from "lucide-react";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl || (product.images?.length ? product.images[0] : null));
      setActiveTab("overview");
    }
  }, [product]);

  if (!product) return null;

  const discountAmount = product.discountType === "PERCENTAGE" 
    ? (product.sellingPrice * product.discountValue) / 100 
    : product.discountValue;
  
  const finalPrice = Math.max(0, product.sellingPrice - discountAmount);
  
  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.images || [])
  ].filter((v, i, a) => a.indexOf(v) === i); // Unique images

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 bg-background border-none shadow-2xl rounded-2xl">
        {/* Header Section with subtle gradient */}
        <div className="relative px-6 pt-8 pb-6 border-b bg-gradient-to-br from-muted/50 via-background to-background shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-3xl font-extrabold tracking-tight text-foreground">
                  {product.name}
                </DialogTitle>
                <Badge 
                  className="px-2.5 py-0.5 text-xs font-semibold shadow-sm"
                  variant={product.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {product.status}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="w-3.5 h-3.5" />
                SKU: <span className="font-mono text-foreground/80">{product.sku}</span>
              </DialogDescription>
            </div>
            {/* Quick stats top right */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mr-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-wider">Views</span>
                <span className="flex items-center gap-1 font-medium text-foreground"><Eye className="w-4 h-4" /> {product.viewCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Sticky Tabs List */}
            <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl px-6 py-4 shadow-sm border-b">
              <TabsList className="w-full h-11 bg-muted/60 p-1">
                <TabsTrigger value="overview" className="flex-1 h-full text-sm data-[state=active]:shadow-sm rounded-md transition-all">
                  <Info className="w-4 h-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="variants" className="flex-1 h-full text-sm data-[state=active]:shadow-sm rounded-md transition-all">
                  <Settings2 className="w-4 h-4 mr-2" /> Variants & Options
                </TabsTrigger>
                <TabsTrigger value="related" className="flex-1 h-full text-sm data-[state=active]:shadow-sm rounded-md transition-all">
                  <Link2 className="w-4 h-4 mr-2" /> Related Products
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-6 py-6">
              <TabsContent value="overview" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Top split: Images & Key Price Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Images Showcase */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-muted/20 border border-muted-foreground/10 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner group">
                      {mainImage ? (
                        <img 
                          src={mainImage} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                          <ImageIcon className="w-16 h-16 mb-2 stroke-[1]" />
                          <span className="text-sm font-medium">No Image Available</span>
                        </div>
                      )}
                    </div>
                    {allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMainImage(img)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${mainImage === img ? "border-primary shadow-sm" : "border-transparent hover:border-primary/50"}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Key Details */}
                  <div className="space-y-6">
                    {/* Price Block */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                      <div className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Price</div>
                      <div className="flex items-baseline gap-3 relative">
                        <span className="text-4xl font-black text-foreground">${finalPrice.toFixed(2)}</span>
                        {product.discountValue > 0 && (
                          <span className="text-lg font-medium text-muted-foreground line-through decoration-destructive/50">
                            ${product.sellingPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.discountValue > 0 && (
                        <Badge variant="destructive" className="mt-3 font-semibold shadow-sm">
                          {product.discountType === 'PERCENTAGE' ? `${product.discountValue}% OFF` : `$${product.discountValue} OFF`}
                        </Badge>
                      )}
                    </div>

                    {/* Inventory Block */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-semibold text-muted-foreground flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Stock Availability</span>
                         <span className="font-bold">{product.quantity} Units</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${product.quantity <= product.minStock ? 'bg-destructive' : 'bg-primary'}`} 
                          style={{ width: `${Math.min(100, (product.quantity / Math.max(100, product.minStock * 3)) * 100)}%` }}
                        />
                      </div>
                      {product.quantity <= product.minStock && (
                        <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> Low stock alert (Min: {product.minStock})
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 bg-muted/20 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium"><Layers className="w-3.5 h-3.5" /> Category</div>
                        <div className="text-sm font-semibold text-foreground truncate">{product.category?.name || "None"}</div>
                      </div>
                      <div className="space-y-1 bg-muted/20 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium"><Package className="w-3.5 h-3.5" /> Brand</div>
                        <div className="text-sm font-semibold text-foreground truncate">{product.brand?.name || "None"}</div>
                      </div>
                      <div className="space-y-1 bg-muted/20 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium"><Building2 className="w-3.5 h-3.5" /> Supplier</div>
                        <div className="text-sm font-semibold text-foreground truncate">{product.supplier?.name || "None"}</div>
                      </div>
                      <div className="space-y-1 bg-muted/20 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium"><Truck className="w-3.5 h-3.5" /> Cost Price</div>
                        <div className="text-sm font-semibold text-foreground truncate">${product.costPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 pt-4 border-t border-muted/50">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4" /> About this product
                  </h4>
                  <div className="text-sm leading-relaxed text-foreground/80 bg-muted/10 p-5 rounded-xl border border-muted-foreground/10 prose prose-sm dark:prose-invert">
                    {product.description || <span className="italic opacity-50">No description provided.</span>}
                  </div>
                </div>

              </TabsContent>

              <TabsContent value="variants" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Options List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Product Options</h4>
                  {product.options && product.options.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.options.map((opt, idx) => (
                        <div key={idx} className="bg-background border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-semibold text-sm mb-3">{opt.name}</h5>
                          <div className="flex flex-wrap gap-2">
                            {opt.values.map((val, vIdx) => (
                              <Badge key={vIdx} variant="secondary" className="px-3 py-1 font-medium bg-muted">
                                {val}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-xl border-dashed border-2 text-muted-foreground text-sm">
                      No custom options defined.
                    </div>
                  )}
                </div>

                {/* Variants List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Variant Configurations</h4>
                    <Badge variant="outline" className="font-semibold">{product.variants?.length || 0} Variants</Badge>
                  </div>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {product.variants.map((v, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl shadow-sm hover:border-primary/30 transition-colors gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{v.variantName || `Variant ${idx + 1}`}</span>
                              <Badge variant={v.status === "ACTIVE" ? "outline" : "secondary"} className="text-[10px] h-5">{v.status || "ACTIVE"}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">SKU: {v.sku || "N/A"}</div>
                          </div>

                          <div className="flex items-center gap-6 text-sm divide-x divide-muted">
                            <div className="flex flex-col items-end px-4">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stock</span>
                              <span className={`font-semibold ${v.stockQuantity === 0 ? 'text-destructive' : ''}`}>{v.stockQuantity}</span>
                            </div>
                            <div className="flex flex-col items-end pl-4">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Add. Price</span>
                              <span className="font-semibold text-green-600">+${(v.additionalPrice || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-xl border-dashed border-2 text-muted-foreground text-sm">
                      No specific variants mapped.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="related" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-end border-b pb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Related Products</h4>
                  <Badge variant="outline" className="font-semibold">{product.relatedProducts?.length || 0} Linked</Badge>
                </div>
                
                {product.relatedProducts && product.relatedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.relatedProducts.map((rel, idx) => {
                      const id = typeof rel === 'object' && rel ? rel.id : rel;
                      const name = typeof rel === 'object' && rel ? rel.name : `Product ID: ${rel}`;
                      const relImage = typeof rel === 'object' && rel ? rel.imageUrl : null;
                      
                      return (
                        <div key={idx} className="group p-3 border rounded-xl flex gap-3 items-center bg-card hover:bg-muted/30 transition-all hover:shadow-sm">
                          <div className="w-14 h-14 bg-muted rounded-lg shrink-0 overflow-hidden flex items-center justify-center border">
                            {relImage ? (
                              <img src={relImage} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{name}</span>
                            <span className="text-xs text-muted-foreground font-mono truncate">ID: {id}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/10 rounded-2xl border border-dashed">
                    <Link2 className="w-12 h-12 mb-3 text-muted-foreground/30 stroke-[1]" />
                    <p className="text-sm font-medium">No related products linked.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t shrink-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="hidden sm:flex items-center gap-3 italic">
            <span>Created: {dateTimeFormat(product.createdAt)}</span>
            <span>&bull;</span>
            <span>Updated: {dateTimeFormat(product.updatedAt)}</span>
          </div>
          <div className="sm:hidden italic">
             {dateTimeFormat(product.updatedAt)}
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full px-6 font-semibold shadow-sm ml-auto">
            Close Panel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
