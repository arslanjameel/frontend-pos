import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import DateRangePicker from 'src/components/global/DateRangePicker'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  getFullName,
  includeVAT,
} from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import {
  useGetCreditSaleSearchQuery,
  useDeleteSingleSalereturnorderMutation,
  useGetSinglereturnSaleQuery,
} from 'src/store/apis/SalesSlice'
import { useAppSelector } from 'src/store/hooks'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import {
  getInvoicePaidAmount,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import capitalize from 'src/utils/capitalize'
import useGetCityName from 'src/hooks/useGetCityName'
import { useGetSingleInvoiceQuery } from 'src/store/apis/invoicesSlice'
import { calculateCRTotals } from 'src/utils/creditNotesUtils'
import { generateCreditNotePDF } from 'src/utils/pdfs/generateCreditNote'
import { EMAIL_CREDIT_NOTE_BODY } from 'src/utils/globalConstants'
import { emailPDFAction } from 'src/utils/pdfUtils'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import Can from 'src/layouts/components/acl/Can'

const CreditNotesList = () => {
  const { getCity } = useGetCityName()

  const { store } = useAppSelector(state => state.app)

  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<string[]>([])
  const [tableSearch, setTableSearch] = useState('')
  const [deleteSinglecredit] =
    useDeleteSingleSalereturnorderMutation()
  const { data: creditNotes, isLoading } =
    useGetCreditSaleSearchQuery({
      page: page,
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
      store: store ? store.id : undefined,
    })

  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const {
    modalData: creditNoteToEmail,
    openModal: openEMailCreditNoteModal,
    closeModal: closeEmailCreditNoteModal,
    isModalOpen: emailCreditNoteModalStatus,
  } = useModal<any>()

  const { data: invoiceInfo } = useGetSingleInvoiceQuery(
    creditNoteToEmail?.sale_invoices,
  )

  const { data: creditNoteData } =
    useGetSinglereturnSaleQuery(creditNoteToEmail?.id)

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = invoiceInfo?.customer?.email,
  ) => {
    const pdfTitle = `Credit Note ${creditNoteData?.return_number}`

    const totals = calculateCRTotals(
      creditNoteData,
      invoiceInfo ? getInvoicePaidAmount(invoiceInfo) : 0,
    )
    const paymentMethods = getPaymentMethods(
      creditNoteData,
    ).reduce((acc, opt) => {
      // @ts-ignore
      acc[opt.title] = formatCurrency(opt.amount)

      return acc
    }, {})

    const creditNoteDoc = generateCreditNotePDF({
      title: pdfTitle,
      products: (creditNoteData?.return_on || []).map(
        (prod: any) => ({
          sku: prod.sku,
          product_name: prod.product_name,
          quantity: prod.quantity_returned,
          unit_price: prod.unit_price,
          vat_inc: includeVAT(prod.unit_price),
          restocking_fee: prod.restocking_fee,
          total:
            Number(prod.return_price) *
            Number(prod.quantity_returned),
        }),
      ),
      topData: {
        'Credit Note Date': dateToString(
          new Date(creditNoteData?.created_at),
          'dd/MM/yyyy',
        ),
        'Customer No.': invoiceInfo?.id || '',
        'Customer Ref.':
          creditNoteData?.customer_reference || '',
        'Invoice No.': invoiceInfo?.invoice_number || '',
        'Raised By': invoiceInfo
          ? getFullName(invoiceInfo.user)
          : '',
      },
      totals: {
        'Refund Method': getPaymentMethodsStr(
          getPaymentMethods(creditNoteData),
        ),
        'Net Amount': formatCurrency(totals.net),
        'VAT Amount': formatCurrency(totals.vat),
        'Subtotal ': formatCurrency(totals.subtotal),
        'Restocking Fee':
          '-' +
          formatCurrency(
            creditNoteData?.total_restocking_fee,
          ),
        'Invoice Amount Paid': formatCurrency(
          invoiceInfo
            ? getInvoicePaidAmount(invoiceInfo)
            : 0,
        ),
        'Gross Amount': formatCurrency(totals.gross),
      },
      storeName: store.name,
      storeAddress: [
        capitalize(store.storeAddress),
        getCity(store.city),
        store.postalCode,
        '',
        `Tel No.   ${store.phone}`,
        `Email   ${store.email}`,
      ],
      refundOptions: {
        'Refund Amount': formatCurrency(
          creditNoteData?.payment_to_customer || 0,
        ),
        ...paymentMethods,
      },
    })

    if (store) {
      if (invoiceInfo?.customer) {
        const emailInfo = {
          email: emailTo || '',
          email_title: pdfTitle,
          email_body: EMAIL_CREDIT_NOTE_BODY,
          store_id: store.id,
        }

        if (action === 'email') {
          emailPDFAction(creditNoteDoc, emailInfo, pdfTitle)
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
          // downloadPDFAction(creditNoteDoc, pdfTitle)
        }
      }
    } else {
      toast.error('Select a store')
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailCreditNoteModal()
    pdfAction('email', values.email)
  }

  const columns: GridColDef[] = [
    {
      field: 'return_number',
      headerName: 'CREDIT NOTE',
      width: 155,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/credit-notes/${params.row.id}/view`}
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
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <div>
          {Number(params.row.paid_from_card) > 0 && (
            <Typography>Card</Typography>
          )}
          {Number(params.row.paid_from_cash) > 0 && (
            <Typography>Cash</Typography>
          )}
          {Number(params.row.paid_from_bacs) > 0 && (
            <Typography>BACS</Typography>
          )}
          {(Number(params.row.paid_from_credit) > 0 ||
            (Number(params.row.paid_from_card) === 0 &&
              Number(params.row.paid_from_cash) === 0 &&
              Number(params.row.paid_from_bacs) === 0 &&
              Number(params.row.paid_from_credit) ===
                0)) && <Typography>Credit</Typography>}
        </div>
      ),
    },

    {
      field: 'total',
      headerName: 'AMOUNT',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(parseFloat(params.value))}
        </Typography>
      ),
    },
    {
      field: 'firstName',
      headerName: 'CUSTOMER',
      type: 'string',
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography fontWeight={600}>
          {getFullName(params.row.customer)}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'RETURN DATE',
      type: 'string',
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'first_name',
      headerName: 'VERIFIED BY',
      type: 'string',
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {getFullName(params.row.user)}
        </Typography>
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
                openEMailCreditNoteModal(params.row)
              }
            >
              <Icon icon='tabler:mail' />
            </IconButton>

            <Can I='delete' a='credit-note'>
              <IconButton
                color='error'
                onClick={() =>
                  openDeleteModal(params.row.id)
                }
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Can>
          </Box>
        )
      },
    },
  ]

  const _deleteCategory = () => {
    deleteSinglecredit(deleteModal as number)
      .unwrap()
      .then(() => {
        toast.success('Credit Note deleted successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Credit Note', to: '/credit-notes' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            columns={columns}
            rows={creditNotes ? creditNotes.results : []}
            isLoading={isLoading}
            miniColumns={['creditNoteNumber', 'total']}
            openMiniModal={openTableDataModal}
            showToolbar
            showSearch={false}
            onPageChange={newPage => setPage(newPage)}
            totalRows={creditNotes?.count || 0}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Can I='create' a='credit-note'>
                  <Link href='/credit-notes/new'>
                    <ResponsiveButton
                      label='Create Credit Note'
                      icon='tabler:plus'
                      mini={isMobileSize}
                    />
                  </Link>
                </Can>
              </Box>
            }
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  value={tableSearch}
                  onChange={val => setTableSearch(val)}
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
            ? `Details of ${tableData.return_number}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Credit Note:': tableData.return_number,
                'Customer:': getFullName(tableData),
                'Type:': tableData.type.map(
                  (v: string, i: number) =>
                    v.toUpperCase() +
                    (tableData.type.length !== i + 1
                      ? ', '
                      : ''),
                ),
                'Amount:': formatCurrency(tableData.amount),
                'Return Date:': formatDate(
                  tableData.returnDate,
                ),
                'Verified By:': tableData.verifiedBy,
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
                  openEMailCreditNoteModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:mail' />
              </IconButton>

              <Can I='delete' a='credit-note'>
                <IconButton
                  color='error'
                  onClick={() => {
                    openDeleteModal(tableData.id)
                    closeTableDataModal()
                  }}
                >
                  <Icon icon='tabler:trash' />
                </IconButton>
              </Can>
            </Box>
          )
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Credit Note'
        content={
          'Are you sure you want to delete this credit note?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteCategory}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      {/* <EmailModal
        open={emailCreditNoteModalStatus()}
        handleClose={closeEmailCreditNoteModal}
        onSubmit={({ email }) => {
          toast.success(`TODO: Email sent to ${email}`)
          closeEmailCreditNoteModal()
        }}
        title='Email Customer'
        data={{
          'Customer Name':
            creditNoteToEmail && getFullName(creditNoteToEmail),
          'Document ID':
            creditNoteToEmail && creditNoteToEmail.id,
          'Document Type': 'Credit Note',
          'Document Date':
            creditNoteToEmail && creditNoteToEmail.createdAt,
        }}
      /> */}

      <EmailCustomerModal
        data={{
          email: creditNoteToEmail?.customer?.email || '',
          customerName: getFullName(
            creditNoteToEmail?.customer,
          ),
          documentDate: formatDate(
            creditNoteToEmail?.created_at,
          ),
          documentId: creditNoteToEmail?.return_number,
          documentType: 'Credit Note',
        }}
        onSubmit={confirmSendEmail}
        open={emailCreditNoteModalStatus()}
        handleClose={closeEmailCreditNoteModal}
      />
    </>
  )
}

CreditNotesList.acl = {
  action: 'read',
  subject: 'credit-note',
}

export default CreditNotesList
