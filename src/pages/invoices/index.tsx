import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import DateRangePicker from 'src/components/global/DateRangePicker'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import ProductDeliveryStatusIcon from 'src/components/global/Sales/ProductDeliveryStatus'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import InvoiceStatus from 'src/components/invoices/InvoiceStatus'
import RequestEditModal from 'src/components/invoices/RequestEditModal'
import VoidInvoiceModal from 'src/components/invoices/VoidInvoiceModal'
import useGetInvoicePDFInfo from 'src/hooks/useGetInvoicePDFInfo'
import useGetStoreInfo from 'src/hooks/useGetStoreInfo'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Can from 'src/layouts/components/acl/Can'
import {
  IInvoiceStatus,
  ISaleInvoice,
} from 'src/models/ISaleInvoice'
import { useGetStoresQuery } from 'src/store/apis/accountSlice'
import { useGetInvoicesSearchQuery } from 'src/store/apis/invoicesSlice'
import { useAppSelector } from 'src/store/hooks'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import {
  formatTo2dp,
  getFullName,
} from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { getInvoicePaidAndBalance } from 'src/utils/invoicesUtils'
import { emailPDF } from 'src/utils/pdfUtils'
import { buildUrl } from 'src/utils/routeUtils'
import { isStoreSelected } from 'src/utils/storeUtils'
import { IData } from 'src/utils/types'

const SalesInvoicesList = () => {
  const router = useRouter()

  const [page, setPage] = useState(1)

  const { data: stores } = useGetStoresQuery()

  // const [deleteInvoice] = useDeleteInvoiceMutation()

  const { getStoreName } = useGetStoreInfo(
    stores ? stores.results : [],
  )
  const { store } = useAppSelector(state => state.app)

  const { isMobileSize } = useWindowSize()

  const [dateRange, setDateRange] = useState<string[]>([])
  const [invoiceStatus, setInvoiceStatus] = useState('all')
  const [tableSearch, setTableSearch] = useState('')

  const {
    data: searchedInvoices,
    isLoading,
    isFetching,
  } = useGetInvoicesSearchQuery({
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
    status: invoiceStatus === 'all' ? '' : invoiceStatus,
    store: isStoreSelected(store) ? store.id : undefined,
  })

  const {
    modalData: requestEdit,
    openModal: openRequestEditModal,
    closeModal: closeRequestEditModal,
    isModalOpen: requestEditModalStatus,
  } = useModal<IData>()

  const {
    modalData: invoiceInfo,
    openModal: openEmailInvoiceModal,
    closeModal: closeEmailInvoiceModal,
    isModalOpen: emailInvoiceModalStatus,
  } = useModal<IData>()

  const { invoiceDoc } = useGetInvoicePDFInfo({
    customerInfo: !invoiceInfo
      ? undefined
      : invoiceInfo.customer,
    invoiceInfo: invoiceInfo
      ? (invoiceInfo as ISaleInvoice)
      : undefined,
    invoicedProducts: invoiceInfo
      ? invoiceInfo?.sold_on_invoice
      : [],
  })

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: invoiceToVoid,

    // openModal: openVoidInvoiceModal,
    closeModal: closeVoidInvoiceModal,
    isModalOpen: voidInvoiceModalStatus,
  } = useModal<number>()

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = invoiceInfo
      ? invoiceInfo.customer?.email
      : '',
  ) => {
    if (invoiceInfo ? invoiceInfo?.customer : false) {
      const emailInfo = {
        email: emailTo || '',
        email_title:
          'Invoice ' +
          (invoiceInfo ? invoiceInfo?.invoice_number : ''),
        email_body: 'Invoice number ',
        store_id: store?.id,
      }

      if (action === 'email') {
        emailPDF(invoiceDoc, emailInfo)
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
      }
    }
  }

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailInvoiceModal()
    pdfAction('email', values.email)
  }

  const _voidInvoice = (copyToNewInvoice: boolean) => {
    if (invoiceToVoid) {
      toast.success('TODO: Void this invoice')

      if (copyToNewInvoice) {
        toast.success('TODO: Copy contents to new invoice')
      }
    }
    closeVoidInvoiceModal()
  }

  // const getInvoiceBalance = (invoice: ISaleInvoice) =>
  //   Number(invoice.total) - Number(invoice.payment)

  const getInvoiceStatus = (
    invoice: ISaleInvoice,
  ): IInvoiceStatus => {
    const { hasBalance } = getInvoicePaidAndBalance(invoice)

    if (!hasBalance) {
      return 'paid'
    }

    return 'pending'
  }

  const columns: GridColDef[] = [
    {
      field: 'invoice_number',
      headerName: 'INVOICE',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={buildUrl('invoices', {
              itemId: params.row.id,
              mode: 'view',
            })}
            style={{ fontWeight: 600 }}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'invoice_status',
      headerName: 'STATUS',
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      width: 150,
      disableColumnMenu: true,
      valueGetter: params => getInvoiceStatus(params.row),
      renderCell: params => (
        <InvoiceStatus
          amount={
            getInvoicePaidAndBalance(params.row).amountDue
          }
          status={params.value}
        />
      ),
    },
    {
      field: 'total',
      headerName: 'AMOUNT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 110,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            Number(formatTo2dp(params.value)),
          )}
        </Typography>
      ),
    },

    {
      field: 'customer',
      headerName: 'CUSTOMER',
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        return (
          params.row?.customer?.firstName +
          ' ' +
          params.row?.customer?.lastName
        )
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
      field: 'delivery_status',
      headerName: 'STATUS',
      align: 'center',
      headerAlign: 'center',
      type: 'number',
      width: 70,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Icon icon='tabler:box' />,
      renderCell: params => (
        <ProductDeliveryStatusIcon status={params.value} />
      ),
    },
    {
      field: 'created_at',
      headerName: 'CREATED DATE',
      type: 'date',
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
      disableColumnMenu: true,
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography>
          {dateToString(new Date(params.value))}
        </Typography>
      ),
    },
    {
      field: 'actions',
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
                openEmailInvoiceModal(params.row)
              }
            >
              <Icon icon='tabler:mail' />
            </IconButton>
            <IconButton
              color='primary'
              onClick={() =>
                router.push(
                  buildUrl('invoices', {
                    itemId: params.row.id,
                    mode: 'edit',
                  }),
                )
              }
            >
              <Icon icon='tabler:edit' />
            </IconButton>
            {/* <IconButton
              color='error'
              onClick={() =>
                openVoidInvoiceModal(params.row.id)
              }
            >
              <Icon icon='tabler:trash' />
            </IconButton> */}
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Sales Invoice',
            to: buildUrl('invoices'),
          },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          {isLoading ? (
            <FallbackSpinner brief />
          ) : (
            <AppTable
              columns={columns}
              rows={searchedInvoices?.results || []}
              miniColumns={[
                'invoice_number',
                'invoice_status',
                'payment',
              ]}
              isLoading={isLoading || isFetching}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              onPageChange={newPage => setPage(newPage)}
              totalRows={searchedInvoices?.count || 0}
              actionBtns={
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Can I={'create'} an={'invoice'}>
                    <Link
                      href={buildUrl('invoices', {
                        mode: 'new',
                      })}
                    >
                      <ResponsiveButton
                        label='Create Invoice'
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
                </Box>
              }
            />
          )}
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of #${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'ID:': '#' + tableData.id,
                'Customer:': getFullName(
                  tableData.customer,
                ),
                'Amount:': formatCurrency(
                  Number(formatTo2dp(tableData.payment)),
                ),
                'Created At:': dateToString(
                  new Date(tableData.created_at),
                ),
                'Status:': (
                  <InvoiceStatus
                    amount={Number(
                      formatTo2dp(tableData.payment),
                    )}
                    status={tableData.invoice_status}
                  />
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
                  openEmailInvoiceModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:mail' />
              </IconButton>
              <IconButton
                color='primary'
                onClick={() => {
                  openRequestEditModal(tableData)
                  closeTableDataModal()
                }}
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

      <VoidInvoiceModal
        open={voidInvoiceModalStatus()}
        onClose={closeVoidInvoiceModal}
        onConfirm={_voidInvoice}
      />
      <RequestEditModal
        open={requestEditModalStatus()}
        handleClose={closeRequestEditModal}
        data={{
          customerName:
            (requestEdit &&
              getFullName(requestEdit.customer)) ||
            '',
          documentDate: requestEdit
            ? requestEdit.created_at
            : '',
          documentId:
            (requestEdit && requestEdit.id + '') || '',
          documentType: 'Invoice',
          store: requestEdit
            ? getStoreName(requestEdit.store)
            : '--',
        }}
        onSubmit={() => {
          toast.success('Edit requested')
          closeRequestEditModal()
        }}
      />

      {/* <EmailModal
        open={emailInvoiceModalStatus()}
        handleClose={closeEmailInvoiceModal}
        onSubmit={({ email }) => {
          toast.success(`TODO: Email sent to ${email}`)
          closeEmailInvoiceModal()
        }}
        title='Email Customer'
        data={{
          'Customer Name':
            invoiceToEmail &&
            getFullName(invoiceToEmail.customer),
          'Document ID':
            invoiceToEmail && invoiceToEmail.id,
          'Document Type': 'Invoice',
          'Document Date':
            invoiceToEmail &&
            dateToString(
              new Date(invoiceToEmail.created_at),
            ),
        }}
      /> */}

      <EmailCustomerModal
        data={{
          email: invoiceInfo
            ? invoiceInfo.customer.email
            : '',
          customerName: getFullName(
            invoiceInfo ? invoiceInfo.customer : '',
          ),
          documentDate: dateToString(
            new Date(
              invoiceInfo ? invoiceInfo?.created_at : '',
            ),
          ),
          documentId: invoiceInfo
            ? invoiceInfo?.invoice_number
            : '',
          documentType: 'Invoice',
        }}
        onSubmit={confirmSendEmail}
        open={emailInvoiceModalStatus()}
        handleClose={closeEmailInvoiceModal}
      />
    </>
  )
}

SalesInvoicesList.acl = {
  action: 'read',
  subject: 'invoice',
}

export default SalesInvoicesList
