import { useAppDispatch, useAppSelector, RootState } from "@/redux/store";
import { useMemo } from "react";

export const useBannersState = () => {
  const dispatch = useAppDispatch();
  const bannerState = useAppSelector((state: RootState) => state.banners);


  return useMemo(
    () => ({
      ...bannerState,
      banners: bannerState.data?.content || [],
      pagination: {
        currentPage: bannerState.data?.pageNo || 1,
        pageSize: bannerState.data?.pageSize || 10,
        totalElements: bannerState.data?.totalElements || 0,
        totalPages: bannerState.data?.totalPages || 0,
        last: bannerState.data?.last || false,
      },
      dispatch,
    }),
    [bannerState, dispatch]
  );
};
