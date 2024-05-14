import React from 'react'

import CustomTag from '../global/CustomTag'
import {
  IProductDeliveryStatus,
  ProductDeliveryStatus,
} from 'src/models/ISaleInvoice'

interface Props {
  status: IProductDeliveryStatus
}

const DeliveryStatusTag = ({ status }: Props) => {
  switch (status) {
    case ProductDeliveryStatus.COMPLETED:
      return (
        <CustomTag
          size='small'
          label='Completed'
          color='success'
        />
      )
    case ProductDeliveryStatus.PARTIAL:
      return (
        <CustomTag
          size='small'
          label='Partial'
          color='warning'
        />
      )
    case ProductDeliveryStatus.PENDING:
      return (
        <CustomTag
          size='small'
          label='Pending'
          color='warning'
        />
      )
    case ProductDeliveryStatus.REFUNDED:
      return (
        <CustomTag
          size='small'
          label='Refunded'
          color='error'
        />
      )
    case ProductDeliveryStatus.VOID:
      return (
        <CustomTag
          size='small'
          label='Void'
          color='secondary'
        />
      )
  }
}

export default DeliveryStatusTag
