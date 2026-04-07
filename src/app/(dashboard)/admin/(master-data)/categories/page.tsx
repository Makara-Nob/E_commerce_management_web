"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { 
  fetchAllCategories, 
  deleteCategory 
} from "@/redux/features/master-data/store/thunks/category-thunks";
import { CategoryModel } from "@/models/dashboard/master-data/category/category.model";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createCategoryTableColumns } from "@/constants/AppResource/table/master-data/category-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { CategoryModal } from "@/components/shared/modal/category-modal";
import { CategoryDetailModal } from "@/components/shared/modal/category-detail-modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    categories, 
    isLoading, 
    totalElements, 
    totalPages, 
    pageNo, 
    pageSize 
  } = useSelector((state: RootState) => state.category);

  const searchParams = useSearchParams();

  // Local State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.CATEGORIES,
    defaultPageSize: pageSize,
  });

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    category: CategoryModel | null;
  }>({
    isOpen: false,
    category: null,
  });

  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    category: CategoryModel | null;
  }>({
    isOpen: false,
    category: null,
  });

  // Delete State
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    category: CategoryModel | null;
  }>({
    isOpen: false,
    category: null,
  });

  // Initial redirect if no pageNo in URL
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  const refreshCategories = useCallback(() => {
    const pageParam = searchParams.get("pageNo");
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    dispatch(fetchAllCategories({
      pageNo: currentPage,
      pageSize: pageSize,
      search: debouncedSearch,
      status: "ACTIVE"
    }));
  }, [dispatch, searchParams, pageSize, debouncedSearch]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleEdit = (category: CategoryModel) => {
    setModalState({ isOpen: true, category });
  };

  const handleView = (category: CategoryModel) => {
    setDetailModalState({ isOpen: true, category });
  };

  const handleDeleteClick = (category: CategoryModel) => {
    setDeleteState({ isOpen: true, category });
  };

  const confirmDelete = async () => {
    if (!deleteState.category?.id) return;
    try {
      await dispatch(deleteCategory(deleteState.category.id.toString())).unwrap();
      AppToast({ type: "success", message: `Category "${deleteState.category.name}" deleted successfully` });
      
      if (categories.length === 1 && pageNo > 1) {
        handlePageChangeWrapper(pageNo - 1);
      } else {
        refreshCategories();
      }
    } catch (error: any) {
      toast.error(error || "Failed to delete category");
    } finally {
      setDeleteState({ isOpen: false, category: null });
    }
  };

  const tableColumns = useMemo(() => 
    createCategoryTableColumns({
      data: {
        content: categories,
        pageNo,
        pageSize,
        totalElements,
        totalPages,
      },
      handlers: {
        handleEdit,
        handleView,
        handleDelete: handleDeleteClick,
      },
    }), [categories, pageNo, pageSize, totalElements, totalPages]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Category Management", href: "" },
          ]}
          title="Category Management"
          searchValue={search}
          searchPlaceholder="Search categories by name..."
          buttonIcon={<Plus className="w-4 h-4" />}
          buttonText="Add Category"
          onSearchChange={handleSearchChange}
          openModal={() => setModalState({ isOpen: true, category: null })}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={categories}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No categories found. Start by adding a new one."
            getRowKey={(cat) => cat.id.toString()}
            currentPage={pageNo}
            totalPages={totalPages}
            onPageChange={handlePageChangeWrapper}
          />
        </div>
      </div>

      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, category: null })}
        onSuccess={refreshCategories}
        category={modalState.category}
      />

      <CategoryDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState({ isOpen: false, category: null })}
        category={detailModalState.category}
      />

      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, category: null })}
        onDelete={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and may affect products linked to it."
        itemName={deleteState.category?.name || "---"}
        isSubmitting={isLoading}
      />
    </div>
  );
}
