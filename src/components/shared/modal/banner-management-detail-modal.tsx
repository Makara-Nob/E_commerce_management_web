"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BannerModel } from "@/redux/features/banners/store/models/response/banner-response";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Link as LinkIcon, Calendar, Type, SortAsc, Activity } from "lucide-react";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import Image from "next/image";

interface BannerManagementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: BannerModel | null;
}

export function BannerManagementDetailModal({
  isOpen,
  onClose,
  banner,
}: BannerManagementDetailModalProps) {
  if (!banner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] p-0 overflow-hidden font-primary">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-xl">Banner Details</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed information for banner ID: {banner.id}
                </p>
             </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Banner Preview Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Media Preview
              </h3>
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border bg-muted shadow-sm">
                {banner.imageUrl ? (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" /> Title
                  </h3>
                  <p className="text-base font-medium text-foreground">{banner.title}</p>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Description
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">
                    {banner.description || <span className="text-muted-foreground italic">No description provided</span>}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" /> Link URL
                  </h3>
                  {banner.linkUrl ? (
                    <a 
                        href={banner.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline break-all block"
                    >
                        {banner.linkUrl}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No link assigned</span>
                  )}
                </div>

                <div className="flex gap-8">
                    <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <SortAsc className="w-3.5 h-3.5" /> Display Order
                        </h3>
                        <Badge variant="outline" className="font-mono text-sm px-3">
                            {banner.displayOrder}
                        </Badge>
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Status
                        </h3>
                        <Badge
                            variant={banner.status === "ACTIVE" ? "default" : "secondary"}
                            className={
                                banner.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }
                        >
                            {banner.status}
                        </Badge>
                    </div>
                </div>
              </div>
            </div>

            {/* Timestamps Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t font-mono">
               <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {banner.createdAt ? dateTimeFormat(banner.createdAt) : "---"}</span>
               </div>
               <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {banner.updatedAt ? dateTimeFormat(banner.updatedAt) : "---"}</span>
               </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
