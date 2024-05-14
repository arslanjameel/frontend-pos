import { Box, Button, Typography } from '@mui/material'
import React from 'react'

import AppModal from '../global/AppModal'

interface Props {
  open: boolean
  handleClose: () => void
  title: string
  content: string | React.ReactNode
  maxWidth?: number
  confirmTitle: string
  confirmColor?:
    | 'primary'
    | 'success'
    | 'error'
    | 'secondary'
  onConfirm: () => void
  rejectTitle: string
  rejectColor?:
    | 'primary'
    | 'success'
    | 'error'
    | 'secondary'
  onReject: () => void
}

const CreditModal = ({
  open,
  handleClose,
  title,
  content,
  maxWidth,
  confirmTitle,
  confirmColor = 'primary',
  onConfirm,
  rejectTitle,
  rejectColor = 'secondary',
  onReject,
}: Props) => {
  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={maxWidth}
      sx={{ p: 6 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Box>{content}</Box>

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
            color={confirmColor}
            onClick={() => {
              handleClose()
              onConfirm()
            }}
          >
            {confirmTitle}
          </Button>
          <Button
            variant='tonal'
            color={rejectColor}
            onClick={() => {
              handleClose()
              onReject()
            }}
          >
            {rejectTitle}
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}

export default CreditModal
