"use client";

import React, { useCallback, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  X,
  Tag,
  DollarSign,
  Layers,
  Link2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const optionSchema = z.object({
  name: z.string().min(1, "Attribute name is required (e.g. Size, Color)"),
  values: z.array(z.string().min(1)).min(1, "At least one value is required"),
});

const variantSchema = z.object({
  variantName: z.string().optional(),
  sku: z.string().optional(),
  optionValues: z.array(z.string()),
  stockQuantity: z.number().min(0, "Must be ≥ 0"),
  additionalPrice: z.number().min(0, "Must be ≥ 0"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0, "Must be ≥ 0"),
});

const relatedProductSchema = z.object({
  productId: z.number().min(1, "Product ID is required"),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: z.any().nullable(),
  supplier: z.any().nullable(),
  brand: z.any().nullable(),
  costPrice: z.number().min(0, "Must be ≥ 0"),
  sellingPrice: z.number().min(0, "Must be ≥ 0"),
  quantity: z.number().min(0, "Must be ≥ 0"),
  minStock: z.number().min(0, "Must be ≥ 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0, "Must be ≥ 0"),
  options: z.array(optionSchema),
  variants: z.array(variantSchema),
  relatedProducts: z.array(relatedProductSchema),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cartesian(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]],
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "info", label: "Basic Info", icon: Tag },
  { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
  { id: "variants", label: "Options & Variants", icon: Layers },
  { id: "related", label: "Related", icon: Link2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
  isSubmitting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
  isSubmitting = false,
}: CreateProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("info");

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

  // ── Field arrays ────────────────────────────────────────────────────────────

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

  // ── Generate variants ────────────────────────────────────────────────────────

  const generateVariants = useCallback(() => {
    const options = form.getValues("options");
    const valid = options.filter((o) => o.name && o.values.length > 0);
    if (!valid.length) return;
    const combos = cartesian(valid.map((o) => o.values));
    replaceVariants(
      combos.map((combo) => ({
        variantName: combo.join(" / "),
        sku: "",
        optionValues: combo,
        stockQuantity: 0,
        additionalPrice: 0,
        discountType: "PERCENTAGE" as const,
        discountValue: 0,
      })),
    );
    setActiveTab("variants");
  }, [form, replaceVariants]);

  // ── Option value helpers ─────────────────────────────────────────────────────

  const handleOptionValuesInput = (index: number, raw: string) => {
    const values = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    updateOption(index, { ...form.getValues(`options.${index}`), values });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      categoryId: values.category?.id ?? null,
      supplierId: values.supplier?.id ?? null,
      brandId: values.brand?.id ?? null,
      variants: values.variants.map((v) => ({
        ...v,
        discountType: v.discountType || "PERCENTAGE",
        discountValue: v.discountValue || 0,
      })),
      relatedProducts: values.relatedProducts.map((p) => p.productId),
    };
    onSuccess?.(payload);
  };

  const handleClose = () => {
    form.reset();
    setActiveTab("info");
    onClose();
  };

  // ── Tab badge counts ─────────────────────────────────────────────────────────

  const variantCount = variantFields.length;
  const relatedCount = relatedFields.length;
  const optionCount = optionFields.length;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* ── FIXED HEADER ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-6 pt-5 pb-0 border-b bg-background">
          <div className="mb-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Create New Product
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Fill in the details across the tabs below, then save.
            </p>
          </div>

          {/* Tab bar — flush to the border-b of the header */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
          >
            <TabsList className="h-auto bg-transparent p-0 gap-0 w-full justify-start rounded-none border-0">
              {TABS.map(({ id, label, icon: Icon }) => {
                const count =
                  id === "variants"
                    ? variantCount + optionCount
                    : id === "related"
                      ? relatedCount
                      : undefined;
                return (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1",
                      "text-sm font-medium text-muted-foreground",
                      "hover:text-foreground transition-colors",
                      "data-[state=active]:border-primary data-[state=active]:text-foreground",
                      "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {count !== undefined && count > 0 && (
                      <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0 min-w-[18px] h-[18px]">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* ── SCROLLABLE BODY ─────────────────────────────────────────── */}
            <Form {...form}>
              <form
                id="create-product-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* ── TAB: Basic Info ─────────────────────────────────────── */}
                <TabsContent
                  value="info"
                  className="flex-1 min-h-0 overflow-y-auto mt-0 h-[calc(90vh-180px)]"
                >
                  <div className="space-y-5 px-6 py-5">
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
                            <FormLabel>SKU *</FormLabel>
                            <FormControl>
                              <Input placeholder="PROD-XL-001" {...field} />
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
                                rows={3}
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
                              <FormLabel className="text-base">
                                Active
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Make this product instantly available.
                              </p>
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
                  </div>
                </TabsContent>

                {/* ── TAB: Pricing & Stock ─────────────────────────────────── */}
                <TabsContent
                  value="pricing"
                  className="flex-1 min-h-0 overflow-y-auto mt-0 h-[calc(90vh-180px)]"
                >
                  <div className="space-y-6 px-6 py-5">
                    {/* Prices & Stock */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Prices & Inventory
                      </h3>
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
                    </div>

                    {/* Discount */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Discount
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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
                  </div>
                </TabsContent>

                {/* ── TAB: Options & Variants ──────────────────────────────── */}
                <TabsContent
                  value="variants"
                  className="flex-1 min-h-0 overflow-y-auto mt-0 h-[calc(90vh-180px)]"
                >
                  <div className="space-y-6 px-6 py-5">
                    {/* Options */}
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">
                            Product Options
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            e.g. <em>Size → S, M, L</em> or{" "}
                            <em>Color → Red, Blue</em>
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendOption({ name: "", values: [] })}
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Add Option
                        </Button>
                      </div>

                      {optionFields.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-3">
                          No options added. Product will be sold as a single
                          item.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {optionFields.map((optField, idx) => {
                            const currentValues =
                              form.watch(`options.${idx}.values`) ?? [];
                            return (
                              <div
                                key={optField.id}
                                className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-start rounded-md border bg-background p-3"
                              >
                                <FormField
                                  control={form.control}
                                  name={`options.${idx}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Label className="text-xs text-muted-foreground">
                                        Attribute
                                      </Label>
                                      <Input
                                        placeholder="Size / Color"
                                        {...field}
                                        className="h-8"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormItem>
                                  <Label className="text-xs text-muted-foreground">
                                    Values (comma-separated)
                                  </Label>
                                  <Input
                                    placeholder="S, M, L"
                                    defaultValue={currentValues.join(", ")}
                                    className="h-8"
                                    onBlur={(e) =>
                                      handleOptionValuesInput(
                                        idx,
                                        e.target.value,
                                      )
                                    }
                                    onChange={(e) =>
                                      handleOptionValuesInput(
                                        idx,
                                        e.target.value,
                                      )
                                    }
                                  />
                                  {currentValues.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {currentValues.map((v, vi) => (
                                        <Badge
                                          key={vi}
                                          variant="secondary"
                                          className="text-xs gap-1 h-5"
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
                                            <X className="w-2.5 h-2.5" />
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
                                    className="text-destructive hover:text-destructive h-8 w-8"
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
                          className="w-full gap-2 mt-1"
                          onClick={generateVariants}
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Variants from Options
                        </Button>
                      )}
                    </div>

                    {/* Variants */}
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">Variants</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Set stock &amp; price per combination.
                          </p>
                        </div>
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
                          <Plus className="w-4 h-4 mr-1.5" /> Add Manual
                        </Button>
                      </div>

                      {variantFields.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-4">
                          No variants yet. Add options above and click{" "}
                          <strong>Generate</strong>, or add manually.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-muted-foreground border-b">
                                <th className="pb-2 font-medium">Variant</th>
                                <th className="pb-2 font-medium">SKU</th>
                                <th className="pb-2 font-medium">Stock</th>
                                <th className="pb-2 font-medium">+Price</th>
                                <th className="pb-2 font-medium">Disc.</th>
                                <th className="pb-2 font-medium">Value</th>
                                <th className="pb-2" />
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {variantFields.map((vField, vIdx) => {
                                const label =
                                  form.watch(`variants.${vIdx}.variantName`) ||
                                  form
                                    .watch(`variants.${vIdx}.optionValues`)
                                    ?.join(" / ") ||
                                  `Variant ${vIdx + 1}`;
                                return (
                                  <tr key={vField.id} className="align-middle">
                                    <td className="py-2 pr-2 min-w-[130px]">
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
                                    <td className="py-2 pr-2 min-w-[110px]">
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
                                    <td className="py-2 pr-2 min-w-[90px]">
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
                                    <td className="py-2 pr-2 min-w-[90px]">
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
                                    <td className="py-2 pr-2 min-w-[100px]">
                                      <FormField
                                        control={form.control}
                                        name={`variants.${vIdx}.discountType`}
                                        render={({ field }) => (
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
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
                                    <td className="py-2 pr-2 min-w-[80px]">
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
                                    <td className="py-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive h-8 w-8"
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
                  </div>
                </TabsContent>

                {/* ── TAB: Related Products ────────────────────────────────── */}
                <TabsContent
                  value="related"
                  className="flex-1 min-h-0 overflow-y-auto mt-0 h-[calc(90vh-180px)]"
                >
                  <div className="space-y-4 px-6 py-5">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Link existing products to show as recommendations.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendRelated({ productId: 0 })}
                      >
                        <Plus className="w-4 h-4 mr-1.5" /> Link Product
                      </Button>
                    </div>

                    {relatedFields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center gap-2 rounded-lg border border-dashed">
                        <Link2 className="w-8 h-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          No related products linked yet.
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => appendRelated({ productId: 0 })}
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Add one
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {relatedFields.map((rField, rIdx) => (
                          <div key={rField.id} className="flex gap-2 items-end">
                            <FormField
                              control={form.control}
                              name={`relatedProducts.${rIdx}.productId`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Product ID
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Enter existing product ID..."
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => removeRelated(rIdx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>

        {/* ── FIXED FOOTER ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 px-6 py-4 border-t bg-card">
          {/* Tab stepper hints */}
          <div className="flex items-center gap-1">
            {TABS.map(({ id }, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  activeTab === id
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <div className="flex gap-2">
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
              form="create-product-form"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create &amp; Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
