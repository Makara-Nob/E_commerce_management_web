"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ComboboxCategory } from "@/components/shared/combo-box/combobox-category";
import { ComboboxBrand } from "@/components/shared/combo-box/combobox-brand";
import { ComboboxSupplier } from "@/components/shared/combo-box/combobox-supplier";
import { ComboboxProduct } from "@/components/shared/combo-box/combobox-product";
import { Loader2, Plus, Trash2, Sparkles, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import {
  createProductWithVariantsService,
  updateProductService,
  getProductByIdService,
} from "@/services/dashboard/product/product.service";
import { AppToast } from "@/components/shared/common/app-toast";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const optionSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  values: z.array(z.string().min(1)).min(1, "At least one value is required"),
});

const variantSchema = z.object({
  variantName: z.string().optional(),
  sku: z.string().optional(),
  optionValues: z.array(z.string()),
  stockQuantity: z.number().min(0, "Must be >= 0"),
  additionalPrice: z.number().min(0, "Must be >= 0"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0, "Must be >= 0"),
});

const relatedProductSchema = z.object({
  product: z.any().nullable().refine((p) => p !== null, "Product is required"),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: z.any().nullable(),
  supplier: z.any().nullable(),
  brand: z.any().nullable(),
  costPrice: z.number().min(0, "Must be >= 0"),
  sellingPrice: z.number().min(0, "Must be >= 0"),
  quantity: z.number().min(0, "Must be >= 0"),
  minStock: z.number().min(0, "Must be >= 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0, "Must be >= 0"),
  options: z.array(optionSchema),
  variants: z.array(variantSchema),
  relatedProducts: z.array(relatedProductSchema),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Cartesian product helper ─────────────────────────────────────────────────
function cartesian(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]],
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: ProductModel | null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      category: null,
      supplier: null,
      brand: null,
      costPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      minStock: 0,
      status: "ACTIVE",
      discountType: "PERCENTAGE",
      discountValue: 0,
      options: [],
      variants: [],
      relatedProducts: [],
    },
  });

  // ── Sync form with product prop (Fetch full detail if in edit mode) ────────
  useEffect(() => {
    const fetchFullProduct = async (id: string) => {
      setIsLoading(true);
      try {
        const fullProduct = await getProductByIdService(id);
        form.reset({
          name: fullProduct.name,
          sku: fullProduct.sku,
          description: fullProduct.description || "",
          category: fullProduct.category || null,
          supplier: fullProduct.supplier || null,
          brand: fullProduct.brand || null,
          costPrice: fullProduct.costPrice,
          sellingPrice: fullProduct.sellingPrice,
          quantity: fullProduct.quantity,
          minStock: fullProduct.minStock,
          status: (fullProduct.status as any) || "ACTIVE",
          discountType: fullProduct.discountType || "PERCENTAGE",
          discountValue: fullProduct.discountValue || 0,
          options: fullProduct.options || [],
          variants: (fullProduct.variants as any) || [],
          relatedProducts: (fullProduct.relatedProducts || []).map((p: any) => ({
            product: p,
          })),
        });
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        AppToast({ type: "error", message: "Failed to load product details" });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      setActiveTab("basic");
      if (product) {
        // If we have a product object (likely from a list), fetch its full details
        const productId = product.id;
        if (productId) {
          fetchFullProduct(productId);
        }
      } else {
        form.reset({
          name: "",
          sku: "",
          description: "",
          category: null,
          supplier: null,
          brand: null,
          costPrice: 0,
          sellingPrice: 0,
          quantity: 0,
          minStock: 0,
          status: "ACTIVE",
          discountType: "PERCENTAGE",
          discountValue: 0,
          options: [],
          variants: [],
          relatedProducts: [],
        });
      }
    }
  }, [product, isOpen, form]);

  // ── Field arrays ──────────────────────────────────────────────────────────
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    update: updateOption,
  } = useFieldArray({ control: form.control, name: "options" });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({ control: form.control, name: "variants" });

  const {
    fields: relatedFields,
    append: appendRelated,
    remove: removeRelated,
  } = useFieldArray({ control: form.control, name: "relatedProducts" });

  // ── Generate variants from options ────────────────────────────────────────
  const generateVariants = useCallback(() => {
    const options = form.getValues("options");
    const validOptions = options.filter((o) => o.name && o.values.length > 0);
    if (validOptions.length === 0) return;

    const combinations = cartesian(validOptions.map((o) => o.values));
    const generated = combinations.map((combo) => ({
      variantName: combo.join(" / "),
      sku: "",
      optionValues: combo,
      stockQuantity: 0,
      additionalPrice: 0,
      discountType: "PERCENTAGE" as const,
      discountValue: 0,
    }));

    replaceVariants(generated);
  }, [form, replaceVariants]);

  // ── Inline tag input for option values ────────────────────────────────────
  const handleOptionValuesInput = (index: number, rawInput: string) => {
    const values = rawInput
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const current = form.getValues(`options.${index}`);
    updateOption(index, { ...current, values });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { category, brand, supplier, ...v } = values;
      const payload = {
        ...v,
        categoryId: category?.id ?? null,
        supplierId: supplier?.id ?? null,
        brandId: brand?.id ?? null,
        variants: v.variants.map((variant) => ({
          ...variant,
          discountType: variant.discountType || "PERCENTAGE",
          discountValue: variant.discountValue || 0,
        })),
        relatedProducts: v.relatedProducts
          .map((p) => p.product?.id || p.product?._id)
          .filter(Boolean)
          .map(Number),
      };

      if (isEdit && product) {
        await updateProductService(product.id, payload as any);
        AppToast({ type: "success", message: "Product updated successfully" });
      } else {
        await createProductWithVariantsService(payload as any);
        AppToast({ type: "success", message: "Product created successfully" });
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      AppToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Match category modal structure: fixed header + scrollable body + fixed footer */}
      <DialogContent className="sm:max-w-[750px] flex flex-col max-h-[90vh] p-0">
        {/* ── Fixed Header ─────────────────────────────────────────────────── */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update the details for ${product?.name}.`
              : "Fill in the details below to create a new product."}
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable Body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="basic" className="flex-1">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="flex-1">
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="flex-1">
                    Variants
                  </TabsTrigger>
                  <TabsTrigger value="related" className="flex-1">
                    Related
                  </TabsTrigger>
                </TabsList>

                {/* ── Tab: Basic Info ───────────────────────────────────────── */}
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Smartphone XL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            SKU *{" "}
                            {isEdit && (
                              <span className="text-[10px] text-muted-foreground ml-1">
                                (Read-only)
                              </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PROD-XL-001"
                              {...field}
                              disabled={isEdit}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Category</FormLabel>
                          <ComboboxCategory
                            value={field.value}
                            onSelect={(item) => field.onChange(item)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Brand</FormLabel>
                          <ComboboxBrand
                            value={field.value}
                            onSelect={(item) => field.onChange(item)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem className="flex flex-col sm:col-span-2">
                          <FormLabel>Supplier</FormLabel>
                          <ComboboxSupplier
                            value={field.value}
                            onSelect={(item) => field.onChange(item)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Rich details about the product..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 sm:col-span-2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <DialogDescription>
                              Make this product instantly available.
                            </DialogDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value === "ACTIVE"}
                              onCheckedChange={(c) =>
                                field.onChange(c ? "ACTIVE" : "INACTIVE")
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ── Tab: Pricing ─────────────────────────────────────────── */}
                <TabsContent value="pricing" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price ($) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price ($) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Stock *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Alert At *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Discount sub-section */}
                  <div className="rounded-lg border p-4 space-y-4">
                    <p className="text-sm font-medium">Discount</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PERCENTAGE">
                                  Percentage (%)
                                </SelectItem>
                                <SelectItem value="FIXED">
                                  Fixed Amount ($)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ── Tab: Variants ─────────────────────────────────────────── */}
                <TabsContent value="variants" className="space-y-4 mt-0">
                  {/* Options */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Product Options</p>
                        <p className="text-xs text-muted-foreground">
                          e.g. <em>Size → S, M, L</em>
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendOption({ name: "", values: [] })}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Option
                      </Button>
                    </div>

                    {optionFields.length === 0 ? (
                      <p className="text-sm text-center text-muted-foreground py-3">
                        No options added.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {optionFields.map((optField, idx) => {
                          const currentValues =
                            form.watch(`options.${idx}.values`) ?? [];
                          return (
                            <div
                              key={optField.id}
                              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-start rounded-lg border bg-background p-3"
                            >
                              <FormField
                                control={form.control}
                                name={`options.${idx}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Label className="text-xs text-muted-foreground">
                                      Attribute Name
                                    </Label>
                                    <Input placeholder="e.g. Size" {...field} />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormItem>
                                <Label className="text-xs text-muted-foreground">
                                  Values (comma-separated)
                                </Label>
                                <Input
                                  placeholder="e.g. S, M, L"
                                  defaultValue={currentValues.join(", ")}
                                  onBlur={(e) =>
                                    handleOptionValuesInput(idx, e.target.value)
                                  }
                                />
                                {currentValues.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {currentValues.map((v, vi) => (
                                      <Badge
                                        key={vi}
                                        variant="secondary"
                                        className="text-xs gap-1"
                                      >
                                        {v}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const next = currentValues.filter(
                                              (_, i) => i !== vi,
                                            );
                                            updateOption(idx, {
                                              ...form.getValues(
                                                `options.${idx}`,
                                              ),
                                              values: next,
                                            });
                                          }}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </FormItem>
                              <div className="flex items-start pt-5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => removeOption(idx)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {optionFields.length > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full gap-2"
                        onClick={generateVariants}
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Variants
                      </Button>
                    )}
                  </div>

                  {/* Variants table */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Variants</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendVariant({
                            variantName: "",
                            sku: "",
                            optionValues: [],
                            stockQuantity: 0,
                            additionalPrice: 0,
                            discountType: "PERCENTAGE",
                            discountValue: 0,
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Manual
                      </Button>
                    </div>

                    {variantFields.length === 0 ? (
                      <p className="text-sm text-center text-muted-foreground py-3">
                        No variants yet. Add options above and click Generate.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-muted-foreground border-b italic">
                              <th className="pb-2 font-medium">Variant</th>
                              <th className="pb-2 font-medium">SKU</th>
                              <th className="pb-2 font-medium">Stock</th>
                              <th className="pb-2 font-medium">+Price</th>
                              <th className="pb-2 font-medium">Disc. Type</th>
                              <th className="pb-2 font-medium">Disc. Val</th>
                              <th className="pb-2" />
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {variantFields.map((vField, vIdx) => {
                              const label =
                                form.watch(`variants.${vIdx}.variantName`) ||
                                `V${vIdx + 1}`;
                              return (
                                <tr key={vField.id} className="align-middle">
                                  <td className="py-2 pr-3 min-w-[130px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.variantName`}
                                      render={({ field }) => (
                                        <Input
                                          placeholder={label}
                                          {...field}
                                          className="h-8"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 pr-3 min-w-[110px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.sku`}
                                      render={({ field }) => (
                                        <Input
                                          placeholder="SKU-001"
                                          {...field}
                                          className="h-8"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 pr-3 min-w-[75px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.stockQuantity`}
                                      render={({ field }) => (
                                        <Input
                                          type="number"
                                          className="h-8"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value),
                                            )
                                          }
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 pr-3 min-w-[75px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.additionalPrice`}
                                      render={({ field }) => (
                                        <Input
                                          type="number"
                                          step="0.01"
                                          className="h-8"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value),
                                            )
                                          }
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 pr-3 min-w-[110px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.discountType`}
                                      render={({ field }) => (
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="h-8">
                                              <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="PERCENTAGE">
                                              %
                                            </SelectItem>
                                            <SelectItem value="FIXED">
                                              $
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 pr-3 min-w-[75px]">
                                    <FormField
                                      control={form.control}
                                      name={`variants.${vIdx}.discountValue`}
                                      render={({ field }) => (
                                        <Input
                                          type="number"
                                          step="0.01"
                                          className="h-8"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value),
                                            )
                                          }
                                        />
                                      )}
                                    />
                                  </td>
                                  <td className="py-2 text-right">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive h-8 w-8"
                                      onClick={() => removeVariant(vIdx)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* ── Tab: Related Products ─────────────────────────────────── */}
                <TabsContent value="related" className="space-y-4 mt-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Link related products by their ID.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendRelated({ product: null })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Link Product
                    </Button>
                  </div>

                  {relatedFields.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-6 border rounded-lg">
                      No related products linked.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {relatedFields.map((rField, rIdx) => (
                        <div key={rField.id} className="flex gap-2 items-end">
                          <FormField
                            control={form.control}
                            name={`relatedProducts.${rIdx}.product`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <ComboboxProduct
                                  value={field.value}
                                  onSelect={(val) => field.onChange(val)}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="shrink-0"
                            onClick={() => removeRelated(rIdx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        {/* ── Fixed Footer ──────────────────────────────────────────────────── */}
        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-card">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
