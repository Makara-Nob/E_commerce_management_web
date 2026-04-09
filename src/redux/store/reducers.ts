/**
 * Store Reducers Configuration
 * Centralized configuration for all Redux reducers
 */

import authReducer from "../features/auth/store/slice/auth-slice";
import usersReducer from "../features/auth/store/slice/users-slice";
import productsReducer from "../features/master-data/store/slice/product-slice";
import categoryReducer from "../features/master-data/store/slice/category-slice";
import brandReducer from "../features/master-data/store/slice/brand-slice";
import supplierReducer from "../features/master-data/store/slice/supplier-slice";
import bannerReducer from "../features/banners/store/slice/banner-slice";
import promotionReducer from "../features/promotions/store/slice/promotion-slice";
import orderReducer from "../features/orders/store/slice/order-slice";


/**
 * Root reducer configuration
 * Add new feature reducers here
 */
export const reducers = {
  auth: authReducer,
  users: usersReducer,
  products: productsReducer,
  category: categoryReducer,
  brands: brandReducer,
  suppliers: supplierReducer,
  banners: bannerReducer,
  promotions: promotionReducer,
  orders: orderReducer,

};
