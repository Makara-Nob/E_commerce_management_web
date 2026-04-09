"use client";

import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import { OrderModel } from "@/redux/features/orders/store/models/response/order-response";
import { indexDisplay } from "@/utils/common/common";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
    Truck, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ChevronRight,
    Eye
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShippingTableHandlers {
  handleView: (order: OrderModel) => void;
  handleUpdateStatus: (order: OrderModel, status: string) => void;
}

interface ShippingTableOptions {
  data: {
    pageNo?: number;
    pageSize?: number;
  };
  handlers: ShippingTableHandlers;
}

export const createShippingTableColumns = ({
  data,
  handlers,
}: ShippingTableOptions): TableColumn<OrderModel>[] => {
  const { handleView, handleUpdateStatus } = handlers;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-3 h-3" />;
      case 'CONFIRMED': return <CheckCircle2 className="w-3 h-3" />;
      case 'SHIPPED': return <Truck className="w-3 h-3" />;
      case 'DELIVERED': return <CheckCircle2 className="w-3 h-3" />;
      case 'CANCELLED': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case 'CONFIRMED': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'SHIPPED': return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case 'DELIVERED': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'CANCELLED': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return [
    {
      key: "index",
      label: "#",
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "invoice",
      label: "Invoice #",
      className: "min-w-[150px]",
      render: (item) => (
        <span className="font-mono text-xs font-bold uppercase tracking-tight">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      className: "min-w-[180px]",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{item.user?.fullName || "Guest User"}</span>
          <span className="text-[11px] text-muted-foreground">{item.user?.phone || "No phone"}</span>
        </div>
      ),
    },
    {
        key: "amount",
        label: "Total Amount",
        className: "w-[120px]",
        render: (item) => (
          <span className="font-semibold text-primary">
            ${item.netAmount.toFixed(2)}
          </span>
        ),
      },
    {
      key: "date",
      label: "Order Date",
      className: "w-[150px]",
      render: (item) => (
        <span className="text-[11px] text-muted-foreground">
          {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-[130px]",
      render: (item) => (
        <Badge
          variant="outline"
          className={`flex items-center gap-1.5 px-2 py-0.5 capitalize ${getStatusColor(item.status)}`}
        >
          {getStatusIcon(item.status)}
          <span className="text-[10px] font-bold">{item.status.toLowerCase()}</span>
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[140px]",
      render: (item) => (
        <div className="flex items-center gap-2">
            <ActionButton
                icon={<Eye className="h-4 w-4" />}
                tooltip="View Items"
                onClick={() => handleView(item)}
            />
          
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        disabled={item.status === 'CONFIRMED'}
                        onClick={() => handleUpdateStatus(item, 'CONFIRMED')}
                    >
                        Mark as Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        disabled={item.status === 'SHIPPED'}
                        onClick={() => handleUpdateStatus(item, 'SHIPPED')}
                        className="text-purple-600 focus:text-purple-600"
                    >
                        Mark as Shipped 🚚
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        disabled={item.status === 'DELIVERED'}
                        onClick={() => handleUpdateStatus(item, 'DELIVERED')}
                        className="text-emerald-600 focus:text-emerald-600"
                    >
                        Mark as Delivered 📦
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        disabled={item.status === 'CANCELLED'}
                        onClick={() => handleUpdateStatus(item, 'CANCELLED')}
                        className="text-destructive focus:text-destructive"
                    >
                        Cancel Order
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ),
    },
  ];
};
