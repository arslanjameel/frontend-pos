import React from 'react'
import { Box, Typography } from '@mui/material'
import AppModal from '../global/AppModal'
import { formatDate } from 'src/utils/dateUtils'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useRouter } from 'next/router'

interface Props {
  title: string
  subTitle: string
  open: boolean
  handleClose: () => void
  invoices: any
}

const GoToInvoiceModal = ({
  title,
  subTitle,
  open,
  handleClose,
  invoices,
}: Props) => {
  const { primaryLight } = UseBgColor()
  const router = useRouter()

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      title={title}
      subTitle={subTitle}
    >
      <Box sx={{ mb: 4 }}>
        {invoices.map((e: any, i: number) => (
          <Box
            key={i}
            onClick={() =>
              router.push(
                `/invoices/${e.sale_invoice.id}/view`,
              )
            }
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              '&:hover': { ...primaryLight },
              cursor: 'pointer',
            }}
            mx={4}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {e.sale_invoice.invoice_number}
            </Typography>
            <Typography>
              {formatDate(e.sale_invoice.created_at)}
            </Typography>
          </Box>
        ))}
      </Box>
    </AppModal>
  )
}

export default GoToInvoiceModal
