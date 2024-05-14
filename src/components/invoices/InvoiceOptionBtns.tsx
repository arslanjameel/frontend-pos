import { Box, Button } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import AppBtn from '../global/AppBtn'

interface Props {
  amountDue?: number
  emailBtnAction?: () => void
  downloadAction?: () => void
  addPaymentAction?: () => void
  voidAction?: () => void
  editAction?: () => void
  returnAction?: () => void
}

const Btn = ({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick?: () => void
}) => (
  <Button
    variant='contained'
    sx={{ width: '100%', py: 2.8 }}
    startIcon={<Icon icon={icon} />}
    onClick={onClick}
  >
    {label}
  </Button>
)

const InvoiceOptionBtns = ({
  amountDue = 0,
  emailBtnAction,
  downloadAction,
  addPaymentAction,

  // voidAction,
  editAction,
  returnAction,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Btn
        icon='tabler:mail'
        label='Email Invoice'
        onClick={emailBtnAction}
      />
      <Btn
        icon='tabler:file-download'
        label='Download'
        onClick={downloadAction}
      />
      {/* <Grid container columns={12} rowSpacing={2} columnSpacing={2}>
        <Grid item md={6} sm={12} xs={12}>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
        </Grid>
      </Grid> */}

      {/* <AppBtn
        icon='tabler:trash'
        text='Void Invoice'
        onClick={voidAction}
      /> */}

      <AppBtn
        icon='tabler:cash'
        text='Add Payment'
        color={amountDue > 0 ? 'primary' : 'secondary'}
        disabled={amountDue <= 0}
        onClick={addPaymentAction}
      />
      <AppBtn
        icon='tabler:edit'
        text='Edit'
        onClick={editAction}
      />
      <AppBtn
        icon='tabler:receipt-refund'
        text='Return'
        onClick={returnAction}
      />
      {/* <AppBtn
                icon='tabler:truck-delivery'
                text='Delivery Notes'
                onClick={() => openDeliveryNotesModal(invoicedProducts)}
              /> */}
    </Box>
  )
}

export default InvoiceOptionBtns
