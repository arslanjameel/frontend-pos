import React from 'react'
import CustomTag from '../global/CustomTag'

export const TStatus = {
  OUTSTANDING: 0,
  PARTIAL: 1,
  PROCESSED: 2,
  FULLY_PAID: 3,
  COMPLETED: 4,
} as const

export type ITStatus =
  (typeof TStatus)[keyof typeof TStatus]

export const getTransactionStatusText = (
  tStatus: ITStatus,
) => {
  switch (tStatus) {
    case TStatus.OUTSTANDING:
      return 'Outstanding'
    case TStatus.PARTIAL:
      return 'Pending'
    case TStatus.PROCESSED:
      return 'Processed'
    case TStatus.FULLY_PAID:
      return 'Paid'
    case TStatus.COMPLETED:
      return 'Completed'

    default:
      return '--'
  }
}

interface Props {
  status: ITStatus
}

const TransactionStatus = ({ status }: Props) => {
  switch (status) {
    case TStatus.OUTSTANDING:
      return <CustomTag label='Outstanding' color='error' />
    case TStatus.PARTIAL:
      return <CustomTag label='Pending' color='warning' />
    case TStatus.PROCESSED:
      return <CustomTag label='Processed' color='success' />
    case TStatus.FULLY_PAID:
      return <CustomTag label='Paid' color='success' />
    case TStatus.COMPLETED:
      return <CustomTag label='Completed' color='success' />

    default:
      return <CustomTag label='--' color='warning' />
  }
}

export default TransactionStatus
