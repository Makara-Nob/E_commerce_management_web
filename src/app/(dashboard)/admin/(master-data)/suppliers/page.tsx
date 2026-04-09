"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSuppliersState } from "@/redux/features/master-data/store/state/supplier-state";
import {
  fetchAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/redux/features/master-data/store/thunks/supplier-thunks";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/master-data/store/slice/supplier-slice";
import { SupplierModel } from "@/models/dashboard/master-data/supplier/supplier.model";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createSupplierTableColumns } from "@/constants/AppResource/table/master-data/supplier-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { SupplierFormModal } from "@/components/shared/modal/supplier-form-modal";
import { SupplierDetailModal } from "@/components/shared/modal/supplier-detail-modal";
import { Truck } from "lucide-react";
import { toast } from "sonner";

export default function SuppliersPage() {
  const { 
    suppliers, 
    isLoading, 
    pagination, 
    filters,
    operations,
    dispatch 
  } = useSuppliersState();

  const searchParams = useSearchParams();

  // Local State for Search
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.SUPPLIERS,
    defaultPageSize: pagination.pageSize,
  });

  // Action Modals State
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    supplier: SupplierModel | null;
  }>({
    isOpen: false,
    supplier: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    supplier: SupplierModel | null;
  }>({
    isOpen: false,
    supplier: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    supplier: SupplierModel | null;
  }>({
    isOpen: false,
    supplier: null,
  });

  // Sync search input with Redux when debounced changes
  useEffect(() => {
    dispatch(setSearchFilter(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Initial redirect if no pageNo in URL
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    } else {
      dispatch(setPageNo(parseInt(pageParam, 10)));
    }
  }, [searchParams, updateUrlWithPage, dispatch]);

  const refreshSuppliers = useCallback(() => {
    dispatch(fetchAllSuppliers({
      pageNo: filters.pageNo,
      pageSize: pagination.pageSize,
      search: filters.search
    }));
  }, [dispatch, filters.pageNo, pagination.pageSize, filters.search]);

  useEffect(() => {
    refreshSuppliers();
  }, [refreshSuppliers]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFormSubmit = async (values: any) => {
    try {
      if (formModal.supplier) {
        await dispatch(updateSupplier({ id: formModal.supplier.id, data: values })).unwrap();
        AppToast({ type: "success", message: "Supplier updated successfully" });
      } else {
        await dispatch(createSupplier(values)).unwrap();
        AppToast({ type: "success", message: "Supplier created successfully" });
      }
      setFormModal({ isOpen: false, supplier: null });
    } catch (error: any) {
      toast.error(error || "Failed to save supplier");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteModal.supplier?.id) return;
    try {
      await dispatch(deleteSupplier(deleteModal.supplier.id)).unwrap();
      AppToast({ type: "success", message: `Supplier "${deleteModal.supplier.name}" removed` });
      
      // If we deleted the last item on a page, go back
      if (suppliers.length === 1 && filters.pageNo > 1) {
        handlePageChange(filters.pageNo - 1);
      } else {
        refreshSuppliers();
      }
    } catch (error: any) {
      toast.error(error || "Failed to remove supplier");
    } finally {
      setDeleteModal({ isOpen: false, supplier: null });
    }
  };

  const tableColumns = useMemo(() => 
    createSupplierTableColumns({
      data: {
        ...pagination
      },
      handlers: {
        handleViewSupplier: (supplier) => setDetailModal({ isOpen: true, supplier }),
        handleEditSupplier: (supplier) => setFormModal({ isOpen: true, supplier }),
        handleDelete: (supplier) => setDeleteModal({ isOpen: true, supplier }),
      },
    }), [suppliers, pagination]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Master Data", href: "" },
            { label: "Suppliers", href: ROUTES.DASHBOARD.SUPPLIERS },
          ]}
          title="Supplier Management"
          searchValue={search}
          searchPlaceholder="Search suppliers by name..."
          buttonIcon={<Truck className="w-4 h-4" />}
          buttonText="Add Supplier"
          onSearchChange={handleSearchChange}
          openModal={() => setFormModal({ isOpen: true, supplier: null })}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={suppliers}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No suppliers found. Start by adding one!"
            getRowKey={(s) => s.id.toString()}
            currentPage={pagination.pageNo}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <SupplierFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, supplier: null })}
        onSubmit={onFormSubmit}
        supplier={formModal.supplier}
        isSubmitting={operations.isCreating || operations.isUpdating}
      />

      <SupplierDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, supplier: null })}
        supplier={detailModal.supplier}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, supplier: null })}
        onDelete={onConfirmDelete}
        title="Remove Supplier"
        description="Are you sure you want to remove this supplier? This action cannot be undone."
        itemName={deleteModal.supplier?.name || "---"}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
