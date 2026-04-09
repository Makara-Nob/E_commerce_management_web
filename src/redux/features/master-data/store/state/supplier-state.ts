import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectAllSuppliers,
  selectSupplierPagination,
  selectSupplierFilters,
  selectSupplierLoading,
  selectSupplierOperations,
  selectSupplierError,
} from "../selectors/supplier-selectors";

export const useSuppliersState = () => {
  const dispatch = useAppDispatch();
  const suppliers = useAppSelector(selectAllSuppliers);
  const pagination = useAppSelector(selectSupplierPagination);
  const filters = useAppSelector(selectSupplierFilters);
  const isLoading = useAppSelector(selectSupplierLoading);
  const operations = useAppSelector(selectSupplierOperations);
  const error = useAppSelector(selectSupplierError);

  return {
    dispatch,
    suppliers,
    pagination,
    filters,
    isLoading,
    operations,
    error,
  };
};
