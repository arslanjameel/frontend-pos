import React from 'react'
import { Card } from '@mui/material'

import InvoiceCard from './InvoiceCard'
import AppModal from '../global/AppModal'
import { IData } from 'src/utils/types'
import { IPayInfo } from 'src/types/IPayInfo'

interface Props {
  products: any[]
  totalsData: {
    gross: number
    net: number
    vat: number
    sub: number
  }
  amountDue?: number
  delivery?: number
  discount?: number
  customerInfo: IData
  paymentInfo: IPayInfo[]
  invoiceAddress: number
  deliveryAddress: number

  open: boolean
  handleClose: () => void
}

const PreviewModal = ({
  products,
  totalsData,
  amountDue,
  discount,
  delivery,
  customerInfo,
  paymentInfo,
  invoiceAddress,
  deliveryAddress,
  open,
  handleClose,
}: Props) => {
  return (
    <AppModal
      maxWidth={900}
      open={open}
      handleClose={handleClose}
    >
      <Card sx={{ flex: 1 }}>
        <InvoiceCard
          delivery={delivery}
          discount={discount}
          totalsData={totalsData}
          amountDue={amountDue}
          paymentInfo={paymentInfo}
          products={products}
          customerInfo={customerInfo}
          invoiceAddress={invoiceAddress}
          deliveryAddress={deliveryAddress}
        />
      </Card>
    </AppModal>
  )
}

export default PreviewModal
