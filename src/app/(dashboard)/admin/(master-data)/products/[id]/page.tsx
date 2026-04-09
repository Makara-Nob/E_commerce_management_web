"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Tag,
  Layers,
  ShoppingCart,
  AlertCircle,
  Truck,
  Building2,
  Eye,
  Image as ImageIcon,
  Link2,
  Info,
  Settings2,
  ArrowLeft,
  Pencil,
  Calendar,
  BarChart2,
  Trash2,
} from "lucide-react";
import { useProductsState } from "@/redux/features/master-data/store/state/products-state";
import { deleteProduct } from "@/redux/features/master-data/store/thunks/product-thunks";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { AppToast } from "@/components/shared/common/app-toast";
import { toast } from "sonner";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { getProductByIdService } from "@/services/dashboard/product/product.service";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { ROUTES } from "@/constants/AppRoutes/routes";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-5 w-1/3 rounded" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { operations, dispatch } = useProductsState();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    getProductByIdService(id)
      .then((data) => {
        setProduct(data);
        setMainImage(data.imageUrl || (data.images?.length ? data.images[0] : null));
      })
      .catch(() => {
        setError("Failed to load product. It may have been deleted or you lack permission.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!product?.id) return;
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      AppToast({ type: "success", message: `Product "${product.name}" deleted` });
      router.push(ROUTES.DASHBOARD.PRODUCTS);
    } catch (err: any) {
      toast.error(err || "Failed to delete product");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
        <Package className="w-16 h-16 opacity-20" />
        <p className="text-base font-medium">{error || "Product not found."}</p>
        <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD.PRODUCTS)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Button>
      </div>
    );
  }

  const discountAmount =
    product.discountType === "PERCENTAGE"
      ? (product.sellingPrice * product.discountValue) / 100
      : product.discountValue;
  const finalPrice = Math.max(0, product.sellingPrice - discountAmount);

  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.images || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Top Bar ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD.PRODUCTS)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Products
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-semibold truncate max-w-xs">{product.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD.PRODUCT_EDIT(String(id)))}
            className="gap-2 shadow-sm"
          >
            <Pencil className="w-4 h-4" /> Edit Product
          </Button>
        </div>
      </div>

      {/* ── Page Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

          {/* ── Hero Header ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  {product.name}
                </h1>
                <Badge
                  className="px-3 py-1 text-sm font-semibold shadow-sm"
                  variant={product.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {product.status}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Tag className="w-3.5 h-3.5" />
                SKU: <span className="font-mono text-foreground/80">{product.sku}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
              <Eye className="w-4 h-4" />
              <span className="font-semibold text-foreground">{product.viewCount}</span> views
            </div>
          </div>

          {/* ── Stat Cards ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BarChart2 className="w-4 h-4" />}
              label="Final Price"
              value={`$${finalPrice.toFixed(2)}`}
              sub={product.discountValue > 0 ? (
                <span className="line-through text-muted-foreground/60">${product.sellingPrice.toFixed(2)}</span>
              ) : null}
            />
            <StatCard
              icon={<ShoppingCart className="w-4 h-4" />}
              label="Stock"
              value={
                <span className={product.quantity <= product.minStock ? "text-destructive" : ""}>
                  {product.quantity}
                </span>
              }
              sub={product.quantity <= product.minStock ? "⚠ Low stock" : `Min: ${product.minStock}`}
            />
            <StatCard
              icon={<Tag className="w-4 h-4" />}
              label="Cost Price"
              value={`$${product.costPrice.toFixed(2)}`}
            />
            <StatCard
              icon={<Package className="w-4 h-4" />}
              label="Variants"
              value={product.variants?.length || 0}
              sub={`${product.options?.length || 0} option types`}
            />
          </div>

          {/* ── Tabs ────────────────────────────────────────────────────────── */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-12 bg-muted/50 p-1.5 rounded-xl">
              <TabsTrigger value="overview" className="flex-1 h-full rounded-lg transition-all gap-2">
                <Info className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex-1 h-full rounded-lg transition-all gap-2">
                <Settings2 className="w-4 h-4" /> Variants & Options
              </TabsTrigger>
              <TabsTrigger value="related" className="flex-1 h-full rounded-lg transition-all gap-2">
                <Link2 className="w-4 h-4" /> Related Products
              </TabsTrigger>
            </TabsList>

            {/* ── Overview ─────────────────────────────────────────────────── */}
            <TabsContent value="overview" className="mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-square w-full bg-muted/20 border border-muted-foreground/10 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center group">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground/40">
                        <ImageIcon className="w-20 h-20 mb-3 stroke-[1]" />
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMainImage(img)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                            mainImage === img
                              ? "border-primary shadow-md"
                              : "border-transparent hover:border-primary/40"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Panel */}
                <div className="space-y-8">
                  {/* Pricing */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                    <div className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-2">
                      Selling Price
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black">${finalPrice.toFixed(2)}</span>
                      {product.discountValue > 0 && (
                        <span className="text-xl text-muted-foreground line-through">
                          ${product.sellingPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.discountValue > 0 && (
                      <Badge variant="destructive" className="mt-3 font-semibold">
                        {product.discountType === "PERCENTAGE"
                          ? `${product.discountValue}% OFF`
                          : `$${product.discountValue} OFF`}
                      </Badge>
                    )}
                  </div>

                  {/* Stock Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-muted-foreground flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Stock Level
                      </span>
                      <span className="font-bold">{product.quantity} units</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          product.quantity <= product.minStock ? "bg-destructive" : "bg-primary"
                        }`}
                        style={{
                          width: `${Math.min(100, (product.quantity / Math.max(product.minStock * 3, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    {product.quantity <= product.minStock && (
                      <p className="text-xs text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Low stock (Min: {product.minStock})
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <Layers className="w-3.5 h-3.5" />, label: "Category", value: product.category?.name || "None" },
                      { icon: <Package className="w-3.5 h-3.5" />, label: "Brand", value: product.brand?.name || "None" },
                      { icon: <Building2 className="w-3.5 h-3.5" />, label: "Supplier", value: product.supplier?.name || "None" },
                      { icon: <Truck className="w-3.5 h-3.5" />, label: "Cost Price", value: `$${product.costPrice.toFixed(2)}` },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="bg-muted/20 rounded-xl border p-3 space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                          {icon} {label}
                        </div>
                        <div className="text-sm font-semibold truncate">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground italic border-t pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Created: {dateTimeFormat(product.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Updated: {dateTimeFormat(product.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="w-4 h-4" /> Description
                </h3>
                <div className="text-sm leading-relaxed text-foreground/80 bg-muted/10 p-6 rounded-2xl border min-h-[100px]">
                  {product.description || (
                    <span className="italic opacity-50">No description provided.</span>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ── Variants & Options ───────────────────────────────────────── */}
            <TabsContent value="variants" className="mt-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Options */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Product Options
                  </h3>
                  <Badge variant="outline">{product.options?.length || 0} options</Badge>
                </div>
                {product.options && product.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.options.map((opt, idx) => (
                      <div key={idx} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-sm mb-3">{opt.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((val, vIdx) => (
                            <Badge key={vIdx} variant="secondary" className="px-3 py-1 font-medium">
                              {val}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-2xl text-muted-foreground text-sm">
                    No product options defined.
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Variant Configurations
                  </h3>
                  <Badge variant="outline">{product.variants?.length || 0} variants</Badge>
                </div>
                {product.variants && product.variants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {product.variants.map((v, idx) => (
                      <div
                        key={v._id || idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card border rounded-2xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{v.variantName || `Variant ${idx + 1}`}</span>
                            <Badge
                              variant={v.status === "ACTIVE" ? "outline" : "secondary"}
                              className="text-[10px] h-5"
                            >
                              {v.status || "ACTIVE"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            SKU: {v.sku || "N/A"}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm divide-x divide-border">
                          <div className="flex flex-col items-end pr-6">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stock</span>
                            <span className={`text-lg font-bold ${v.stockQuantity === 0 ? "text-destructive" : ""}`}>
                              {v.stockQuantity}
                            </span>
                          </div>
                          <div className="flex flex-col items-end pl-6">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Add. Price</span>
                            <span className="text-lg font-bold text-green-600">
                              +${(v.additionalPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-2xl text-muted-foreground text-sm">
                    No variants configured.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Related Products ─────────────────────────────────────────── */}
            <TabsContent value="related" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Related Products
                </h3>
                <Badge variant="outline">{product.relatedProducts?.length || 0} linked</Badge>
              </div>

              {product.relatedProducts && product.relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.relatedProducts.map((rel, idx) => {
                    const relId = typeof rel === "object" && rel ? rel.id : rel;
                    const relName = typeof rel === "object" && rel ? rel.name : `Product ID: ${rel}`;
                    const relSku = typeof rel === "object" && rel ? rel.sku : null;
                    const relImage = typeof rel === "object" && rel ? rel.imageUrl : null;
                    const relStatus = typeof rel === "object" && rel ? rel.status : null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String(relId)))}
                        className="group text-left p-4 border rounded-2xl flex gap-4 items-center bg-card hover:bg-muted/30 hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="w-16 h-16 bg-muted rounded-xl shrink-0 overflow-hidden flex items-center justify-center border">
                          {relImage ? (
                            <img src={relImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 gap-1">
                          <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {relName}
                          </span>
                          {relSku && (
                            <span className="text-xs font-mono text-muted-foreground truncate">
                              {relSku}
                            </span>
                          )}
                          {relStatus && (
                            <Badge
                              variant={relStatus === "ACTIVE" ? "default" : "secondary"}
                              className="w-fit text-[10px]"
                            >
                              {relStatus}
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10 rounded-2xl border border-dashed">
                  <Link2 className="w-14 h-14 mb-4 opacity-20 stroke-[1]" />
                  <p className="text-base font-medium">No related products linked.</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Edit this product to add related items.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        itemName={product.name}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
