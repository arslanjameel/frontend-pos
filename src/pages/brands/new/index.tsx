import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import BrandForm from 'src/components/brands/BrandForm'
import { IBrandNew } from 'src/models/IBrand'
import { useCreateBrandMutation } from 'src/store/apis/productsSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'

const NewBrand = () => {
  const router = useRouter()

  const [createBrand] = useCreateBrandMutation()

  const _createBrand = (newBrand: IBrandNew) => {
    createBrand(newBrand)
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Brand added successfully')

          router.replace(buildUrl('brands', {}))

          // console.log(res)
        }
      })
      .catch(() => {
        toast.error('An error occured')
      })
  }

  return <BrandForm onSubmit={_createBrand} />
}

NewBrand.acl = {
  action: 'create',
  subject: 'brand',
}

export default NewBrand
