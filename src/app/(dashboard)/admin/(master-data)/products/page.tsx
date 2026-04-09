"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/utils/debounce/debounce";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { Plus } from "lucide-react";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import { createProductTableColumns } from "@/constants/AppResource/table/master-data/product-table";
import { usePagination } from "@/redux/store/use-pagination";
import { useProductsState } from "@/redux/features/master-data/store/state/products-state";
import {
  fetchAllProducts,
  deleteProduct,
} from "@/redux/features/master-data/store/thunks/product-thunks";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/master-data/store/slice/product-slice";
import { AppToast } from "@/components/shared/common/app-toast";

export default function ProductsPage() {
  // Redux state
  const { products, isLoading, filters, pagination, operations, dispatch } =
    useProductsState();
  const router = useRouter();

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    product: ProductModel | null;
  }>({
    isOpen: false,
    product: null,
  });

  const searchParams = useSearchParams();
  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.PRODUCTS,
    defaultPageSize: pagination.pageSize,
  });

  // Sync URL page with Redux state
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== filters.pageNo) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams, dispatch, filters.pageNo]);

  // Initial redirect if no pageNo in URL
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Fetch products when filters or pagination change
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        pageNo: filters.pageNo,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, debouncedSearch, filters.pageNo, pagination.pageSize]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  // Pagination change handler
  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  // Action handlers
  const handleEditProduct = useCallback((product: ProductModel) => {
    router.push(ROUTES.DASHBOARD.PRODUCT_EDIT(String(product.id)));
  }, [router]);

  const handleViewProductDetail = useCallback((product: ProductModel) => {
    router.push(ROUTES.DASHBOARD.PRODUCT_DETAIL(String(product.id)));
  }, [router]);

  const handleDeleteProduct = useCallback((product: ProductModel) => {
    setDeleteState({
      isOpen: true,
      product: product,
    });
  }, []);

  const refreshProducts = () => {
    dispatch(
      fetchAllProducts({
        pageNo: filters.pageNo,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
      }),
    );
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditProduct,
      handleViewProductDetail,
      handleDelete: handleDeleteProduct,
    }),
    [handleEditProduct, handleViewProductDetail, handleDeleteProduct],
  );

  const columns = useMemo(
    () =>
      createProductTableColumns({
        data: {
          content: products,
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
          totalElements: pagination.totalElements,
          totalPages: pagination.totalPages,
          last: pagination.pageNo === pagination.totalPages,
          // Added these for the table utility if it needs them
          first: pagination.pageNo === 1,
          hasNext: pagination.pageNo < pagination.totalPages,
          hasPrevious: pagination.pageNo > 1,
        } as any,
        handlers: tableHandlers,
      }),
    [products, pagination, tableHandlers],
  );

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      product: null,
    });
  };

  const confirmDelete = async () => {
    if (!deleteState.product?.id) return;

    try {
      await dispatch(deleteProduct(deleteState.product.id)).unwrap();

      AppToast({
        type: "success",
        message: `Product "${deleteState.product.name}" deleted successfully`,
      });

      closeDeleteModal();

      if (products.length === 1 && filters.pageNo > 1) {
        const newPage = filters.pageNo - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      toast.error(error || "Failed to delete product");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Product Management", href: "" },
          ]}
          title="Product Management"
          searchValue={filters.search}
          searchPlaceholder="Search products by name or SKU..."
          buttonIcon={<Plus className="w-4 h-4" />}
          buttonText="New Product"
          onSearchChange={handleSearchChange}
          openModal={() => router.push(ROUTES.DASHBOARD.PRODUCT_NEW)}
        />

        <div className="space-y-4">
          <DataTableWithPagination
            data={products}
            columns={columns}
            loading={isLoading}
            emptyMessage="No products found"
            getRowKey={(product) => product.id || product.sku}
            currentPage={pagination.pageNo}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChangeWrapper}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        itemName={deleteState.product?.name || "---"}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
