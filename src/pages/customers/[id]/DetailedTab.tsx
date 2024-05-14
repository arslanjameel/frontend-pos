import { Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import AppTable from 'src/components/global/AppTable'
import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'
import { formatCurrency } from 'src/utils/formatCurrency'
import TableDataModal from 'src/components/global/TableDataModal'
import TransactionStatus from 'src/components/customers/TransactionStatus'
import AppMenu from 'src/components/global/AppMenu'
import FilterMenu from 'src/components/global/FilterMenu'
import DateRangePicker from 'src/components/global/DateRangePicker'
import EmailDocumentsModal from 'src/components/customers/EmailDocumentsModal'
import AppSelect from 'src/components/global/AppSelect'
import AppModal from 'src/components/global/AppModal'
import {
  dateToString,
  formatDate,
  sortByDate,
} from 'src/utils/dateUtils'
import { useGetCustomerTransactionsQuery } from 'src/store/apis/customersSlice'
import {
  invoicesApi,
  useGetTransactionTypesQuery,
} from 'src/store/apis/invoicesSlice'
import useGetTransactionTypeName from 'src/hooks/useGetTransactionTypeName'
import capitalize from 'src/utils/capitalize'
import TableSearchInput from 'src/components/global/TableSearchInput'
import { useAppSelector } from 'src/store/hooks'
import { addTransactionInfo } from 'src/utils/transactionUtils'
import { downloadPDFAction } from 'src/utils/pdfUtils'
import useGeneratePDFDoc from 'src/hooks/useGeneratePDFDoc'
import { receiptsApi } from 'src/store/apis/receiptsSlice'
import { SalesApi } from 'src/store/apis/SalesSlice'

interface Props {
  customer_id: number
  customerInfo?: any
}

const DetailedTab = ({
  customer_id,
  customerInfo,
}: Props) => {
  const router = useRouter()
  const { store } = useAppSelector(state => state.app)

  const {
    generateInvoiceDoc,
    generateReceiptDoc,
    generateReturnDoc,
  } = useGeneratePDFDoc()

  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')

  const [dateRange, setDateRange] = useState<string[]>([])
  const [invoiceStatus, setInvoiceStatus] = useState('all')

  const { data: transactions, isLoading } =
    useGetCustomerTransactionsQuery({
      customer_id,
      page,
      searchTerm: tableSearch,
      startDate: dateRange[0]
        ? formatDate(
            new Date(dateRange[0] || '').toISOString(),
            'yyyy-MM-dd',
          )
        : '',
      endDate: dateRange[1]
        ? formatDate(
            new Date(dateRange[1] || '').toISOString(),
            'yyyy-MM-dd',
          )
        : '',
      status: invoiceStatus === 'all' ? '' : invoiceStatus,
    })

  const { data: transactionTypes } =
    useGetTransactionTypesQuery()
  const { getTransactionTypeName } =
    useGetTransactionTypeName(
      transactionTypes ? transactionTypes.results : [],
    )

  const [rowsSelectedData, setRowsSelectedData] = useState<
    any[]
  >([])

  const [getSingleInvoice] =
    invoicesApi.endpoints.getSingleInvoice.useLazyQuery()

  const [getSingleReceipt] =
    receiptsApi.endpoints.getSingleReceipt.useLazyQuery()

  const [getSingleReturn] =
    SalesApi.endpoints.getSinglereturnSale.useLazyQuery()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    openModal: openEmailDocsModal,
    closeModal: closeEmailDocsModal,
    isModalOpen: emailDocsModalStatus,
  } = useModal<any>()

  const {
    openModal: openNoDocsModal,
    closeModal: closeNoDocsModal,
    isModalOpen: noDocsModalStatus,
  } = useModal<any>()

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'DATE',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      type: 'date',
      disableColumnMenu: true,
      valueGetter: params => new Date(params.value),
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
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'transaction_number',
      headerName: 'TRANSACTION ID',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography
          color={'primary'}
          sx={{ fontWeight: 600, cursor: 'pointer' }}
          onClick={() => {
            if (params.row?.store !== store?.id) {
              toast.error(
                'Transaction does not belong to the current store',
              )
            } else {
              router.push(params.row.link)
            }
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'AMOUNT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <TransactionStatus status={params.value} />
      ),
    },
  ]

  const pdfAction = (
    action: 'email' | 'download',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emailTo = customerInfo?.email,
  ) => {
    const tempTransactions = addTransactionInfo(
      rowsSelectedData,
    )

    tempTransactions.forEach(async row => {
      if (row.document === 'Invoice') {
        getSingleInvoice(row.id)
          .unwrap()
          .then(res => {
            const invoiceDoc = generateInvoiceDoc(res)

            downloadPDFAction(
              invoiceDoc,
              'Invoice ' + row.transaction_number,
            )
          })
          .catch(err => console.error(err))
      } else if (row.document === 'Receipt') {
        getSingleReceipt(row.id)
          .unwrap()
          .then(res => {
            const receiptDoc = generateReceiptDoc(res)

            downloadPDFAction(
              receiptDoc,
              'Receipt ' + row.transaction_number,
            )
          })
          .catch((err: any) => console.error(err))
      } else if (row.document === 'Return') {
        getSingleReturn(row.id)
          .unwrap()
          .then(res => {
            getSingleInvoice(res.sale_invoices.id)
              .unwrap()
              .then(invoiceInfo => {
                const returnDoc = generateReturnDoc(
                  res,
                  invoiceInfo,
                )

                downloadPDFAction(
                  returnDoc,
                  'Return ' + row.transaction_number,
                )
              })
              .catch(err => console.error(err))
          })
          .catch((err: any) => console.error(err))
      }
    })

    // const docFileName = 'Detailed Transactions'

    // const pdf = generateCustomerTransactionsPDF({
    //   transactions: sortByDate(
    //     addTransactionInfo(rowsSelectedData),
    //     'created_at',
    //     false,
    //   ).map(statement => ({
    //     ...statement,
    //     date: dateToString(new Date(statement.created_at)),
    //     document: statement.document,
    //     transaction: statement.transaction_number,
    //     amount: formatCurrency(statement.total),
    //     status: getTransactionStatusText(statement.status),
    //   })),
    //   tableItems: {
    //     'Statement Date': dateToString(
    //       new Date(),
    //       'dd/MM/yyyy',
    //     ),
    //     'Customer No.': customer_id,
    //     '': '',
    //     '': '',
    //   },
    //   billingAddressTitle: customerInfo?.accountName,
    //   billingAddress: [
    //     getDefaultBilling().addressLine1,
    //     getCity(getDefaultBilling().city),
    //     getDefaultBilling().postCode,
    //   ],
    //   storeName: store.name,

    //   storeAddress: [
    //     store.storeAddress,
    //     getCity(store.city),
    //     store.postalCode,
    //     '',
    //     'Tel No: ' + store.phone,
    //     'Email: ' + store.email,
    //   ],
    // })

    // if (store) {
    //   if (customerInfo) {
    //     // const emailInfo = {
    //     //   email: emailTo || '',
    //     //   email_title: docFileName,

    //     //   // email_body: EMAIL_INVOICE_BODY,
    //     //   store_id: store?.id,
    //     // }

    //     if (action === 'email') {
    //       // emailPDF(invoiceDoc, emailInfo, docFileName)
    //       //   .then(res => {
    //       //     if (hasErrorKey(res as any)) {
    //       //       toast.error(extractErrorMessage(res as any))
    //       //     } else {
    //       //       toast.success('Email sent successfully')
    //       //     }
    //       //   })
    //       //   .catch(err => {
    //       //     toast.error(extractErrorMessage(err as any))
    //       //   })
    //     } else {
    //       downloadPDFAction(pdf, docFileName)
    //     }
    //   }
    // } else {
    //   toast.error('Select a store')
    // }
  }

  return (
    <>
      <Box>
        <AppTable
          isLoading={isLoading}
          columns={columns}
          miniColumns={['created_at', 'document']}
          openMiniModal={openTableDataModal}
          rows={sortByDate(
            addTransactionInfo(
              transactions?.transactions || [],
            ),
            'created_at',
            false,
          )}
          checkboxSelection={true}
          showPageSizes={false}
          showToolbar
          showSearch={false}
          totalRows={
            transactions
              ? transactions.transactions.length
              : 0
          }
          onPageChange={newPage => setPage(newPage)}
          onRowSelectionModelChange={ids => {
            setRowsSelectedData(
              (transactions?.transactions || []).filter(
                transaction => ids.includes(transaction.id),
              ),
            )
          }}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Detailed Transaction
            </Typography>
          }
          secondaryActionBtns={
            <>
              <TableSearchInput
                value={tableSearch}
                onChange={setTableSearch}
              />
              <FilterMenu>
                <DateRangePicker
                  value={dateRange}
                  onChange={val => setDateRange(val)}
                />
                <Box sx={{ height: 5 }}></Box>
                <AppSelect
                  label=''
                  placeholder='Select Status'
                  value={invoiceStatus}
                  handleChange={e =>
                    setInvoiceStatus(e.target.value)
                  }
                  options={[
                    {
                      label: 'All',
                      value: 'all',
                    },
                    {
                      label: 'Cleared',
                      value: 'cleared',
                    },
                    { label: 'Paid', value: 'paid' },
                    {
                      label: 'Pending',
                      value: 'pending',
                    },
                    {
                      label: 'Partial',
                      value: 'partial',
                    },
                    { label: 'Void', value: 'void' },
                  ]}
                  maxWidth={130}
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
                    onClick: () => pdfAction('download'),
                  },
                ]}
              />
            </>
          }
        />
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
                'Transaction ID:':
                  tableData?.transaction_number || '',
                'Amount:': tableData.amount,
              }
            : {}
        }
      />

      <EmailDocumentsModal
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
            amount: val.total,
            documentType: capitalize(
              getTransactionTypeName(val.transaction_type),
            ),
          })),
        }}
      />

      <AppModal
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
      </AppModal>
    </>
  )
}

export default DetailedTab
