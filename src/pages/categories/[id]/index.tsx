import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'

import CategoryForm from 'src/components/categories/CategoryForm'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from 'src/store/apis/categorySlice'
import { isIdValid } from 'src/utils/routerUtils'

const UpdateCategory = () => {
  const ability = useContext(AbilityContext)
  const router = useRouter()
  const categoryId = isIdValid(router.query.id)

  const { data: categoryData } =
    useGetSingleCategoryQuery(categoryId)

  const [updateCategory] = useUpdateCategoryMutation()

  return (
    <CategoryForm
      isView={ability.cannot('update', 'category')}
      defaultValues={categoryData}
      onSubmit={values => {
        updateCategory({
          id: categoryId,
          body: { ...values },
        })
          .unwrap()
          .then(() => {
            toast.success('Category updated Successfully')
            router.push('/categories')
          })
          .catch(() => toast.error('An error occurred'))
      }}
    />
  )
}

UpdateCategory.acl = {
  action: 'read',
  subject: 'category',
}

export default UpdateCategory
