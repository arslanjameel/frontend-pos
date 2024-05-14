import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTag from '../global/CustomTag'
import { IconButton } from '@mui/material'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  ProductDeliveryStatus,
  IProductDeliveryStatus,
} from 'src/models/IOrder'

interface Props {
  status: IProductDeliveryStatus
  amount?: number
  icon?: boolean
}

const OrderDeliveryStatus = ({
  icon = true,
  amount = 0,
  status,
}: Props) => {
  const {
    errorLight,
    successLight,

    // warningLight,
    secondaryLight,
  } = UseBgColor()

  switch (status) {
    case ProductDeliveryStatus.PENDING:
      return icon ? (
        <IconButton sx={{ ...errorLight }}>
          <Icon icon='tabler:alert-circle' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label={formatCurrency(amount)}
          color='error'
        />
      )

    case ProductDeliveryStatus.COMPLETED:
      return icon ? (
        <IconButton sx={{ ...successLight }}>
          <Icon icon='tabler:circle-check' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label='Paid'
          color='success'
        />
      )

    // case ProductDeliveryStatus.Returned:
    case ProductDeliveryStatus.REFUNDED:
      return icon ? (
        <IconButton sx={{ ...secondaryLight }}>
          <Icon icon='tabler:receipt-refund' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label='Returned'
          color='secondary'
        />
      )
    default:
      return icon ? (
        <IconButton sx={{ ...secondaryLight }}>
          <Icon icon='tabler:alert-circle' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label='--'
          color='secondary'
        />
      )
  }
}

export default OrderDeliveryStatus
