import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectProducts,
  selectProductsContent,
  selectIsLoading,
  selectError,
  selectFilters,
  selectOperations,
  selectPagination,
} from "../selectors/product-selectors";

export const useProductsState = () => {
  const dispatch = useAppDispatch();

  const productState = useAppSelector(selectProducts);
  const products = useAppSelector(selectProductsContent);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const filters = useAppSelector(selectFilters);
  const operations = useAppSelector(selectOperations);
  const pagination = useAppSelector(selectPagination);

  return {
    dispatch,
    productState,
    products,
    isLoading,
    error,
    filters,
    operations,
    pagination,
  };
};
