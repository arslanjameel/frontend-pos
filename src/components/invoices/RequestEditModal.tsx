import React, { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'

import AppModal from '../global/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import { formatDate } from 'src/utils/dateUtils'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: { details: string }) => void
  data: {
    store: string
    documentId: string
    customerName: string
    documentDate: string
    documentType: string
  }
}

const RequestEditModal = ({
  open,
  handleClose,
  onSubmit,
  data,
}: Props) => {
  const [details, setDetails] = useState('')

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      title='Request Edit'
      maxWidth={500}
    >
      <Box sx={{ mb: 4 }}>
        <Grid container columns={12} spacing={4}>
          <Grid item md={6} sm={6} xs={12}>
            <Typography>Store</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.store}
            </Typography>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Typography>Document ID</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.documentId}
            </Typography>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Typography>Customer Name</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.customerName}
            </Typography>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Typography>Document Date</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {formatDate(data.documentDate)}
            </Typography>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Typography>Document Type</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.documentType}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <CustomTextField
        label='Edit Request Details'
        multiline
        fullWidth
        minRows={4}
        value={details}
        onChange={e => setDetails(e.target.value)}
        placeholder='...'
      />

      <Box
        sx={{
          mt: 5,
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          variant='contained'
          onClick={() => onSubmit({ details })}
        >
          Submit Request
        </Button>
        <Button
          variant='tonal'
          color='secondary'
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Box>
    </AppModal>
  )
}

export default RequestEditModal
