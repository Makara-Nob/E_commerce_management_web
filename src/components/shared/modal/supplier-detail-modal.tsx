"use client";
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
import {
  Truck,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
} from "lucide-react";
import { SupplierModel } from "@/models/dashboard/master-data/supplier/supplier.model";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Badge } from "@/components/ui/badge";

interface SupplierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierModel | null;
}

export function SupplierDetailModal({
  isOpen,
  onClose,
  supplier,
}: SupplierDetailModalProps) {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh] p-0 font-primary">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>Supplier Details</DialogTitle>
              <DialogDescription>
                Full overview of supplier contact and account information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Supplier Name
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {supplier.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <User className="w-3 h-3" />
                    Contact Person
                  </div>
                  <p className="text-sm border rounded-lg px-3 py-2 bg-muted/30">
                    {supplier.contactPerson || "---"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Activity className="w-3 h-3" />
                    Account Status
                  </div>
                  <div>
                    <Badge
                      variant={
                        supplier.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className={
                        supplier.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-500 px-4 py-1"
                          : "px-4 py-1"
                      }
                    >
                      {supplier.status || "ACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Phone className="w-3 h-3" />
                    Phone Number
                  </div>
                  <p className="text-sm border rounded-lg px-3 py-2 bg-muted/30">
                    {supplier.phone || "---"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </div>
                  <p className="text-sm border rounded-lg px-3 py-2 bg-muted/30 truncate">
                    {supplier.email || "---"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <MapPin className="w-3 h-3" />
                  Office Address
                </div>
                <div className="text-sm border rounded-lg px-3 py-3 bg-muted/30 min-h-[60px] whitespace-pre-wrap leading-relaxed">
                  {supplier.address || "No address provided."}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  Created Date
                </div>
                <p className="text-xs">
                  {dateTimeFormat(supplier.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  Last Modified
                </div>
                <p className="text-xs">
                  {dateTimeFormat(supplier.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-card">
          <Button type="button" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
