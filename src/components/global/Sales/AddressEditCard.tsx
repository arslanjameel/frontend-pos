import React from 'react'

import AddressCard from 'src/components/invoices/AddressCard'
import useGetCustomerAddressInfo from 'src/hooks/useGetCustomerAddressInfo'
import { ICustomer } from 'src/models/ICustomer'
import { useGetSingleCustomerAddressesQuery } from 'src/store/apis/customersSlice'
import {
  isCashCustomer,
  isCustomerSelected,
} from 'src/utils/customers.util'

interface Props {
  title?: string
  icon?: string
  buttonIcon?: string
  customer: ICustomer
  cashCustomerValue?: string
  addressId?: number | string
  openSelectModal?: () => void
  onCashCustomerValueChange?: (val: string) => void
  placeholder?: string

  isDelivery?: boolean
  deliveryCost?: number
  updateDeliveryCost?: (val: number) => void
  overrideAddressStr?: string
}

const AddressEditCard = ({
  title = 'Invoice To',
  icon = 'tabler:user',
  buttonIcon = 'tabler:map',
  customer,
  cashCustomerValue,
  addressId,
  openSelectModal,
  onCashCustomerValueChange,

  isDelivery,
  deliveryCost,
  updateDeliveryCost,
  overrideAddressStr,
}: Props) => {
  const { data: customerAddresses } =
    useGetSingleCustomerAddressesQuery(customer?.id)

  const { getAddressStr } = useGetCustomerAddressInfo(
    customerAddresses?.results || [],
  )

  return (
    <>
      <AddressCard
        title={title}
        icon={icon}
        buttonIcon={buttonIcon}
        onButtonClick={openSelectModal}
        value={
          overrideAddressStr ||
          (isCashCustomer(customer)
            ? cashCustomerValue
            : addressId
            ? getAddressStr(Number(addressId)) || ''
            : '') ||
          ''
        }
        isView={!isCashCustomer(customer)}
        textBoxValue={cashCustomerValue}
        onTextBoxChange={onCashCustomerValueChange}
        hasPickerBtn={
          isCustomerSelected(customer) &&
          !isCashCustomer(customer)
        }
        deliveryCost={deliveryCost}
        isDelivery={isDelivery}
        updateDeliveryCost={updateDeliveryCost}
      />
    </>
  )
}

export default AddressEditCard
