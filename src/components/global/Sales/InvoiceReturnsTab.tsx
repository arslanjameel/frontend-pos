import { Card, Grid, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useState } from 'react'

// import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import InvoiceOptionBtnsWrapper from 'src/components/invoices/InvoiceOptionBtnsWrapper'
import OrderActionBtns from 'src/components/orders/OrderActionBtns'
import { useModal } from 'src/hooks/useModal'
import { ICustomer } from 'src/models/ICustomer'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { useGetInvoiceReturnsQuery } from 'src/store/apis/SalesSlice'
import { getFullName } from 'src/utils/dataUtils'
import { formatDate } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import { IData } from 'src/utils/types'

interface Props {
  invoiceId: number
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  orderInfo?: any
  invoicedProducts: any[]
  hasInvoiceBtns?: boolean
  hasOrderBtns?: boolean
}

const InvoiceReturnsTab = ({
  invoiceId,
  customerInfo,
  invoiceInfo,
  orderInfo,
  invoicedProducts,
  hasInvoiceBtns = true,
  hasOrderBtns,
}: Props) => {
  const [page, setPage] = useState(1)
  const { data: invoiceReturns } =
    useGetInvoiceReturnsQuery({ invoiceId, page })

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'return_number',
      headerName: 'ID',
      minWidth: 80,
      flex: 1,
      maxWidth: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/credit-notes/${params.row.id}/view`}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'TYPE',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        const _paymentMethods = getPaymentMethodsStr(
          getPaymentMethods(params.row),
        )

        return _paymentMethods || 'Credit'
      },
      renderCell: params => (
        <Typography fontWeight={600} sx={{ opacity: 0.9 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'AMOUNT',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'RETURN DATE',
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
      field: 'verifiedBy',
      headerName: 'VERIFIED BY',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      valueGetter: params => {
        return getFullName(params.row.user)
      },
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
        <Grid
          item
          md={hasInvoiceBtns || hasOrderBtns ? 9 : 12}
          sm={12}
          xs={12}
        >
          <Card sx={{ flex: 1, height: '100%' }}>
            <AppTable
              columns={columns}
              rows={
                invoiceReturns ? invoiceReturns.results : []
              }
              onPageChange={newPage => setPage(newPage)}
              totalRows={invoiceReturns?.count}
              miniColumns={['return_number', 'type']}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              showPageSizes={false}
              leftActionBtns={
                <Typography variant='h5' fontWeight={600}>
                  Credit Notes
                </Typography>
              }
            />
          </Card>
        </Grid>

        {hasInvoiceBtns && (
          <Grid item md={3} sm={6} xs={12}>
            <InvoiceOptionBtnsWrapper
              invoiceInfo={invoiceInfo}
              customerInfo={customerInfo}
              invoicedProducts={invoicedProducts}
            />
          </Grid>
        )}
        {hasOrderBtns && (
          <Grid item md={3} sm={6} xs={12}>
            <OrderActionBtns
              orderInfo={orderInfo}
              invoiceInfo={invoiceInfo}
            />
          </Grid>
        )}
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
                'ID:': tableData.id,
                'Type:': tableData.type,
                'Amount:': formatCurrency(tableData.total),
                'Return Date:': formatDate(
                  tableData.returnDate,
                ),
                'Verified By:': tableData.verifiedBy,
              }
            : {}
        }
      />
    </>
  )
}

export default InvoiceReturnsTab
