// import { Box, Button, Card, Typography } from '@mui/material'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import PageContainer from 'src/components/global/PageContainer'
import SupplierFormInputs from 'src/components/suppliers/SupplierFormInputs'
import { ISupplierNew } from 'src/models/ISupplier'
import { useCreateSupplierMutation } from 'src/store/apis/suppliersSlice'

// import UserInfoCard from 'src/components/userAccounts/UserInfoCard'
// import { useAppDispatch } from 'src/store/hooks'
// import { createSupplier } from 'src/store/reducers/suppliersSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'

const NewSupplierForm = () => {
  // const dispatch = useAppDispatch()
  const router = useRouter()

  const [createSupplier] = useCreateSupplierMutation()

  const handleSubmit = (values: ISupplierNew) => {
    const updatedValues = { ...values }
    if (updatedValues.closing_hours === '') {
      updatedValues.closing_hours = null
    }
    if (updatedValues.opening_hours === '') {
      updatedValues.opening_hours = null
    }
    createSupplier(updatedValues)
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Supplier added successfully')

          router.replace(buildUrl('suppliers'))
        }
      })
      .catch(() => {
        toast.error('An error occurred')
      })
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Suppliers', to: '/suppliers' },
          { label: 'Add', to: '#' },
        ]}
      >
        <SupplierFormInputs onSubmit={handleSubmit} />
      </PageContainer>
    </>
  )
}

NewSupplierForm.acl = {
  action: 'create',
  subject: 'supplier',
}

export default NewSupplierForm
