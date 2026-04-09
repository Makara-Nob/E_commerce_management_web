"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useUsersState } from "@/redux/features/auth/store/state/users-state";
import {
  fetchAllUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
  resetUserPasswordService,
} from "@/redux/features/auth/store/thunks/users-thunks";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/auth/store/slice/users-slice";
import { UserModel } from "@/redux/features/auth/store/models/response/users-response";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { createUserHubTableColumns } from "@/constants/AppResource/table/user-hub-table";
import { useDebounce } from "@/utils/debounce/debounce";
import { AppToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { useSearchParams } from "next/navigation";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { UserManagementModal } from "@/components/shared/modal/user-management-modal";
import { UserManagementDetailModal } from "@/components/shared/modal/user-management-detail-modal";
import { ResetPasswordModal } from "@/components/shared/modal/reset-password-modal";
import { Users, ShieldCheck, UserCog, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UsersPage() {
  const { 
    users, 
    isLoading, 
    pagination, 
    filters,
    operations,
    dispatch 
  } = useUsersState();

  const searchParams = useSearchParams();

  // Local State
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.USERS,
    defaultPageSize: pagination.pageSize,
  });

  // Modals Local State
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [resetModal, setResetModal] = useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
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

  const refreshUsers = useCallback(() => {
    const rolesFilter = activeTab === "ALL" ? [] : [activeTab];
    dispatch(fetchAllUsersService({
      pageNo: filters.pageNo,
      pageSize: pagination.pageSize,
      search: filters.search,
    }));
  }, [dispatch, filters.pageNo, pagination.pageSize, filters.search, activeTab]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const onFormSubmit = async (values: any) => {
    try {
      if (formModal.user) {
        await dispatch(updateUserService({ userId: formModal.user.id, userData: values })).unwrap();
        AppToast({ type: "success", message: "User updated" });
      } else {
        await dispatch(createUserService(values)).unwrap();
        AppToast({ type: "success", message: "User created" });
      }
      setFormModal({ isOpen: false, user: null });
    } catch (error: any) {
      toast.error(error || "An error occurred");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteModal.user?.id) return;
    try {
      await dispatch(deleteUserService(deleteModal.user.id)).unwrap();
      AppToast({ type: "success", message: `User "${deleteModal.user.username}" removed` });
      
      if (users.length === 1 && filters.pageNo > 1) {
        handlePageChange(filters.pageNo - 1);
      } else {
        refreshUsers();
      }
    } catch (error: any) {
      toast.error(error || "Could not delete user");
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  const onResetPassword = async (newPassword: string) => {
    if (!resetModal.user?.id) return;
    try {
      await dispatch(
        resetUserPasswordService({
          userId: resetModal.user.id,
          newPassword,
        })
      ).unwrap();
      AppToast({ type: "success", message: `Password reset for ${resetModal.user.username}` });
      setResetModal({ isOpen: false, user: null });
    } catch (error: any) {
      toast.error(error || "Could not reset password");
    }
  };

  const tableColumns = useMemo(() => 
    createUserHubTableColumns({
      data: {
        pageNo: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
      handlers: {
        handleViewUser: (user) => setDetailModal({ isOpen: true, user }),
        handleEditUser: (user) => setFormModal({ isOpen: true, user }),
        handleResetPassword: (user) => setResetModal({ isOpen: true, user }),
        handleDelete: (user) => setDeleteModal({ isOpen: true, user }),
      },
    }), [users, pagination]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-2 font-primary">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Users", href: ROUTES.DASHBOARD.USERS },
          ]}
          title="Users"
          searchValue={search}
          searchPlaceholder="Search users..."
          buttonIcon={<Users className="w-4 h-4" />}
          buttonText="Add User"
          onSearchChange={handleSearchChange}
          openModal={() => setFormModal({ isOpen: true, user: null })}
        >
           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
             <TabsList className="bg-muted/40 p-1 h-9">
               <TabsTrigger value="ALL" className="text-xs gap-1.5 px-3">
                 <Users className="w-3.5 h-3.5" /> All
               </TabsTrigger>
               <TabsTrigger value="ADMIN" className="text-xs gap-1.5 px-3">
                 <ShieldCheck className="w-3.5 h-3.5" /> Admins
               </TabsTrigger>
               <TabsTrigger value="STAFF" className="text-xs gap-1.5 px-3">
                 <UserCog className="w-3.5 h-3.5" /> Staff
               </TabsTrigger>
               <TabsTrigger value="CUSTOMER" className="text-xs gap-1.5 px-3">
                 <UserCircle className="w-3.5 h-3.5" /> Customers
               </TabsTrigger>
             </TabsList>
           </Tabs>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTableWithPagination
            data={users}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage={`No ${activeTab.toLowerCase()} accounts found.`}
            getRowKey={(u) => u.id?.toString() || u.username}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChangeWrapper => handlePageChange(handlePageChangeWrapper)}
          />
        </div>
      </div>

      <UserManagementModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, user: null })}
        onSubmit={onFormSubmit}
        user={formModal.user}
        isSubmitting={operations.isCreating || operations.isUpdating}
      />

      <UserManagementDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, user: null })}
        user={detailModal.user}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onDelete={onConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        itemName={deleteModal.user?.fullName || deleteModal.user?.username || "---"}
        isSubmitting={operations.isDeleting}
      />

      <ResetPasswordModal
        isOpen={resetModal.isOpen}
        onClose={() => setResetModal({ isOpen: false, user: null })}
        user={resetModal.user}
        onConfirm={onResetPassword}
        isSubmitting={false} // Loading state can be added to operations later if needed
      />
    </div>
  );
}
