import { Box, Button, Typography } from '@mui/material'
import { GridColDef, GridRowId } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import { useGetCustomerPendingInvoicesQuery } from 'src/store/apis/customersSlice'
import capitalize from 'src/utils/capitalize'
import {
  addDebitCreditAvailableColumn,
  dateToString,
  divideTransactionsIntoMonths,
} from 'src/utils/dateUtils'
import { useAppSelector } from 'src/store/hooks'
import { ICustomer } from 'src/models/ICustomer'
import { buildUrl } from 'src/utils/routeUtils'

// import DateRangePicker from 'src/components/global/DateRangePicker'
// import TableSearchInput from 'src/components/global/TableSearchInput'

interface Props {
  customer_id: number
  customerInfo?: ICustomer
}

const OutstandingTab = ({
  customer_id,
  customerInfo,
}: Props) => {
  const router = useRouter()
  const { store } = useAppSelector(store => store.app)

  // const [tableSearch, setTableSearch] = useState('')
  // const [dateRange, setDateRange] = useState<string[]>([])

  const { data: customerInvoices } =
    useGetCustomerPendingInvoicesQuery({
      page: 1,
      customer_id,
    })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowsSelectedData, setRowsSelectedData] = useState<
    any[]
  >([])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  // const {
  //   openModal: openEmailDocsModal,
  //   closeModal: closeEmailDocsModal,
  //   isModalOpen: emailDocsModalStatus,
  // } = useModal<any>()

  // const {
  //   openModal: openNoDocsModal,
  //   closeModal: closeNoDocsModal,
  //   isModalOpen: noDocsModalStatus,
  // } = useModal<any>()

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'DATE',
      type: 'date',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      valueGetter: params =>
        new Date(params.row.created_at),
      renderCell: params => (
        <Typography>
          {dateToString(params.value)}
        </Typography>
      ),
    },
    {
      field: 'document',
      headerName: 'DOCUMENT',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      valueGetter: params =>
        capitalize(params.row.transaction.transaction_type),
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'invoice_number',
      headerName: 'TRANSACTION ID',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography
          color={'primary'}
          sx={{
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => {
            if (params.row.store !== store?.id) {
              toast.error(
                'Transaction does not belong to the current store',
              )
            } else {
              router.push(`/invoices/${params.row.id}/view`)
            }
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'debit',
      headerName: 'DEBIT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 14 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'credit',
      headerName: 'CREDIT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 14 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'available',
      headerName: 'AVAILABLE',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 14 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  const addInvoicePayment = () => {
    const data = {
      customer: customerInfo,

      // paidAmount:  0,
      // amountDue: invoiceInfo?.transaction.payable || 0,

      // invoice_number: invoiceInfo?.invoice_number,
      invoices: rowsSelectedData.map(inv => inv.id),
    }

    if (window) {
      window.localStorage.setItem(
        'addInvoicePayment',
        JSON.stringify(data),
      )
      router.push(buildUrl('receipts', { mode: 'new' }))
    }
  }

  return (
    <>
      <Box>
        <AppTable
          columns={columns}
          miniColumns={['date', 'document']}
          openMiniModal={openTableDataModal}
          rows={addDebitCreditAvailableColumn(
            customerInvoices
              ? customerInvoices.results
              : [],
          )}
          checkboxSelection={true}
          showPageSizes={false}
          showToolbar
          showSearch={false}
          pagination={false}
          onRowSelectionModelChange={ids => {
            setRowsSelectedData(
              (customerInvoices
                ? customerInvoices.results
                : []
              ).filter((transaction: { id: GridRowId }) =>
                ids.includes(transaction.id),
              ),
            )
          }}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Outstanding Transactions
            </Typography>
          }
          secondaryActionBtns={
            <>
              <Button
                variant='tonal'
                startIcon={<Icon icon='tabler:cash' />}
                onClick={addInvoicePayment}
              >
                Add Payment
              </Button>
              {/* <TableSearchInput
                value={tableSearch}
                onChange={setTableSearch}
              />
              <DateRangePicker
                value={dateRange}
                onChange={val => setDateRange(val)}
              /> */}
              {/* <FilterMenu>
                
                <Box sx={{ height: 5 }}></Box>
                <AppSelect
                  label=''
                  placeholder='Transaction Type'
                  value={transactionType}
                  handleChange={e =>
                    setTransactionType(e.target.value)
                  }
                  options={(transactionTypes
                    ? transactionTypes.results
                    : []
                  ).map(tr => ({
                    label: capitalize(tr.type),
                    value: tr.id,
                  }))}
                />
              </FilterMenu>
              <AppMenu
                menuItems={[
                  {
                    icon: 'tabler:cash',
                    label: 'Add Payment',
                    onClick: () =>
                      console.log('adding payment'),
                  },
                  {
                    icon: 'tabler:mail',
                    label: 'Email',
                    onClick: () => {
                      if (rowsSelectedData.length > 0) {
                        openEmailDocsModal(1)
                      } else {
                        openNoDocsModal(1)
                      }
                    },
                  },
                  {
                    icon: 'tabler:download',
                    label: 'Download',
                    onClick: () => console.log('download'),
                  },
                ]}
              /> */}
            </>
          }
        />

        <Box
          sx={{
            mb: 4,
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {divideTransactionsIntoMonths(
            addDebitCreditAvailableColumn(
              customerInvoices
                ? customerInvoices.results
                : [],
            ),
          ).map((item, i) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                px: 5,
                gap: 2,
                width: 'fit-content',
                pt: 2,
                pb: 1,
                borderTop:
                  i + 1 === 6 ? '1px solid #e3e3e3b2' : '',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  minWidth: 80,
                  textAlign: 'right',
                }}
              >
                {item.label}:
              </Typography>
              <Typography
                sx={{ minWidth: 80, textAlign: 'right' }}
              >
                {formatCurrency(item.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.transactionId}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Date:': tableData.date,
                'Document:': tableData.document,
                'Transaction ID:': tableData.transactionId,
                'Debit:': tableData.debit,
                'Credit:': tableData.credit,
              }
            : {}
        }
      />

      {/* <EmailDocumentsModal
        open={emailDocsModalStatus()}
        handleClose={closeEmailDocsModal}
        onSubmit={values => {
          toast.success(
            'TODO: Email sent to ' + values.email,
          )
          closeEmailDocsModal()
        }}
        data={{
          customerName: 'Jamal Kerrod',
          customerId: 'BGIW23',
          documents: rowsSelectedData.map(val => ({
            ...val,
            ...val.transaction,
            amount: val.total,
            documentType: capitalize(
              getTransactionTypeName(
                val.transaction.transaction_type,
              ),
            ),
          })),
        }}
      /> */}
      {/* <AppModal
        open={noDocsModalStatus()}
        handleClose={closeNoDocsModal}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ mb: 3 }}>
            No Documents Selected
          </Typography>
          <Typography>
            Please select some documents and try again
          </Typography>
        </Box>
      </AppModal> */}
    </>
  )
}

export default OutstandingTab
