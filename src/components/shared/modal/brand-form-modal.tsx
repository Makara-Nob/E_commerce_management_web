"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { BrandModel } from "@/models/dashboard/master-data/brand/brand.model";
import { ImageUploader } from "@/components/shared/upload/image-uploader";

const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  brand?: BrandModel | null;
  isSubmitting?: boolean;
}

export function BrandFormModal({
  isOpen,
  onClose,
  onSubmit,
  brand,
  isSubmitting = false,
}: BrandFormModalProps) {
  const isEdit = !!brand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || "",
        logoUrl: brand.logoUrl || brand.imageUrl || "",
        status: (brand.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        logoUrl: "",
        status: "ACTIVE",
      });
    }
  }, [brand, form, isOpen]);

  const handleSubmit = async (values: BrandFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
          <DialogTitle>
            {isEdit ? "Edit Brand" : "Create New Brand"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5 py-4"
            >
              {/* Logo Upload */}
              <div className="space-y-2">
                <FormLabel>Brand Logo</FormLabel>
                <ImageUploader
                  single
                  value={form.watch("logoUrl") ? [form.watch("logoUrl")!] : []}
                  onChange={(urls) => form.setValue("logoUrl", urls[0] || "")}
                  folder="brands"
                  className="w-full"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  Recommended size: 200x200px. PNG or JPG.
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Samsung, Apple, Nike"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the brand..."
                        className="resize-none min-h-[80px]"
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Visible in store when active
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "ACTIVE"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "ACTIVE" : "INACTIVE")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
