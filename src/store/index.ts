import { combineReducers, configureStore, type Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/features/api/auth/authApi';
import { authSlice } from '@/features/slices/auth/authSlice';
import { responseDialogSlice } from '@/features/slices/response/responseDialogSlice';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { regionApi } from '@/features/api/regions/regionApi';
import { customerCategoryApi } from '@/features/api/customer/CustomerCategoryApi';
import { cityApi } from '@/features/api/regions/citiesApi';
import { roleApi } from '@/features/api/roles/roleApi';
import { staffApi } from '@/features/api/staff/staffApi';
import { taxesApi } from '@/features/api/taxes/taxApi';
import { wareHouseApi } from '@/features/api/warehouse/wareHouseApi';
import { productCategoryApi } from '@/features/api/products/productCateogry';
import { customerApi } from '@/features/api/customer/index';
import { productApi } from '@/features/api/products/productApi';
import { promotionApi } from '@/features/api/promotions/promotionsApi';
import { transactionsApi } from '@/features/api/transactions/transactionApi';
import { popularProductsApi } from '@/features/api/dashboard/popularProductApi';
import { ordersApi } from '@/features/api/orders/ordersApi';
import { warehouseApi } from '@/features/api/orders/ordersApi';
import { orderTransferApi } from '@/features/api/orders/ordersApi';
import { driversApi } from '@/features/api/drivers/driversApi';
import { orderDispatchApi } from '@/features/api/orders/ordersApi';
import { productUnitApi } from '@/features/api/products/productUnitApi';
import { graphApi } from '@/features/api/dashboard/graphApi';
import { customerCartApi } from '@/features/api/customer/CustomerCartApi';
import { ChatApi } from '@/features/api/chat/ChatApi';
import { BannersApi } from '@/features/api/banner/bannerApi';

const apiMiddlewares: Middleware[] = [
  authApi.middleware,
  regionApi.middleware,
  customerCategoryApi.middleware,
  customerApi.middleware,
  cityApi.middleware,
  roleApi.middleware,
  staffApi.middleware,
  wareHouseApi.middleware,
  taxesApi.middleware,
  productCategoryApi.middleware,
  productApi.middleware,
  promotionApi.middleware,
  transactionsApi.middleware,
  popularProductsApi.middleware,
  ordersApi.middleware,
  warehouseApi.middleware,
  orderTransferApi.middleware,
  driversApi.middleware,
  orderDispatchApi.middleware,
  productUnitApi.middleware,
  graphApi.middleware,
  customerCartApi.middleware,
  ChatApi.middleware,
  BannersApi.middleware,
];

export const store = configureStore({
  reducer: combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [authSlice.name]: authSlice.reducer,
    [responseDialogSlice.name]: responseDialogSlice.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [customerCategoryApi.reducerPath]: customerCategoryApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [taxesApi.reducerPath]: taxesApi.reducer,
    [wareHouseApi.reducerPath]: wareHouseApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [promotionApi.reducerPath]: promotionApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [popularProductsApi.reducerPath]: popularProductsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    [orderTransferApi.reducerPath]: orderTransferApi.reducer,
    [driversApi.reducerPath]: driversApi.reducer,
    [orderDispatchApi.reducerPath]: orderDispatchApi.reducer,
    [productUnitApi.reducerPath]: productUnitApi.reducer,
    [graphApi.reducerPath]: graphApi.reducer,
    [customerCartApi.reducerPath]: customerCartApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [BannersApi.reducerPath]: BannersApi.reducer,
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...apiMiddlewares),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
