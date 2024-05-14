import React, { useState } from 'react'
import AppModal from '../global/AppModal'
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Typography,
} from '@mui/material'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (copyToNewInvoice: boolean) => void
}

const VoidInvoiceModal = ({
  open,
  onClose,
  onConfirm,
}: Props) => {
  const [copyToNewInvoice, setCopyToNewInvoice] =
    useState(false)

  return (
    <AppModal
      maxWidth={400}
      open={open}
      handleClose={onClose}
      sx={{ p: 5 }}
    >
      <Typography variant='h5' fontWeight={600}>
        Void Invoice
      </Typography>

      <Typography sx={{ mt: 3, mb: 3.5 }}>
        Are you sure you would like to void this invoice?
      </Typography>

      <FormLabel
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Checkbox
          sx={{ pl: 0 }}
          value={copyToNewInvoice}
          onChange={(_, checked) =>
            setCopyToNewInvoice(checked)
          }
        />
        Copy contents to new invoice
      </FormLabel>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          mt: 3,
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            onClose()
            onConfirm(copyToNewInvoice)
          }}
        >
          Yes
        </Button>
        <Button
          variant='tonal'
          color='secondary'
          onClick={() => {
            onClose()
          }}
        >
          No
        </Button>
      </Box>
    </AppModal>
  )
}

export default VoidInvoiceModal
