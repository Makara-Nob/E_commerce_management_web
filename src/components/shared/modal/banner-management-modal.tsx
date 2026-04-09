"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, ImagePlus, Type, AlignLeft, Link, SortAsc, Activity } from "lucide-react";
import { 
  bannerSchema, 
  BannerFormData 
} from "@/models/dashboard/master-data/banner.schema";
import { BannerModel } from "@/redux/features/banners/store/models/response/banner-response";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUploader } from "@/components/shared/upload/image-uploader";

interface BannerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  banner: BannerModel | null;
  isSubmitting: boolean;
}

export function BannerManagementModal({
  isOpen,
  onClose,
  onSubmit,
  banner,
  isSubmitting,
}: BannerManagementModalProps) {
  const isEdit = !!banner;

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema) as any,
    defaultValues: {

      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      displayOrder: 0,
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (banner && isOpen) {
      form.reset({
        title: banner.title,
        description: banner.description || "",
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl || "",
        displayOrder: banner.displayOrder,
        status: banner.status as any || "ACTIVE",
      });
    } else if (isOpen) {
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        displayOrder: 0,
        status: "ACTIVE",
      });
    }
  }, [banner, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] p-0 overflow-hidden font-primary">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <ImagePlus className="w-5 h-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-xl">
                  {isEdit ? "Update Banner" : "Create New Banner"}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEdit ? "Modify existing banner details" : "Add a new promotional banner to your storefront"}
                </p>
             </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-6 px-6 py-6">
              {/* Image Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                   <ImagePlus className="w-4 h-4" /> Banner Media
                </h3>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image *</FormLabel>
                      <FormControl>
                         <ImageUploader
                            single
                            value={field.value ? [field.value] : []}
                            onChange={(urls) => field.onChange(urls[0] || "")}
                            folder="banners"
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* General Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary pt-2 border-t mt-2">
                   <Type className="w-4 h-4" /> Content Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Title *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Type className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Extra 20% Off All Electronics" className="pl-9" {...field} />
                          </div>
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
                          <div className="relative flex">
                            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                                placeholder="Limited time offer on all premium electronics products..." 
                                className="pl-9 resize-none min-h-[80px]" 
                                {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4 pt-2 border-t mt-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                   <Activity className="w-4 h-4" /> Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="linkUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="https://yourstore.com/electronics" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <SortAsc className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-9" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active (Live)</SelectItem>
                            <SelectItem value="INACTIVE">Inactive (Draft)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 border-t px-6 py-4 bg-muted/20">
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
            disabled={isSubmitting || (!form.formState.isDirty && isEdit)}
            className="min-w-[140px]"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
