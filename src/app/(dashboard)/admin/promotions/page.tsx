"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { usePromotionsState } from "@/redux/features/promotions/store/state/promotion-state";
import {
  fetchAllPromotionsService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
} from "@/redux/features/promotions/store/thunks/promotion-thunks";
import {
  setPageNo,
  setSearchFilter,
  clearError,
} from "@/redux/features/promotions/store/slice/promotion-slice";
import { PromotionModel } from "@/redux/features/promotions/store/models/response/promotion-response";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createPromotionTableColumns } from "@/constants/AppResource/table/promotion-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { PromotionManagementModal } from "@/components/shared/modal/promotion-management-modal";
import { PromotionManagementDetailModal } from "@/components/shared/modal/promotion-management-detail-modal";
import { Tag } from "lucide-react";
import { toast } from "sonner";

export default function PromotionsPage() {
  const { 
    promotions, 
    isLoading, 
    error,
    pagination, 
    filters,
    operations,
    dispatch 
  } = usePromotionsState();

  const searchParams = useSearchParams();

  // Local State
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.PROMOTIONS,
    defaultPageSize: pagination.pageSize,
  });

  // Modals Local State
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    promotion: PromotionModel | null;
  }>({
    isOpen: false,
    promotion: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    promotion: PromotionModel | null;
  }>({
    isOpen: false,
    promotion: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    promotion: PromotionModel | null;
  }>({
    isOpen: false,
    promotion: null,
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
    dispatch(fetchAllPromotionsService({
      pageNo: filters.pageNo,
      pageSize: pagination.pageSize,
      search: filters.search,
    }));
  }, [dispatch, filters.pageNo, pagination.pageSize, filters.search]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onFormSubmit = async (values: any) => {
    try {
      if (formModal.promotion) {
        await dispatch(updatePromotionService({ id: formModal.promotion.id, data: values })).unwrap();
        AppToast({ type: "success", message: "Promotion updated" });
      } else {
        await dispatch(createPromotionService(values)).unwrap();
        AppToast({ type: "success", message: "Promotion created" });
      }
      setFormModal({ isOpen: false, promotion: null });
    } catch (error: any) {
      toast.error(error || "An error occurred");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteModal.promotion?.id) return;
    try {
      await dispatch(deletePromotionService(deleteModal.promotion.id)).unwrap();
      AppToast({ type: "success", message: `Promotion "${deleteModal.promotion.name}" removed` });
      
      if (promotions.length === 1 && filters.pageNo > 1) {
        handlePageChange(filters.pageNo - 1);
      } else {
        refreshData();
      }
    } catch (error: any) {
      toast.error(error || "Could not delete promotion");
    } finally {
      setDeleteModal({ isOpen: false, promotion: null });
    }
  };

  const tableColumns = useMemo(() => 
    createPromotionTableColumns({
      data: {
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
      handlers: {
        handleView: (promotion) => setDetailModal({ isOpen: true, promotion }),
        handleEdit: (promotion) => setFormModal({ isOpen: true, promotion }),
        handleDelete: (promotion) => setDeleteModal({ isOpen: true, promotion }),
      },
    }), [pagination, dispatch]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2 font-primary">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Master Data", href: "#" },
            { label: "Promotions", href: ROUTES.DASHBOARD.PROMOTIONS },
          ]}
          title="Promotions"
          searchValue={search}
          searchPlaceholder="Search promotions..."
          buttonIcon={<Tag className="w-4 h-4" />}
          buttonText="Add Promotion"
          onSearchChange={handleSearchChange}
          openModal={() => setFormModal({ isOpen: true, promotion: null })}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={promotions}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No promotions found."
            getRowKey={(p) => p.id.toString()}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={h => handlePageChange(h)}
          />
        </div>
      </div>

      <PromotionManagementModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, promotion: null })}
        onSubmit={onFormSubmit}
        promotion={formModal.promotion}
        isSubmitting={operations.isCreating || operations.isUpdating}
      />

      <PromotionManagementDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, promotion: null })}
        promotion={detailModal.promotion}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, promotion: null })}
        onDelete={onConfirmDelete}
        title="Delete Promotion"
        description="Are you sure you want to delete this promotion? This action cannot be undone."
        itemName={deleteModal.promotion?.name || "---"}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
