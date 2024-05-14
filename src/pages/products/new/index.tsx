import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import ProductsForm from 'src/components/products/ProductsForm'
import { IProductNew } from 'src/models/IProduct'
import { useCreateProductMutation } from 'src/store/apis/productsSlice'
import { useAppSelector } from 'src/store/hooks'

const NewProduct = () => {
  const router = useRouter()
  const { store } = useAppSelector(state => state.app)
  const [createNewProduct] = useCreateProductMutation()

  const _createNewProduct = (values: IProductNew) => {
    const updatedValues: any = { ...values }
    updatedValues.created_from_store = store?.id
    if (updatedValues.sub_category == undefined) {
      updatedValues.sub_category = null
    }
    createNewProduct(updatedValues)
      .unwrap()
      .then(() => {
        toast.success('Product Created Successfully')
        router.push('/products')
      })
      .catch(() => toast.error('An error occurred'))
  }

  return <ProductsForm onSubmit={_createNewProduct} />
}

NewProduct.acl = {
  action: 'create',
  subject: 'product',
}

export default NewProduct
