import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'

import ProductsForm from 'src/components/products/ProductsForm'
import { IProductNew } from 'src/models/IProduct'
import Error404 from 'src/pages/404'
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from 'src/store/apis/productsSlice'
import { useAppSelector } from 'src/store/hooks'
import {
  IsResourceNotFound,
  getCustomNotFoundError,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'
import { isIdValid } from 'src/utils/routerUtils'

const UpdateBrand = () => {
  const router = useRouter()
  const productId = isIdValid(router.query.id)

  const { data: productData, isLoading } =
    useGetSingleProductQuery(productId)
  const { store } = useAppSelector(state => state.app)
  const [updateProduct] = useUpdateProductMutation()

  const _updateProduct = (values: IProductNew) => {
    const updatedValues: any = { ...values }
    updatedValues.id = productId
    updatedValues.created_from_store = store?.id
    if (updatedValues.sub_category == undefined) {
      updatedValues.sub_category = null
    }
    updateProduct({
      id: productId,
      body: { ...updatedValues },
    })
      .unwrap()
      .then(() => {
        toast.success('Product updated successfully')
        router.push(buildUrl('products'))
      })
      .catch(() => {
        toast.error('An error occurred')
      })
  }

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('product')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
      backToText='Back To Products'
      backToLink='/products'
    />
  )

  return isLoading ? (
    <FallbackSpinner brief />
  ) : IsResourceNotFound(productData) ? (
    <CustomError404 />
  ) : (
    <ProductsForm
      defaultValues={productData}
      onSubmit={_updateProduct}
    />
  )
}

UpdateBrand.acl = {
  action: 'read',
  subject: 'product',
}

export default UpdateBrand
