import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import AppTable from 'src/components/global/AppTable'

// import ConfirmationModal from 'src/components/global/ConfirmationModal'
import DateRangePicker from 'src/components/global/DateRangePicker'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import useGetCityName from 'src/hooks/useGetCityName'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  useGetReceiptSearchQuery,
  useGetSingleReceiptQuery,

  // useDeleteSingleReceiptMutation,
} from 'src/store/apis/receiptsSlice'
import { useAppSelector } from 'src/store/hooks'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import capitalize from 'src/utils/capitalize'
import { getFullName } from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { EMAIL_RECEIPT_BODY } from 'src/utils/globalConstants'
import {
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import {
  downloadPDFAction,
  emailPDFAction,
} from 'src/utils/pdfUtils'
import { generateReceiptPDF } from 'src/utils/pdfs/generateReceiptPDF'
import { buildUrl } from 'src/utils/routeUtils'
import { IData } from 'src/utils/types'

const PaymentsList = () => {
  const { getCity } = useGetCityName()
  const { store } = useAppSelector(state => state.app)
  const [search, setSearch] = useState({
    search: '',
    start: '',
    end: '',
    page: 1,
    store: store?.id,
  })
  useEffect(() => {
    if (store.id !== 0) {
      setSearch({
        ...search,
        store: store?.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])
  const router = useRouter()

  const [dateRange, setDateRange] = useState<string[]>([])

  const { data: receipts } = useGetReceiptSearchQuery({
    ...search,
    start: dateRange[0]
      ? formatDate(
          new Date(dateRange[0] || '').toISOString(),
          'yyyy-MM-dd',
        )
      : '',
    end: dateRange[1]
      ? formatDate(
          new Date(dateRange[1] || '').toISOString(),
          'yyyy-MM-dd',
        )
      : '',
  })
  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  // const {
  //   modalData: deleteModal,
  //   openModal: openDeleteModal,
  //   closeModal: closeDeleteModal,
  //   isModalOpen: deleteModalStatus,
  // } = useModal<number>()

  const {
    modalData: receiptToEmail,
    openModal: openEmailReceiptModal,
    closeModal: closeEmailReceiptModal,
    isModalOpen: emailReceiptModalStatus,
  } = useModal<any>()

  const { data: receiptData } = useGetSingleReceiptQuery(
    receiptToEmail?.id,
  )
  const paymentMethods = getPaymentMethods(
    receiptToEmail,
  ).reduce((acc, opt) => {
    // @ts-ignore
    acc[opt.title] = formatCurrency(opt.amount)

    return acc
  }, {})

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = receiptToEmail?.customer?.email || '',
  ) => {
    if (receiptToEmail) {
      const receiptTitle =
        'Receipt ' + receiptToEmail?.receipt_number

      const emailInfo = {
        email: emailTo || '',
        email_title: receiptTitle,
        email_body: EMAIL_RECEIPT_BODY,
        store_id: store.id,
      }

      const receiptPDF = generateReceiptPDF({
        title: receiptTitle,
        storeName: store?.name,
        payments: (receiptData?.receipt_track || []).map(
          (receipt: any) => ({
            amount_cleared: receipt.amount_cleared,
            invoice_number:
              receipt?.sale_invoice?.invoice_number,
          }),
        ),
        receiptTopData: {
          'Receipt Date': dateToString(
            new Date(receiptToEmail?.created_at || ''),
            'dd/MM/yyyy',
          ),
          'Receipt Time': dateToString(
            new Date(receiptToEmail?.created_at || ''),
            'HH:mm',
          ),
          'Customer No.':
            receiptToEmail?.customer?.id || '',
          'Customer Ref.':
            receiptToEmail?.customer_ref || '',
          'Raised By':
            getFullName(receiptToEmail?.user) || '',
        },
        totals: {
          'Payment Method': getPaymentMethodsStr(
            getPaymentMethods(receiptToEmail),
          ),
          'Net Amount': formatCurrency(
            Number(receiptToEmail?.payment) / 1.2,
          ),
          'VAT Amount': formatCurrency(
            Number(receiptToEmail?.payment) -
              Number(receiptToEmail?.payment) / 1.2,
          ),
          'Gross Amount': formatCurrency(
            receiptToEmail?.payment,
          ),
          ' ': '',
          'Paid Amount': formatCurrency(
            Number(receiptToEmail?.payment) || 0,
          ),
          ...paymentMethods,
        },
        storeAddress: [
          capitalize(store.storeAddress),
          getCity(store.city),
          store.postalCode,
          '',
          `Tel No.   ${store.phone}`,
          `Email   ${store.email}`,
        ],
      })

      if (action === 'email') {
        emailPDFAction(receiptPDF, emailInfo, receiptTitle)
          .then(res => {
            if (hasErrorKey(res as any)) {
              toast.error(extractErrorMessage(res as any))
            } else {
              toast.success('Email sent successfully')
            }
          })
          .catch(err => {
            toast.error(extractErrorMessage(err as any))
          })
      } else {
        downloadPDFAction(receiptPDF, receiptTitle)
      }
    } else {
      toast.error('Receipt Not Selected')
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailReceiptModal()
    pdfAction('email', values.email)
  }

  const receiptType = (invoice: any) => {
    const types = []
    if (Number(invoice.paid_from_bacs) !== 0) {
      types.push('BACS')
    }
    if (Number(invoice.paid_from_card) !== 0) {
      types.push('Card')
    }
    if (Number(invoice.paid_from_cash) !== 0) {
      types.push('Cash')
    }
    if (Number(invoice.paid_from_credit) !== 0) {
      types.push('Credit')
    }
    const type = types.toString()

    return type.replace(',', ' , ')
  }

  const columns: GridColDef[] = [
    {
      field: 'receipt_number',
      headerName: 'RECEIPT',
      width: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/receipts/${params.row.id}/view`}
            style={{ fontWeight: 600 }}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'TYPE',
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{receiptType(params.row)}</Typography>
      ),
    },
    {
      field: 'payment',
      headerName: 'AMOUNT',
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value).toFixed(2))}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'CUSTOMER',
      type: 'string',
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        return getFullName(params.value)
      },
      renderCell: params => (
        <Typography>
          <Link
            href={buildUrl('customers', {
              itemId: params.row.customer?.id,
            })}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'CREATED DATE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      disableColumnMenu: true,
      sortable: true,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'id',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 130,
      cellClassName: 'yes-overflow',
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <IconButton
              color='primary'
              onClick={() =>
                openEmailReceiptModal(params.row)
              }
            >
              <Icon icon='tabler:mail' />
            </IconButton>
            {/* <IconButton
              color='error'
              onClick={() => openDeleteModal(params.row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton> */}
          </Box>
        )
      },
    },
  ]

  // const _deleteCategory = () => {
  //   deleteSingleReceipt(deleteModal as number)
  //     .unwrap()
  //     .then(() => {
  //       toast.success('Receipt deleted successfully')
  //     })
  //     .catch(() => toast.error('An error occured'))
  // }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Payment Receipts', to: '/receipts' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            columns={columns}
            rows={receipts ? receipts.results : []}
            miniColumns={['receiptNumber', 'amount']}
            openMiniModal={openTableDataModal}
            showToolbar
            showSearch={false}
            onPageChange={val => {
              const filter = { ...search }
              filter.page = val
              setSearch(filter)
            }}
            totalRows={receipts?.count}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href='/receipts/new'>
                  <ResponsiveButton
                    label='New Payment'
                    icon='tabler:plus'
                    mini={isMobileSize}
                  />
                </Link>
              </Box>
            }
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  placeholder='Search Receipts'
                  value={search.search}
                  onChange={val => {
                    const filter = { ...search }
                    filter.search = val
                    setSearch(filter)
                  }}
                  sx={{ minWidth: '200px' }}
                />
                <DateRangePicker
                  value={dateRange}
                  onChange={val => setDateRange(val)}
                />
              </Box>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of #${tableData.receiptNumber}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Receipt:': tableData.receiptNumber,
                'Type:': tableData.type.toUpperCase(),
                'Customer:': getFullName(tableData),
                'Amount:': formatCurrency(tableData.amount),
                'Created Date:': formatDate(
                  tableData.createdAt,
                ),
              }
            : {}
        }
        actionBtns={
          tableData && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                color='primary'
                onClick={() => {
                  openEmailReceiptModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:mail' />
              </IconButton>
              <IconButton
                color='primary'
                onClick={() =>
                  router.push(
                    `/receipts/${tableData.id}/edit`,
                  )
                }
              >
                <Icon icon='tabler:edit' />
              </IconButton>
              {/* <IconButton
                color='error'
                onClick={() => {
                  openDeleteModal(tableData.id)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton> */}
            </Box>
          )
        }
      />

      {/* <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Receipt'
        content={
          'Are you sure you want to delete this receipt?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteCategory}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      /> */}

      {/* <EmailModal
        open={emailReceiptModalStatus()}
        handleClose={closeEmailReceiptModal}
        onSubmit={({ email }) => {
          toast.success(`TODO: Email sent to ${email}`)
          closeEmailReceiptModal()
        }}
        title='Email Customer'
        data={{
          'Customer Name':
            receiptToEmail && getFullName(receiptToEmail),
          'Document ID':
            receiptToEmail && receiptToEmail.id,
          'Document Type': 'Receipt',
          'Document Date':
            receiptToEmail && receiptToEmail.created_at,
        }}
      /> */}

      <EmailCustomerModal
        data={{
          email: receiptToEmail?.customer?.email || '',
          customerName:
            getFullName(receiptToEmail?.customer) || '',
          documentDate: dateToString(
            new Date(receiptToEmail?.created_at || ''),
          ),
          documentId: receiptToEmail?.receipt_number || '',
          documentType: 'Receipt',
        }}
        onSubmit={({ email }) =>
          confirmSendEmail({ email })
        }
        open={emailReceiptModalStatus()}
        handleClose={closeEmailReceiptModal}
      />
    </>
  )
}

PaymentsList.acl = {
  action: 'read',
  subject: 'receipt',
}

export default PaymentsList
