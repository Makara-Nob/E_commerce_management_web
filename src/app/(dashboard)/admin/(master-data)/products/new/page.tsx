"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { AppToast } from "@/components/shared/common/app-toast";
import { createProductWithVariantsService } from "@/services/dashboard/product/product.service";
import { ProductFormContent, ProductFormValues } from "@/components/shared/form/product-form-content";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProductFormValues) => {
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

      const created = await createProductWithVariantsService(payload as any);
      AppToast({ type: "success", message: "Product created successfully" });
      router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String((created as any)._id ?? (created as any).id)));
    } catch (error: any) {
      AppToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur sticky top-0 z-30">
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
          <div className="flex items-center gap-2">
            <PackagePlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">New Product</span>
          </div>
        </div>
      </div>

      {/* ── Page Body ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="px-6 py-8 border-b">
            <h1 className="text-3xl font-extrabold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill in the details below to create a new product in your catalogue.
            </p>
          </div>

          <ProductFormContent
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.push(ROUTES.DASHBOARD.PRODUCTS)}
          />
        </div>
      </div>
    </div>
  );
}
