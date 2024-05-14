import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import appReducer from './reducers/appSlice'
import userAccountsReducer from './reducers/userAccountsSlice'
import storesReducer from './reducers/storesSlice'
import rolesPermissionsReducer from './reducers/rolesPermissionsSlice'
import customersReducer from './reducers/customersSlice'
import suppliersReducer from './reducers/suppliersSlice'
import productsReducer from './reducers/productsSlice'
import categoriesReducer from './reducers/categoriesSlice'
import brandsReducer from './reducers/brandsSlice'
import invoicesReducer from './reducers/invoicesSlice'
import ordersReducer from './reducers/ordersSlice'
import quotesReducer from './reducers/quotesSlice'
import receiptsReducer from './reducers/receiptsSlice'
import creditNotesReducer from './reducers/creditNotesSlice'
import { SalesApi } from './apis/SalesSlice'
import { authApi } from './apis/authSlice'
import { accountApi } from './apis/accountSlice'
import { customersApi } from './apis/customersSlice'
import { productsApi } from './apis/productsSlice'
import { quotesApi } from './apis/quotesSlice'
import { invoicesApi } from './apis/invoicesSlice'
import { receiptsApi } from './apis/receiptsSlice'
import { deliveryNoteApi } from './apis/deliveryNotesSlice'
import { markCompletedApi } from './apis/markCompletedSlice'
import { returnsApi } from './apis/returnsSlice'
import { ordersApi } from './apis/orderSlice'
import { suppliersApi } from './apis/suppliersSlice'
import { categoriesApi } from './apis/categorySlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    userAccounts: userAccountsReducer,
    stores: storesReducer,
    roles: rolesPermissionsReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    products: productsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    invoices: invoicesReducer,
    orders: ordersReducer,
    quotes: quotesReducer,
    receipts: receiptsReducer,
    creditNotes: creditNotesReducer,

    [accountApi.reducerPath]: accountApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [invoicesApi.reducerPath]: invoicesApi.reducer,
    [quotesApi.reducerPath]: quotesApi.reducer,
    [receiptsApi.reducerPath]: receiptsApi.reducer,
    [SalesApi.reducerPath]: SalesApi.reducer,
    [deliveryNoteApi.reducerPath]: deliveryNoteApi.reducer,
    [markCompletedApi.reducerPath]:
      markCompletedApi.reducer,
    [returnsApi.reducerPath]: returnsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      accountApi.middleware,
      customersApi.middleware,
      suppliersApi.middleware,
      productsApi.middleware,
      invoicesApi.middleware,
      quotesApi.middleware,
      receiptsApi.middleware,
      SalesApi.middleware,
      deliveryNoteApi.middleware,
      markCompletedApi.middleware,
      returnsApi.middleware,
      ordersApi.middleware,
      categoriesApi.middleware,
    ]),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
