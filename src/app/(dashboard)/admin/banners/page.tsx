"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useBannersState } from "@/redux/features/banners/store/state/banner-state";
import {
  fetchAllBannersService,
  createBannerService,
  updateBannerService,
  deleteBannerService,
} from "@/redux/features/banners/store/thunks/banner-thunks";
import {
  setPageNo,
  setSearchFilter,
  clearError,
} from "@/redux/features/banners/store/slice/banner-slice";
import { BannerModel } from "@/redux/features/banners/store/models/response/banner-response";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createBannerTableColumns } from "@/constants/AppResource/table/banner-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { BannerManagementModal } from "@/components/shared/modal/banner-management-modal";
import { BannerManagementDetailModal } from "@/components/shared/modal/banner-management-detail-modal";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

export default function BannersPage() {
  const { 
    banners, 
    isLoading, 
    error,
    pagination, 
    filters,
    operations,
    dispatch 
  } = useBannersState();

  const searchParams = useSearchParams();

  // Local State
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BANNERS,
    defaultPageSize: pagination.pageSize,
  });

  // Modals Local State
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    banner: BannerModel | null;
  }>({
    isOpen: false,
    banner: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    banner: BannerModel | null;
  }>({
    isOpen: false,
    banner: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    banner: BannerModel | null;
  }>({
    isOpen: false,
    banner: null,
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
    dispatch(fetchAllBannersService({
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
      if (formModal.banner) {
        await dispatch(updateBannerService({ id: formModal.banner.id, data: values })).unwrap();
        AppToast({ type: "success", message: "Banner updated" });
      } else {
        await dispatch(createBannerService(values)).unwrap();
        AppToast({ type: "success", message: "Banner created" });
      }
      setFormModal({ isOpen: false, banner: null });
    } catch (error: any) {
      toast.error(error || "An error occurred");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteModal.banner?.id) return;
    try {
      await dispatch(deleteBannerService(deleteModal.banner.id)).unwrap();
      AppToast({ type: "success", message: `Banner "${deleteModal.banner.title}" removed` });
      
      if (banners.length === 1 && filters.pageNo > 1) {
        handlePageChange(filters.pageNo - 1);
      } else {
        refreshData();
      }
    } catch (error: any) {
      toast.error(error || "Could not delete banner");
    } finally {
      setDeleteModal({ isOpen: false, banner: null });
    }
  };

  const tableColumns = useMemo(() => 
    createBannerTableColumns({
      data: {
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
      handlers: {
        handleView: (banner) => setDetailModal({ isOpen: true, banner }),
        handleEdit: (banner) => setFormModal({ isOpen: true, banner }),
        handleDelete: (banner) => setDeleteModal({ isOpen: true, banner }),
      },
    }), [banners, pagination]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2 font-primary">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Master Data", href: "#" },
            { label: "Banners", href: ROUTES.DASHBOARD.BANNERS },
          ]}
          title="Banners"
          searchValue={search}
          searchPlaceholder="Search banners..."
          buttonIcon={<ImagePlus className="w-4 h-4" />}
          buttonText="Add Banner"
          onSearchChange={handleSearchChange}
          openModal={() => setFormModal({ isOpen: true, banner: null })}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={banners}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No banners found."
            getRowKey={(b) => b.id.toString()}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={h => handlePageChange(h)}
          />
        </div>
      </div>

      <BannerManagementModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, banner: null })}
        onSubmit={onFormSubmit}
        banner={formModal.banner}
        isSubmitting={operations.isCreating || operations.isUpdating}
      />

      <BannerManagementDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, banner: null })}
        banner={detailModal.banner}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, banner: null })}
        onDelete={onConfirmDelete}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
        itemName={deleteModal.banner?.title || "---"}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
