"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { AppToast } from "@/components/shared/common/app-toast";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import {
  getProductByIdService,
  updateProductService,
} from "@/services/dashboard/product/product.service";
import { ProductFormContent, ProductFormValues } from "@/components/shared/form/product-form-content";

function EditProductSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6">
      <Skeleton className="h-10 w-1/2 rounded-xl" />
      <Skeleton className="h-5 w-1/3 rounded" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    getProductByIdService(id)
      .then(setProduct)
      .catch(() => setError("Failed to load product."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        imageUrl: values.imageUrl || undefined,
        images: (values.images || []).filter(Boolean),
        categoryId: values.category?.id ?? null,
        supplierId: values.supplier?.id ?? null,
        brandId: values.brand?.id ?? null,
        variants: values.variants.map((v) => ({
          ...v,
          discountType: v.discountType || "PERCENTAGE",
          discountValue: v.discountValue || 0,
        })),
        relatedProducts: values.relatedProducts
          .map((p) => p.product?.id)
          .filter(Boolean),
      };

      await updateProductService(product.id, payload as any);
      AppToast({ type: "success", message: "Product updated successfully" });
      router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String(product.id)));
    } catch (error: any) {
      AppToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <EditProductSkeleton />;

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

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String(product.id)))}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {product.name}
          </Button>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Edit</span>
          </div>
        </div>
      </div>

      {/* ── Page Body ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="px-6 py-8 border-b">
            <h1 className="text-3xl font-extrabold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Updating <span className="font-semibold text-foreground">{product.name}</span>
              <span className="ml-2 font-mono text-xs border rounded px-1.5 py-0.5 bg-muted">{product.sku}</span>
            </p>
          </div>

          <ProductFormContent
            product={product}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String(product.id)))}
          />
        </div>
      </div>
    </div>
  );
}
