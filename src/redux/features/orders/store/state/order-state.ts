import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/store";

export const useOrdersState = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state: RootState) => state.orders);

    return {
        ...state,
        dispatch,
    };
};
