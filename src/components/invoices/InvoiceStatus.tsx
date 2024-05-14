import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTag from '../global/CustomTag'
import { IconButton } from '@mui/material'
import {
  IInvoiceStatus,
  InvoiceStatus as InvStatus,
} from 'src/models/ISaleInvoice'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  status: IInvoiceStatus
  amount?: number
  icon?: boolean
}

const InvoiceStatus = ({
  icon,
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
    case InvStatus.PENDING:
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

    // case InvStatus.Partial:
    //   return icon ? (
    //     <IconButton sx={{ ...warningLight }}>
    //       <Icon icon='tabler:brightness-half' />
    //     </IconButton>
    //   ) : (
    //     <CustomTag size='small' label={formatCurrency(amount)} color='warning' />
    //   )
    case InvStatus.PAID:
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

    // case InvStatus.Returned:
    case InvStatus.CLEARED:
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

export default InvoiceStatus

// import React from 'react'

// import Icon from 'src/@core/components/icon'
// import UseBgColor from 'src/@core/hooks/useBgColor'
// import CustomTag from '../global/CustomTag'
// import { formatCurrency } from 'src/utils/formatCurrency'
// import { IconButton } from '@mui/material'

// interface Props {
//   status: 0 | 1 | 2 | 3
//   amount?: number
//   icon?: boolean
// }

// const InvoiceStatus = ({ icon, status, amount }: Props) => {
//   const { errorLight, successLight, warningLight, secondaryLight } = UseBgColor()

//   switch (status) {
//     case 0:
//       return icon ? (
//         <IconButton sx={{ ...errorLight }}>
//           <Icon icon='tabler:alert-circle' />
//         </IconButton>
//       ) : (
//         <CustomTag size='small' label={formatCurrency(amount)} color='error' />
//       )
//     case 1:
//       return icon ? (
//         <IconButton sx={{ ...warningLight }}>
//           <Icon icon='tabler:brightness-half' />
//         </IconButton>
//       ) : (
//         <CustomTag size='small' label={formatCurrency(amount)} color='warning' />
//       )
//     case 2:
//       return icon ? (
//         <IconButton sx={{ ...successLight }}>
//           <Icon icon='tabler:circle-check' />
//         </IconButton>
//       ) : (
//         <CustomTag size='small' label='Paid' color='success' />
//       )
//     case 3:
//       return icon ? (
//         <IconButton sx={{ ...secondaryLight }}>
//           <Icon icon='tabler:receipt-refund' />
//         </IconButton>
//       ) : (
//         <CustomTag size='small' label='Returned' color='secondary' />
//       )
//     default:
//       return icon ? (
//         <IconButton sx={{ ...secondaryLight }}>
//           <Icon icon='tabler:alert-circle' />
//         </IconButton>
//       ) : (
//         <CustomTag size='small' label='--' color='secondary' />
//       )
//   }
// }

// export default InvoiceStatus
