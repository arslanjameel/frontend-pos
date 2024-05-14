import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import CategoryForm from 'src/components/categories/CategoryForm'
import { useCreateCategoryMutation } from 'src/store/apis/categorySlice'

const NewCategory = () => {
  const router = useRouter()

  const [createCategory] = useCreateCategoryMutation()

  return (
    <CategoryForm
      onSubmit={values => {
        createCategory({ ...values })
          .unwrap()
          .then(() => {
            toast.success('Category Created Successfully')
            router.push('/categories')
          })
          .catch(() => toast.error('An error occurred'))
      }}
    />
  )
}

NewCategory.acl = {
  action: 'create',
  subject: 'category',
}

export default NewCategory
