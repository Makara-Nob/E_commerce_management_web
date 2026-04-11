import { useAppDispatch, useAppSelector } from "@/redux/store";

export const useDashboardState = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.dashboard);

    return {
        data,
        isLoading,
        error,
        dispatch,
    };
};
