import React from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { useCreateCustomerMutation } from 'src/store/apis/customersSlice'
import { ICustomerNew } from 'src/models/ICustomer'
import CustomerForm from 'src/components/customers/CustomerForm'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'

const NewCustomerPage = () => {
  const [createCustomer] = useCreateCustomerMutation()
  const router = useRouter()

  const onSubmit = (values: ICustomerNew) => {
    createCustomer({ ...values })
      .unwrap()
      .then(res => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Customer added successfully')
          router.push('/customers')
        }
      })
      .catch(() => toast.error('An error occured'))
  }

  return <CustomerForm onSubmit={onSubmit} />
}

NewCustomerPage.acl = {
  action: 'create',
  subject: 'customer',
}

export default NewCustomerPage
