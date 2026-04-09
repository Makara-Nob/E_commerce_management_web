"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useBrandsState } from "@/redux/features/master-data/store/state/brand-state";
import {
  fetchAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/redux/features/master-data/store/thunks/brand-thunks";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/master-data/store/slice/brand-slice";
import { BrandModel } from "@/models/dashboard/master-data/brand/brand.model";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createBrandTableColumns } from "@/constants/AppResource/table/master-data/brand-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { BrandFormModal } from "@/components/shared/modal/brand-form-modal";
import { BrandDetailModal } from "@/components/shared/modal/brand-detail-modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function BrandsPage() {
  const { 
    brands, 
    isLoading, 
    pagination, 
    filters,
    operations,
    dispatch 
  } = useBrandsState();

  const searchParams = useSearchParams();

  // Local State for Search
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BRANDS,
    defaultPageSize: pagination.pageSize,
  });

  // Action Modals State
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    brand: BrandModel | null;
  }>({
    isOpen: false,
    brand: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    brand: BrandModel | null;
  }>({
    isOpen: false,
    brand: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    brand: BrandModel | null;
  }>({
    isOpen: false,
    brand: null,
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

  const refreshBrands = useCallback(() => {
    dispatch(fetchAllBrands({
      pageNo: filters.pageNo,
      pageSize: pagination.pageSize,
      search: filters.search
    }));
  }, [dispatch, filters.pageNo, pagination.pageSize, filters.search]);

  useEffect(() => {
    refreshBrands();
  }, [refreshBrands]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFormSubmit = async (values: any) => {
    try {
      if (formModal.brand) {
        await dispatch(updateBrand({ id: formModal.brand.id, data: values })).unwrap();
        AppToast({ type: "success", message: "Brand updated successfully" });
      } else {
        await dispatch(createBrand(values)).unwrap();
        AppToast({ type: "success", message: "Brand created successfully" });
      }
      setFormModal({ isOpen: false, brand: null });
    } catch (error: any) {
      toast.error(error || "Failed to save brand");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteModal.brand?.id) return;
    try {
      await dispatch(deleteBrand(deleteModal.brand.id)).unwrap();
      AppToast({ type: "success", message: `Brand "${deleteModal.brand.name}" deleted` });
      
      // If we deleted the last item on a page, go back
      if (brands.length === 1 && filters.pageNo > 1) {
        handlePageChange(filters.pageNo - 1);
      } else {
        refreshBrands();
      }
    } catch (error: any) {
      toast.error(error || "Failed to delete brand");
    } finally {
      setDeleteModal({ isOpen: false, brand: null });
    }
  };

  const tableColumns = useMemo(() => 
    createBrandTableColumns({
      data: {
        ...pagination
      },
      handlers: {
        handleViewBrand: (brand) => setDetailModal({ isOpen: true, brand }),
        handleEditBrand: (brand) => setFormModal({ isOpen: true, brand }),
        handleDelete: (brand) => setDeleteModal({ isOpen: true, brand }),
      },
    }), [brands, pagination]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Master Data", href: "" },
            { label: "Brands", href: ROUTES.DASHBOARD.BRANDS },
          ]}
          title="Brand Management"
          searchValue={search}
          searchPlaceholder="Search brands by name..."
          buttonIcon={<Plus className="w-4 h-4" />}
          buttonText="Add Brand"
          onSearchChange={handleSearchChange}
          openModal={() => setFormModal({ isOpen: true, brand: null })}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={brands}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No brands found. Start by adding one!"
            getRowKey={(brand) => brand.id.toString()}
            currentPage={pagination.pageNo}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <BrandFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, brand: null })}
        onSubmit={onFormSubmit}
        brand={formModal.brand}
        isSubmitting={operations.isCreating || operations.isUpdating}
      />

      <BrandDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, brand: null })}
        brand={detailModal.brand}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, brand: null })}
        onDelete={onConfirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? Products linked to this brand may lose their association."
        itemName={deleteModal.brand?.name || "---"}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
