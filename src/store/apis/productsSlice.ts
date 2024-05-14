import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { getUrl } from 'src/services/http.service'
import { validateStatus } from '../utils/validateStatus'
import { prepareHeaders } from '../utils/prepareHeaders'

import { IPaginatedData } from 'src/models/shared/IPaginatedData'
import {
  IBrand,
  IBrandNew,
  IBrandUpdate,
} from 'src/models/IBrand'
import {
  ICategory,
  ICategoryNew,
  ICategoryUpdate,
} from 'src/models/ICategory'
import {
  IMetaOption,
  IMetaOptionNew,
  IMetaOptionUpdate,
} from 'src/models/MetaOption'
import {
  IProductPrice,
  IProductPriceNew,
  IProductPriceUpdate,
} from 'src/models/IProductPrice'
import {
  IProductStatus,
  IProductStatusNew,
} from 'src/models/IProductStatus'
import {
  IProduct,
  IProductNew,
  IProductUpdate,
} from 'src/models/IProduct'
import {
  IStockStatus,
  IStockStatusNew,
  IStockStatusUpdate,
} from 'src/models/IStockStatus'
import {
  IStockTrack,
  IStockTrackNew,
  IStockTrackUpdate,
} from 'src/models/IStockTrack'
import {
  IStock,
  IStockNew,
  IStockUpdate,
} from 'src/models/IStock'
import {
  IProductSubCategory,
  IProductSubCategoryNew,
  IProductSubCategoryUpdate,
} from 'src/models/IProductSubCategory'
import { ITag, ITagNew, ITagUpdate } from 'src/models/ITag'
import { IPriceMatch } from 'src/models/IPriceMatch'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  tagTypes: [
    'Brand',
    'Category',
    'MetaOption',
    'ProductPrice',
    'ProductStatus',
    'Product',
    'StockStatus',
    'StockTrack',
    'Stock',
    'SubCategory',
    'Tag',
    'Search',
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: getUrl(),
    prepareHeaders: prepareHeaders,
    validateStatus: validateStatus,
  }),
  endpoints: builder => ({
    /**
     *
     * Brands
     *
     */
    getBrands: builder.query<IPaginatedData<IBrand>, void>({
      query: () => '/product/brands/',
      providesTags: ['Brand'],
    }),
    createBrand: builder.mutation<IBrand, IBrandNew>({
      query: body => ({
        url: `/product/brands/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Search'],
    }),
    getSingleBrand: builder.query<IBrand, number>({
      query: id => `/product/brands/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Brand', id },
      ],
    }),
    updateBrand: builder.mutation<
      IBrand,
      { id: number; body: IBrandUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/brands/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Brand', 'Search'],
    }),
    deleteBrand: builder.mutation<any, number>({
      query: id => ({
        url: `/product/brands/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Brand', 'Search'],
    }),
    getBrandSearch: builder.query<
      IPaginatedData<IBrand[]>,
      {
        search: string
        page: number
      }
    >({
      query: query =>
        `/product/brand/search/?q=${query.search}&page=${query.page}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),

    /**
     *
     * Category
     *
     */
    getCategories: builder.query<
      IPaginatedData<ICategory>,
      void
    >({
      query: () => '/product/category/',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<
      ICategory,
      ICategoryNew
    >({
      query: body => ({
        url: `/product/category/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    getSingleCategory: builder.query<ICategory, number>({
      query: id => `/product/category/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Category', id },
      ],
    }),
    updateCategory: builder.mutation<
      ICategory,
      { id: number; body: ICategoryUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/category/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<any, number>({
      query: id => ({
        url: `/product/category/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Category'],
    }),

    /**
     *
     * Meta Options
     *
     */
    getMetaOptions: builder.query<
      IPaginatedData<IMetaOption>,
      void
    >({
      query: () => '/product/meta-options/',
      providesTags: ['MetaOption'],
    }),
    createMetaOption: builder.mutation<
      IMetaOption,
      IMetaOptionNew
    >({
      query: body => ({
        url: `/product/meta-options/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MetaOption'],
    }),
    getSingleMetaOption: builder.query<IMetaOption, number>(
      {
        query: id => `/product/meta-options/${id}/`,
        providesTags: (result, error, id) => [
          { type: 'MetaOption', id },
        ],
      },
    ),
    updateMetaOption: builder.mutation<
      IMetaOption,
      { id: number; body: IMetaOptionUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/meta-options/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['MetaOption'],
    }),
    deleteMetaOption: builder.mutation<any, number>({
      query: id => ({
        url: `/product/meta-options/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['MetaOption'],
    }),

    /**
     *
     * Product Prices
     *
     */
    getProductPrices: builder.query<
      IPaginatedData<IProductPrice>,
      void
    >({
      query: () => '/product/product-prices/',
      providesTags: ['ProductPrice'],
    }),
    createProductPrice: builder.mutation<
      IProductPrice,
      IProductPriceNew
    >({
      query: body => ({
        url: `/product/product-prices/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductPrice'],
    }),
    getSingleProductPrice: builder.query<
      IProductPrice,
      number
    >({
      query: id => `/product/product-prices/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'ProductPrice', id },
      ],
    }),
    updateProductPrice: builder.mutation<
      IProductPrice,
      { id: number; body: IProductPriceUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/product-prices/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['ProductPrice'],
    }),
    deleteProductPrice: builder.mutation<any, number>({
      query: id => ({
        url: `/product/product-prices/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['ProductPrice'],
    }),

    /**
     *
     * Product Status
     *
     */
    getProductStatus: builder.query<
      IPaginatedData<IProductStatus>,
      void
    >({
      query: () => '/product/product-status/',
      providesTags: ['ProductStatus'],
    }),
    createProductStatus: builder.mutation<
      IProductStatus,
      IProductStatusNew
    >({
      query: body => ({
        url: `/product/product-status/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductStatus'],
    }),
    getSingleProductStatus: builder.query<
      IProductStatus,
      number
    >({
      query: id => `/product/product-status/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'ProductStatus', id },
      ],
    }),
    updateProductStatus: builder.mutation<
      IProductStatus,
      { id: number; body: { product_status: string } }
    >({
      query: ({ id, body }) => ({
        url: `/product/product/${id}/update-status/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Product'],
    }),
    deleteProductStatus: builder.mutation<any, number>({
      query: id => ({
        url: `/product/product-status/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['ProductStatus'],
    }),

    /**
     *
     * Product
     *
     */
    getProducts: builder.query<
      IPaginatedData<IProduct>,
      {
        status: string
        page: number
        temp: boolean
        search: string
      }
    >({
      query: query =>
        `/product/products-filter/?product_status=${query.status}&is_temporary_product=${query.temp}&search=${query.search}&page=${query.page}`,
      providesTags: ['Product'],
    }),
    getMergeProductListing: builder.query<
      IProduct[],
      {
        search: string
        store: number
      }
    >({
      query: query =>
        `/product/merged-search/?q=${query.search}&store=${query.store}`,
      providesTags: ['Product'],
    }),
    uploadProduct: builder.mutation<any, any>({
      query: body => ({
        url: `/product/upload-product/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    createProduct: builder.mutation<IProduct, IProductNew>({
      query: body => ({
        url: `/product/products/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    mergeProduct: builder.mutation<any, any>({
      query: body => ({
        url: `/product/merged/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    getSingleProduct: builder.query<IProduct, number>({
      query: id => `/product/products/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Product', id },
      ],
    }),
    updateProduct: builder.mutation<
      IProduct,
      { id: number; body: IProductUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/products/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<any, number>({
      query: id => ({
        url: `/product/products/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Product'],
    }),

    /**
     *
     * Stock Statuses
     *
     */
    getStockStatuses: builder.query<
      IPaginatedData<IStockStatus>,
      void
    >({
      query: () => '/product/stock-statuses/',
      providesTags: ['StockStatus'],
    }),
    createStockStatus: builder.mutation<
      IStockStatus,
      IStockStatusNew
    >({
      query: body => ({
        url: `/product/stock-statuses/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StockStatus'],
    }),
    getSingleStockStatus: builder.query<
      IStockStatus,
      number
    >({
      query: id => `/product/stock-statuses/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'StockStatus', id },
      ],
    }),
    updateStockStatus: builder.mutation<
      IStockStatus,
      { id: number; body: IStockStatusUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/stock-statuses/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['StockStatus'],
    }),
    deleteStockStatus: builder.mutation<any, number>({
      query: id => ({
        url: `/product/stock-statuses/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['StockStatus'],
    }),

    /**
     *
     * Stock Track
     *
     */
    getStockTracks: builder.query<
      IPaginatedData<IStockTrack>,
      void
    >({
      query: () => '/product/stock-tracks/',
      providesTags: ['StockTrack'],
    }),
    createStockTrack: builder.mutation<
      IStockTrack,
      IStockTrackNew
    >({
      query: body => ({
        url: `/product/stock-tracks/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StockTrack'],
    }),
    getSingleStockTrack: builder.query<IStockTrack, number>(
      {
        query: id => `/product/stock-tracks/${id}/`,
        providesTags: (result, error, id) => [
          { type: 'StockTrack', id },
        ],
      },
    ),
    updateStockTrack: builder.mutation<
      IStockTrack,
      { id: number; body: IStockTrackUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/stock-tracks/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['StockTrack'],
    }),
    deleteStockTrack: builder.mutation<any, number>({
      query: id => ({
        url: `/product/stock-tracks/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['StockTrack'],
    }),

    /**
     *
     * Stock
     *
     */
    getStocks: builder.query<IPaginatedData<IStock>, void>({
      query: () => '/product/stocks/',
      providesTags: ['Stock'],
    }),
    createStock: builder.mutation<IStock, IStockNew>({
      query: body => ({
        url: `/product/stocks/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stock'],
    }),
    getSingleStock: builder.query<IStock, number>({
      query: id => `/product/stocks/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Stock', id },
      ],
    }),
    updateStock: builder.mutation<
      IStock,
      { id: number; body: IStockUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/stocks/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Stock'],
    }),
    deleteStock: builder.mutation<any, number>({
      query: id => ({
        url: `/product/stocks/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Stock'],
    }),

    /**
     *
     * Sub Category
     *
     */
    getSubCategories: builder.query<
      IPaginatedData<IProductSubCategory>,
      void
    >({
      query: () => '/product/subcategories/',
      providesTags: ['SubCategory'],
    }),
    createSubCategory: builder.mutation<
      IProductSubCategory,
      IProductSubCategoryNew
    >({
      query: body => ({
        url: `/product/subcategories/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),
    getSingleSubCategory: builder.query<
      IProductSubCategory,
      number
    >({
      query: id => `/product/subcategories/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'SubCategory', id },
      ],
    }),
    updateSubCategory: builder.mutation<
      IProductSubCategory,
      { id: number; body: IProductSubCategoryUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/subcategories/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['SubCategory'],
    }),
    deleteSubCategory: builder.mutation<any, number>({
      query: id => ({
        url: `/product/subcategories/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['SubCategory'],
    }),

    /**
     *
     * Tag
     *
     */
    getTags: builder.query<IPaginatedData<ITag>, void>({
      query: () => '/product/tags/',
      providesTags: ['Tag'],
    }),
    createTag: builder.mutation<ITag, ITagNew>({
      query: body => ({
        url: `/product/tags/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tag'],
    }),
    getSingleTag: builder.query<ITag, number>({
      query: id => `/product/tags/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Tag', id },
      ],
    }),
    updateTag: builder.mutation<
      ITag,
      { id: number; body: ITagUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/product/tags/${id}/`,
        method: 'PATCH',
        body,
      }),

      invalidatesTags: ['Tag'],
    }),
    deleteTag: builder.mutation<any, number>({
      query: id => ({
        url: `/product/tags/${id}/`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Tag'],
    }),

    /**
     *
     * Search
     *
     */
    getProductSearch: builder.query<IProduct[], string>({
      query: query => `/product/search/?q=${query}&store=0`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),
    getStoreProductsSearch: builder.query<
      IProduct[],
      { query?: string; storeId: number }
    >({
      query: ({ query, storeId }) =>
        `/product/search/?q=${
          query || ''
        }&store=${storeId}`,
      providesTags: (result, error, query) => [
        { type: 'Search', query },
      ],
    }),

    /**
     *
     * Price Match
     *
     */
    checkPriceMatch: builder.mutation<IPriceMatch, any>({
      query: body => ({
        url: `/product/price-match/`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUploadProductMutation,
  useMergeProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductSearchQuery,
  useCheckPriceMatchMutation,
  useGetStoreProductsSearchQuery,
  useGetMergeProductListingQuery,
  useUpdateProductStatusMutation,

  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandSearchQuery,
} = productsApi
