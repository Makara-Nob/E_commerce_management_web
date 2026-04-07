/**
 * Store Reducers Configuration
 * Centralized configuration for all Redux reducers
 */

import authReducer from "../features/auth/store/slice/auth-slice";
import usersReducer from "../features/auth/store/slice/users-slice";
import productsReducer from "../features/master-data/store/slice/product-slice";
import categoryReducer from "../features/master-data/store/slice/category-slice";

/**
 * Root reducer configuration
 * Add new feature reducers here
 */
export const reducers = {
  auth: authReducer,
  users: usersReducer,
  products: productsReducer,
  category: categoryReducer,
};
