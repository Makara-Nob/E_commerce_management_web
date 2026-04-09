"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useOrdersState } from "@/redux/features/orders/store/state/order-state";
import {
  fetchAllOrdersService,
  updateOrderStatusService,
} from "@/redux/features/orders/store/thunks/order-thunks";
import {
  setPageNo,
  setSearchFilter,
  setStatusFilter,
  clearError,
} from "@/redux/features/orders/store/slice/order-slice";
import { OrderModel } from "@/redux/features/orders/store/models/response/order-response";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createShippingTableColumns } from "@/constants/AppResource/table/shipping-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ShippingManagementPage() {
  const { 
    orders, 
    isLoading, 
    error,
    pagination, 
    filters,
    operations,
    dispatch 
  } = useOrdersState();

  const searchParams = useSearchParams();

  // Local State
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    order: OrderModel | null;
  }>({
    isOpen: false,
    order: null,
  });

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.ORDERS,
    defaultPageSize: pagination.pageSize,
  });

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(setSearchFilter(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    } else {
      dispatch(setPageNo(parseInt(pageParam, 10)));
    }
  }, [searchParams, updateUrlWithPage, dispatch]);

  const refreshData = useCallback(() => {
    dispatch(fetchAllOrdersService({
      pageNo: filters.pageNo,
      pageSize: pagination.pageSize,
      search: filters.search,
      status: filters.status,
    }));
  }, [dispatch, filters.pageNo, pagination.pageSize, filters.search, filters.status]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onUpdateStatus = async (order: OrderModel, newStatus: string) => {
    try {
      await dispatch(updateOrderStatusService({ id: order.id, status: newStatus })).unwrap();
      AppToast({ 
        type: "success", 
        message: `Order #${order.invoiceNumber} status updated to ${newStatus.toLowerCase()}` 
      });
      // Notification is sent from backend
    } catch (error: any) {
      toast.error(error || "Failed to update status");
    }
  };

  const tableColumns = useMemo(() => 
    createShippingTableColumns({
      data: {
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
      handlers: {
        handleView: (order) => setDetailModal({ isOpen: true, order }),
        handleUpdateStatus: onUpdateStatus,
      },
    }), [pagination, dispatch]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2 font-primary">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Shipping Management", href: ROUTES.DASHBOARD.ORDERS },
          ]}
          title="Shipping Management"
          searchValue={search}
          searchPlaceholder="Search invoices or customer names..."
          buttonIcon={<Truck className="w-4 h-4" />}
          buttonText="Orders"
          onSearchChange={handleSearchChange}
          showButton={false} // No "Add Order" needed here
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={orders}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No orders matching your criteria were found."
            getRowKey={(o) => o.id.toString()}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={h => handlePageChange(h)}
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={detailModal.isOpen} onOpenChange={(open) => !open && setDetailModal({ isOpen: false, order: null })}>
        <DialogContent className="sm:max-w-[600px] font-primary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Order #{detailModal.order?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          
          {detailModal.order && (
            <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Customer</p>
                        <p className="text-sm font-bold">{detailModal.order.user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{detailModal.order.user?.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Shipping Address</p>
                        <p className="text-xs text-balance line-clamp-2">{detailModal.order.shippingAddress}</p>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-3 py-2 text-left">Item</th>
                                <th className="px-3 py-2 text-center w-16">Qty</th>
                                <th className="px-3 py-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {detailModal.order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 py-2 italic text-muted-foreground">
                                        Product #{typeof item.product === 'number' ? item.product : item.product.id}
                                        {item.variantName && <span className="block text-[10px] text-primary">[{item.variantName}]</span>}
                                    </td>
                                    <td className="px-3 py-2 text-center font-medium">x{item.quantity}</td>
                                    <td className="px-3 py-2 text-right font-bold">${item.subTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-muted/30">
                            <tr className="border-t-2 font-bold">
                                <td colSpan={2} className="px-3 py-2 text-right uppercase tracking-wider text-muted-foreground">Total</td>
                                <td className="px-3 py-2 text-right text-primary text-sm">${detailModal.order.netAmount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {detailModal.order.note && (
                    <div className="bg-muted/50 p-3 rounded-md italic text-xs border-l-4 border-primary">
                         "{detailModal.order.note}"
                    </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailModal({ isOpen: false, order: null })} variant="secondary">
              Close Detail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
