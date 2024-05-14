import React from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { ICustomerNew } from 'src/models/ICustomer'
import CustomerForm from 'src/components/customers/CustomerForm'
import { isIdValid } from 'src/utils/routerUtils'
import {
  useGetSingleCustomerQuery,
  useUpdateAddressMutation,
  useUpdateCustomerMutation,
} from 'src/store/apis/customersSlice'

const EditCustomerPage = () => {
  const router = useRouter()
  const customerId = isIdValid(router.query.id)

  const { data: customerData } =
    useGetSingleCustomerQuery(customerId)

  const [updateCustomer] = useUpdateCustomerMutation()
  const [updateAddress] = useUpdateAddressMutation()

  const onSubmit = (values: ICustomerNew) => {
    if (customerData) {
      const { addresses, ...infoWithoutAddresses } = values

      // get id for previous billingAddress and shippingAddress
      const billingAddressId = customerData.addresses.find(
        addr => addr.addressType === 'billingAddress',
      )?.id
      const shippingAddressId = customerData.addresses.find(
        addr => addr.addressType === 'shippingAddress',
      )?.id

      if (billingAddressId) {
        updateAddress({
          id: billingAddressId,
          body: addresses[0],
        })
          .unwrap()
          .then(() => {
            // updated
          })
          .catch(() => toast.error('An error occured'))
      }
      if (shippingAddressId) {
        updateAddress({
          id: shippingAddressId,
          body: addresses[1],
        })
          .unwrap()
          .then(() => {
            // updated
          })
          .catch(() => toast.error('An error occured'))
      }

      updateCustomer({
        id: customerId,
        body: { ...infoWithoutAddresses },
      })
        .unwrap()
        .then(() => {
          toast.success('Customer updated successfully')
          router.push('/customers')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  return (
    <CustomerForm
      defaultValues={customerData}
      onSubmit={onSubmit}
    />
  )
}

EditCustomerPage.acl = {
  action: 'update',
  subject: 'customer',
}

export default EditCustomerPage
