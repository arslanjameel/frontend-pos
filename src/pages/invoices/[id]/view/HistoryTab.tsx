import { Card, Grid, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'

// import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import InvoiceOptionBtnsWrapper from 'src/components/invoices/InvoiceOptionBtnsWrapper'
import { useModal } from 'src/hooks/useModal'
import { ICustomer } from 'src/models/ICustomer'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { formatDate } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'

interface Props {
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  invoicedProducts: any[]
}

const HistoryTab = ({
  customerInfo,
  invoiceInfo,
  invoicedProducts,
}: Props) => {
  const data = [
    {
      id: 12,
      date: '9/04/2022',
      comment: 'Invoice Created',
      user: 'John Doe',
    },
    {
      id: 122,
      date: '9/04/2022',
      comment: `Payment of ${formatCurrency(300)} added`,
      user: 'John Doe',
    },
    {
      id: 22,
      date: '9/04/2022',
      comment: 'Items marked as delivered',
      user: 'John Doe',
    },
  ]

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'DATE',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'comment',
      headerName: 'COMMENT',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {params.value.toUpperCase()}
        </Typography>
      ),
    },
    {
      field: 'user',
      headerName: 'USER',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 1,
      maxWidth: 200,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
  ]

  return (
    <>
      <Grid
        container
        columns={12}
        rowSpacing={6}
        columnSpacing={6}
      >
        <Grid item md={9} sm={12} xs={12}>
          <Card sx={{ flex: 1 }}>
            <AppTable
              columns={columns}
              rows={data}
              miniColumns={['id', 'comment']}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              showPageSizes={false}
              leftActionBtns={
                <Typography variant='h5' fontWeight={600}>
                  History
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item md={3} sm={6} xs={12}>
          <InvoiceOptionBtnsWrapper
            invoiceInfo={invoiceInfo}
            customerInfo={customerInfo}
            invoicedProducts={invoicedProducts}
          />
        </Grid>
      </Grid>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'Date:': formatDate(tableData.date),
                'Comment:': tableData.comment,
                'User:': tableData.user,
              }
            : {}
        }
      />
    </>
  )
}

export default HistoryTab
