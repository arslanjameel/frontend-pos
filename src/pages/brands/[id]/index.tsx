import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'

import BrandForm from 'src/components/brands/BrandForm'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { IBrandNew } from 'src/models/IBrand'
import {
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
} from 'src/store/apis/productsSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { isIdValid } from 'src/utils/routerUtils'

const UpdateBrand = () => {
  const router = useRouter()
  const brandId = isIdValid(router.query.id)

  const ability = useContext(AbilityContext)

  const { data: brandData, isLoading } =
    useGetSingleBrandQuery(brandId)

  const [updateBrand] = useUpdateBrandMutation()

  const _updateBrand = (brandInfo: IBrandNew) => {
    updateBrand({
      id: brandId,
      body: brandInfo,
    })
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Brand updated successfully')
        }
      })
      .catch(() => {
        toast.error('An error occured')
      })
  }

  if (isLoading) return <FallbackSpinner brief />

  return (
    <BrandForm
      isView={ability.cannot('update', 'brand')}
      defaultValues={brandData}
      onSubmit={_updateBrand}
    />
  )
}

UpdateBrand.acl = {
  action: 'read',
  subject: 'brand',
}

export default UpdateBrand
