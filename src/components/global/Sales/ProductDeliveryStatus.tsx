import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { IconButton } from '@mui/material'
import {
  IProductDeliveryStatus,
  ProductDeliveryStatus as ProdDeliveryStatus,
} from 'src/models/ISaleInvoice'
import CustomTag from '../CustomTag'

interface Props {
  status: IProductDeliveryStatus
  pendingItems?: number
  deliveredItems?: number
  icon?: boolean
}

const ProductDeliveryStatusIcon = ({
  icon = true,
  status,
}: Props) => {
  const {
    errorLight,
    successLight,
    warningLight,
    secondaryLight,
  } = UseBgColor()

  switch (status) {
    case ProdDeliveryStatus.PENDING:
      return icon ? (
        <IconButton sx={{ ...errorLight }}>
          <Icon icon='tabler:alert-circle' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label={'Pending'}
          color='error'
        />
      )

    case ProdDeliveryStatus.PARTIAL:
      return icon ? (
        <IconButton sx={{ ...warningLight }}>
          <Icon icon='tabler:circle-half-2' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label={'Partial'}
          color='warning'
        />
      )

    case ProdDeliveryStatus.COMPLETED:
      return icon ? (
        <IconButton sx={{ ...successLight }}>
          <Icon icon='tabler:circle-check' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label='Completed'
          color='success'
        />
      )

    case ProdDeliveryStatus.REFUNDED:
      return icon ? (
        <IconButton sx={{ ...secondaryLight }}>
          <Icon icon='tabler:receipt-refund' />
        </IconButton>
      ) : (
        <CustomTag
          size='small'
          label='Refunded'
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

export default ProductDeliveryStatusIcon
