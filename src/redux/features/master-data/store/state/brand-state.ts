import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectBrands,
  selectBrandsContent,
  selectIsLoading,
  selectError,
  selectFilters,
  selectOperations,
  selectPagination,
} from "../selectors/brand-selectors";

export const useBrandsState = () => {
  const dispatch = useAppDispatch();

  const brandState = useAppSelector(selectBrands);
  const brands = useAppSelector(selectBrandsContent);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);

  return {
    dispatch,
    brandState,
    brands,
    isLoading,
    error,
    filters,
    operations,
    pagination,
  };
};
