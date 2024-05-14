import React from 'react'

// import AddressName from 'src/components/global/ValueComponents/AddressName'
import AddressCard from 'src/components/invoices/AddressCard'

interface Props {
  title?: string
  value: string
  isCashCustomer?: boolean
}

const AddressSection = ({
  title = 'Invoices To',
  value,
}: // isCashCustomer,
Props) => {
  // renderValue={
  //   !Boolean(value) ? (
  //     'No Address Added'
  //   ) : isCashCustomer ? (
  //     value
  //   ) : (
  //     <AddressName addressId={Number(value)} />
  //   )
  // }
  return (
    <AddressCard
      title={title}
      value={value}
      isView
      sx={{ flex: 1, gap: 0 }}
    />
  )
}

export default AddressSection
