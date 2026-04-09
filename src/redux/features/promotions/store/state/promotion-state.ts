import { useAppDispatch, useAppSelector, RootState } from "@/redux/store";
import { useMemo } from "react";

export const usePromotionsState = () => {
  const dispatch = useAppDispatch();
  const promotionState = useAppSelector((state: RootState) => state.promotions);

  return useMemo(
    () => ({
      ...promotionState,
      promotions: promotionState.data?.content || [],
      pagination: {
        currentPage: promotionState.data?.pageNo || 1,
        pageSize: promotionState.data?.pageSize || 10,
        totalElements: promotionState.data?.totalElements || 0,
        totalPages: promotionState.data?.totalPages || 0,
        last: promotionState.data?.last || false,
      },
      dispatch,
    }),
    [promotionState, dispatch]
  );
};
