import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Box, Button, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import {
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import AppModal from '../global/AppModal'
import ControlledInput from '../global/ControlledInput'
import { formatCurrency } from 'src/utils/formatCurrency'
import AppTable from '../global/AppTable'
import capitalize from 'src/utils/capitalize'
import { formatDate } from 'src/utils/dateUtils'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: { email: string }) => void
  data: {
    customerName: string
    customerId: string
    email?: string
    documents: any[]
  }
  from?: 'customer' | 'supplier'
}

const EmailDocumentsModal = ({
  open,
  handleClose,
  onSubmit,
  data,
  from = 'customer',
}: Props) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(emailInvalidErr())
      .required(requiredMsg('Email')),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'DATE',
      type: 'string',
      minWidth: 50,
      maxWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'transaction_number',
      headerName: 'ID',
      type: 'string',
      minWidth: 50,
      maxWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'documentType',
      headerName: 'DOCUMENT',
      type: 'string',
      minWidth: 50,
      maxWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      type: 'number',
      minWidth: 50,
      maxWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
  ]

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={600}
      sx={{ p: 5, pt: 10 }}
    >
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        <Typography
          id='modal-modal-title'
          variant='h4'
          sx={{
            textAlign: 'center',
            mb: 5,
            fontWeight: 700,
          }}
        >
          Email {capitalize(from)}
        </Typography>
        <Typography sx={{ textAlign: 'center', mb: 5 }}>
          List of documents to email {from}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              minWidth: 'fit-content',
              height: 57,
              flex: 1,
            }}
          >
            <Typography>{capitalize(from)} Name</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.customerName}
            </Typography>
          </Box>
          <Box
            sx={{
              minWidth: 'fit-content',
              height: 57,
              flex: 1,
            }}
          >
            <Typography>{capitalize(from)} ID</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {data.customerId}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 6 }}>
          <ControlledInput
            inputType='email'
            name='email'
            control={control}
            label={`${capitalize(from)} Email`}
            error={errors.email}
            placeholder={`Default ${capitalize(
              from,
            )} email address`}
          />
        </Box>

        <Box
          sx={{
            border: '1px solid rgba(219, 218, 222, 1)',
          }}
        >
          <AppTable
            pagination={false}
            columns={columns}
            rows={data.documents}
            showToolbar={false}
          />
        </Box>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant='contained' type='submit'>
            Send
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default EmailDocumentsModal
