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
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import DateRangePicker from 'src/components/global/DateRangePicker'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import InvoiceStatus from 'src/components/invoices/InvoiceStatus'
import RequestEditModal from 'src/components/invoices/RequestEditModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { getFullName } from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import {
  useDeleteOrderMutation,
  useSearchOrderQuery,
} from 'src/store/apis/orderSlice'
import { useAuth } from 'src/hooks/useAuth'
import ManagerApprovalModal from 'src/components/global/Modals/ManagerApprovalModal'
import { useAppSelector } from 'src/store/hooks'
import { buildUrl } from 'src/utils/routeUtils'
import { isUserAManager } from 'src/utils/rolesUtils'
import useGetOrderPDFInfo from 'src/hooks/useGetOrderPDFInfo'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import { EMAIL_ORDER_BODY } from 'src/utils/globalConstants'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { emailPDF } from 'src/utils/pdfUtils'
import OrderDeliveryStatus from 'src/components/orders/OrderStatus'
import { getOrderBalance } from 'src/utils/ordersUtils'
import Can from 'src/layouts/components/acl/Can'

const SalesOrdersList = () => {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState<string[]>([])
  const [statusvalue, setstatusvalue] = useState('0')
  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')
  const { store } = useAppSelector(state => state.app)

  const {
    data: Orders,
    isLoading,
    isFetching,
  } = useSearchOrderQuery({
    search: tableSearch,
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
    page: page,
    store: store?.id,
  })

  const router = useRouter()
  const [deleteOrder] = useDeleteOrderMutation()

  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const [orderToDelete, setOrderToDelete] = useState<
    null | any
  >(null)
  const {
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const {
    modalData: requestEdit,

    // openModal: openRequestEditModal,
    closeModal: closeRequestEditModal,
    isModalOpen: requestEditModalStatus,
  } = useModal<IData>()

  const {
    modalData: orderToEmail,
    openModal: openEmailOrderModal,
    closeModal: closeEmailOrderModal,
    isModalOpen: emailOrderModalStatus,
  } = useModal<IData>()

  const { invoiceDoc } = useGetOrderPDFInfo({
    customerInfo: orderToEmail
      ? orderToEmail?.customer
      : '--',

    // invoiceInfo: invoiceInfo
    //   ? (invoiceInfo as ISaleInvoice)
    //   : undefined,
    orderInfo: orderToEmail,
    invoicedProducts: orderToEmail
      ? orderToEmail?.sale_order_track
      : [],
  })

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = orderToEmail
      ? orderToEmail?.customer?.email
      : '',
  ) => {
    const orderTitle =
      'Order ' +
      (orderToEmail ? orderToEmail?.order_number : '')
    if (orderToEmail ? orderToEmail?.customer : false) {
      const emailInfo = {
        email: emailTo || '',
        email_title: orderTitle,
        email_body: EMAIL_ORDER_BODY,
        store_id: store.id,
      }

      emailPDF(
        {
          ...invoiceDoc,
          storeName: store?.name,
          isOrder: true,
        },
        emailInfo,
        orderTitle,
      )
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

  const confirmSendEmail = (values: { email: string }) => {
    closeEmailOrderModal()
    pdfAction('email', values.email)
  }

  const columns: GridColDef[] = [
    {
      field: 'order_number',
      headerName: 'ORDER',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/orders/${params.row.id}/view`}
            style={{ fontWeight: 600 }}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'last_name',
      headerName: 'STATUS',
      align: 'center',
      headerAlign: 'center',
      type: 'number',
      width: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <InvoiceStatus
          amount={getOrderBalance(params.row)}
          status={
            getOrderBalance(params.row) > 0
              ? 'pending'
              : 'paid'
          }
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
      valueGetter: params => getFullName(params.value),
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
        <OrderDeliveryStatus status={params.value} />
      ),
    },
    {
      field: 'created_at',
      headerName: 'CREATED DATE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
      disableColumnMenu: true,
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
                openEmailOrderModal(params.row)
              }
            >
              <Icon icon='tabler:mail' />
            </IconButton>

            <Can I='update' an='order'>
              <IconButton
                color='primary'
                onClick={() =>
                  router.push(
                    `/orders/${params.row.id}/edit`,
                  )
                }
              >
                <Icon icon='tabler:edit' />
              </IconButton>
            </Can>

            <Can I='delete' an='order'>
              <IconButton
                color='error'
                onClick={() => {
                  openDeleteModal(params.row.id)
                  setOrderToDelete(params.row)
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Can>
          </Box>
        )
      },
    },
  ]

  const _deleteOrder = () => {
    if (orderToDelete) {
      if (Boolean(orderToDelete?.sale_invoice)) {
        toast.error(
          'Order cannot be deleted because a Sale Invoice already exists.',
        )

        return
      }

      deleteOrder(orderToDelete.id)
        .unwrap()
        .then((res: any) => {
          if (res.hasOwnProperty('data')) {
            const data1 = res.data

            if (data1.hasOwnProperty('data')) {
              if (hasErrorKey(data1.data as any)) {
                toast.error(
                  extractErrorMessage(data1.data as any),
                )
              }
            } else {
              toast.success('Order deleted successfully')

              router.replace('/orders')
            }
          } else {
            toast.error(
              extractErrorMessage(res?.error as any),
            )
          }
        })
        .catch(() => toast.error('An error occurred'))
        .finally(() => setOrderToDelete(null))
    }
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Sales Orders', to: '/orders' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            isLoading={isLoading || isFetching}
            columns={columns}
            rows={Orders ? Orders.results : []}
            totalRows={Orders?.count || 10}
            miniColumns={['order_number', 'order_status']}
            onPageChange={newPage => setPage(newPage)}
            openMiniModal={openTableDataModal}
            showToolbar
            showSearch={false}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Can I='create' an='order'>
                  <Link href='/orders/new'>
                    <ResponsiveButton
                      label='Create Order'
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
                  value={statusvalue}
                  handleChange={e =>
                    setstatusvalue(e.target.value)
                  }
                  options={[
                    { label: 'All', value: 0 },
                    { label: 'Outstanding', value: 1 },
                    { label: 'Partial', value: 2 },
                    { label: 'Paid', value: 3 },
                  ]}
                  maxWidth={130}
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
          tableData ? `Details of #${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'ID:': '#' + tableData.id,
                'Customer:': getFullName(tableData),
                'Amount:': formatCurrency(
                  tableData.payment,
                ),
                'Created At:': formatDate(
                  tableData.createdAt,
                ),
                'Status:': (
                  <InvoiceStatus
                    status={tableData.orderStatus}
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
                  openEmailOrderModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:mail' />
              </IconButton>
              <IconButton
                color='primary'
                onClick={() => {
                  router.push(
                    `/orders/${tableData.id}/edit`,
                  )

                  // openRequestEditModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:edit' />
              </IconButton>
              <IconButton
                color='error'
                onClick={() => {
                  openDeleteModal(tableData.id)
                  setOrderToDelete(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          )
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Order'
        content={
          'Are you sure you want to delete this order?'
        }
        confirmTitle='Confirm'
        onConfirm={
          isUserAManager(user)
            ? _deleteOrder
            : openManagerApprovalModal
        }
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={_deleteOrder}
      />

      <RequestEditModal
        open={requestEditModalStatus()}
        handleClose={closeRequestEditModal}
        data={{
          customerName: getFullName(requestEdit),
          documentDate:
            (requestEdit && requestEdit.createdAt) ||
            '1/1/2023',
          documentId:
            (requestEdit && requestEdit.id + '') || '',
          documentType: 'Invoice',
          store: 'Nexus', // TODO: active store
        }}
        onSubmit={() => {
          toast.success('Edit requested')
          closeRequestEditModal()
        }}
      />

      <EmailCustomerModal
        data={{
          email: orderToEmail
            ? orderToEmail?.customer?.email
            : '',
          customerName: getFullName(
            orderToEmail ? orderToEmail?.customer : '',
          ),
          documentDate: dateToString(
            new Date(
              orderToEmail ? orderToEmail?.created_at : '',
            ),
          ),
          documentId: orderToEmail
            ? orderToEmail?.order_number
            : '',
          documentType: 'Order',
        }}
        onSubmit={confirmSendEmail}
        open={emailOrderModalStatus()}
        handleClose={closeEmailOrderModal}
      />
    </>
  )
}

SalesOrdersList.acl = {
  action: 'read',
  subject: 'order',
}

export default SalesOrdersList
