import {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-nocheck
  Box,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import ProductDeliveryModePicker from 'src/components/global/Dropdowns/ProductDeliveryModePicker'
import DeliveryNotesTabCard from 'src/components/global/Sales/DeliveryNotesTabCard'
import MarkCompleteHistoryCard from 'src/components/global/Sales/MarkCompleteHistoryCard'
import TableDataModal from 'src/components/global/TableDataModal'
import CreateDeliveryNoteModal from 'src/components/invoices/CreateDeliveryNoteModal'
import DeliveryNotesModal from 'src/components/invoices/DeliveryNotesModal'
import DeliveryStatusTag from 'src/components/invoices/DeliveryStatusTag'
import MarkDeliveryCompleteModal from 'src/components/invoices/MarkDeliveryCompleteModal'
import OrderActionBtns from 'src/components/orders/OrderActionBtns'
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/hooks/useModal'
import { IMarkCompletedNew } from 'src/models/IMarkCompleted'
import { ISaleDeliveryNote } from 'src/models/ISaleDeliveryNote'
import { useCreateDeliveryNoteMutation } from 'src/store/apis/deliveryNotesSlice'
import {
  useCreateMarkCompletedMutation,
  useGetMarkCompletedNewQuery,
} from 'src/store/apis/markCompletedSlice'
import { ordersApi } from 'src/store/apis/orderSlice'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { IProductStatus } from 'src/types/IProducts'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { IData } from 'src/utils/types'

interface Props {
  orderInfo: any
  invoiceInfo?: any
  invoicedProducts: IData[]
}

const DeliveryCollectionTab = ({
  orderInfo,
  invoiceInfo,
  invoicedProducts,
}: // updateInvoicedProducts,
// updateAllInvoicedProducts,
Props) => {
  const [tempInvoicedProducts, setTempInvoicedProducts] =
    useState<any[]>([])

  const { store } = useAppSelector(state => state.app)

  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const [markCompletedPost] =
    useCreateMarkCompletedMutation()

  const [_createDeliveryNote, {}] =
    useCreateDeliveryNoteMutation()

  const [selectedDeliveryData, setSelectedDeliveryData] =
    useState<number[]>([])

  const {
    modalData: deliveryConfirmationData,
    openModal: openDeliveryConfirmationModal,
    closeModal: closeDeliveryConfirmationModal,
    isModalOpen: deliveryConfirmationModalStatus,
  } = useModal<{
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
    productsInfo: IData[]
  }>()
  const {
    // modalData: markCompleteConfirmationData,
    openModal: openMarkCompleteConfirmationModal,
    closeModal: closeMarkCompleteConfirmationModal,
    isModalOpen: markCompleteConfirmationModalStatus,
  } = useModal<{
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
    productsInfo: IData[]
  }>()

  const [overallStatus, setOverallStatus] =
    useState<IProductStatus>(0)

  const updateOverallStatus = (status: IProductStatus) => {
    let _tempInvoicedProducts = [...tempInvoicedProducts]
    _tempInvoicedProducts = tempInvoicedProducts.map(
      prod => ({
        ...prod,
        delivery_mode: status,
      }),
    )
    setTempInvoicedProducts(_tempInvoicedProducts)

    setOverallStatus(status)
  }

  const updateDeliveryStatus = (
    productId: number,
    status: IProductStatus,
  ) => {
    let _tempInvoicedProducts = [...tempInvoicedProducts]
    _tempInvoicedProducts = tempInvoicedProducts.map(prod =>
      prod.id === productId
        ? {
            ...prod,
            delivery_mode: status,
          }
        : prod,
    )
    setTempInvoicedProducts(_tempInvoicedProducts)
  }

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    // modalData: markComplete,
    openModal: openMarkCompleteModal,
    closeModal: closeMarkCompleteModal,
    isModalOpen: markCompleteModalStatus,
  } = useModal<any>()

  const {
    modalData: deliveryNotesData,
    openModal: openDeliveryNotesModal,
    closeModal: closeDeliveryNotesModal,
    isModalOpen: deliveryNotesModalStatus,
  } = useModal<{
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
    productsInfo: IData[]
    deliveryNote: ISaleDeliveryNote
  }>()

  const {
    // modalData: markComplete,
    openModal: openCreateDeliveryNoteModal,
    closeModal: closeCreateDeliveryNoteModal,
    isModalOpen: createDeliveryNoteModalStatus,
  } = useModal<any>()

  const confirmDelivery = () => {
    const submittedDataForDelivery =
      deliveryConfirmationData
    if (
      submittedDataForDelivery &&
      user &&
      orderInfo &&
      store?.id
    ) {
      const {
        productsInfo,
        customerDeliveryAddress,
        customerName,
        customerRef,
      } = submittedDataForDelivery

      const sale_delivery_note_track = productsInfo.map(
        prod => ({
          sku: prod.sku,
          alternate_sku: prod.alternate_sku,
          product_name: prod.product_name,
          total_quantity: prod.quantity_sold,
          delivered: prod.quantity_delivery,
          delivered_now: prod.deliverNow,
        }),
      )

      _createDeliveryNote({
        sale_delivery_note_track,
        store_address: store?.id.toString(), //?????????
        customer_number: orderInfo?.customer.id.toString(),
        customer_name: customerName,
        customer_ref: customerRef,
        delivery_date: formatDate(
          new Date().toISOString(),
          'yyyy-MM-dd',
        ),
        delivery_time: formatDate(
          new Date().toISOString(),
          'HH:mm:ss',
        ),
        notes: '',
        delivery_address: customerDeliveryAddress,
        total_product_ordered: productsInfo.reduce(
          (prev, curr) => prev + curr.quantity_sold,
          0,
        ), //???????
        total_product_delivered: productsInfo.reduce(
          (prev, curr) => prev + curr.deliverNow,
          0,
        ), //???????,
        user: user.id,
        sale_invoice: invoiceInfo?.id,
        sale_order: orderInfo?.id,
      })
        .unwrap()
        .then(res => {
          if (hasErrorKey(res as any)) {
            toast.error(extractErrorMessage(res as any))
          } else {
            toast.success(
              'Delivery note added successfully',
            )

            openDeliveryNotesModal({
              ...submittedDataForDelivery,
              deliveryNote: res,
            })

            // router.replace(buildUrl('invoices'))
          }
        })
        .catch(() => {
          toast.error('An error occured')
        })
    }
    closeDeliveryConfirmationModal()
  }

  const invalidateOrdersList = () => {
    dispatch(
      ordersApi.util.invalidateTags([{ type: 'Search' }]),
    )
  }

  const confirmMarkAsComplete = (
    markCompleteData: IMarkCompletedNew,
  ) => {
    markCompletedPost(markCompleteData)
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res as any)) {
          toast.error(extractErrorMessage(res as any))
        } else {
          toast.success('Products Marked As Complete')
          invalidateOrdersList()
        }
      })
      .catch(() => toast.error('An error occured'))
  }

  const {
    data: markCompletedList,
    isLoading: isMarkCompleteListLoading,
    isFetching: isMarkCompleteListFetching,
  } = useGetMarkCompletedNewQuery({
    sale_invoice_id: null,
    sale_order_id: orderInfo.id || null,
  })
  const columns: GridColDef[] = [
    {
      field: 'delivery_mode',
      align: 'left',
      headerAlign: 'left',
      type: 'number',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <ProductDeliveryModePicker
          status={overallStatus as any}
          onChange={newStatus =>
            updateOverallStatus(newStatus as any)
          }
          readOnly
        />
      ),
      renderCell: params => (
        <ProductDeliveryModePicker
          status={params.value}
          onChange={newStatus =>
            updateDeliveryStatus(
              params.row.id,
              newStatus as any,
            )
          }
          readOnly
        />
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'PENDING',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      disableColumnMenu: true,
      valueGetter: params =>
        params.row.quantity_hold -
        params.row.quantity_delivered -
        (Number(params.row.products_returned) || 0),
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_delivery_status',
      headerName: 'STATUS',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      maxWidth: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <DeliveryStatusTag status={params.value} />
      ),
    },
  ]

  useEffect(() => {
    setTempInvoicedProducts(invoicedProducts || [])
  }, [invoicedProducts])

  return (
    <>
      <Grid
        container
        columns={12}
        rowSpacing={6}
        columnSpacing={6}
      >
        <Grid item md={9} sm={12} xs={12}>
          <Card sx={{ width: '100%', height: '100%' }}>
            <AppTable
              columns={columns}
              rows={tempInvoicedProducts}
              miniColumns={['sku']}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              showPageSizes={false}
              checkboxSelection
              rowSelectionModel={selectedDeliveryData}
              onRowSelectionModelChange={ids => {
                const notCompleted =
                  tempInvoicedProducts.filter(
                    (prod: any) =>
                      ids.includes(prod.id) &&
                      prod.quantity_hold -
                        prod.quantity_delivered >
                        0,
                  )
                setSelectedDeliveryData(
                  notCompleted.map(prod => prod.id),
                )
              }}
              leftActionBtns={
                <Typography variant='h5' fontWeight={600}>
                  Delivery/Collection Status
                </Typography>
              }
              secondaryActionBtns={
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Button
                    variant='contained'
                    onClick={() =>
                      openCreateDeliveryNoteModal(1)
                    }
                  >
                    Create Delivery Note
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => openMarkCompleteModal(1)}
                  >
                    Mark as Complete
                  </Button>
                </Box>
              }
            />
          </Card>
        </Grid>

        <Grid item md={3} sm={6} xs={12}>
          <OrderActionBtns
            fullHeight={false}
            orderInfo={orderInfo}
            invoiceInfo={invoiceInfo}
          />

          <Box sx={{ height: 20 }}></Box>

          <Card sx={{ flex: 1, px: 3, py: 1 }}>
            <DeliveryNotesTabCard
              orderId={orderInfo?.id}
              openDeliveryModal={deliveryNoteInfo => {
                const _ids = (
                  deliveryNoteInfo?.deliveryNote
                    ?.sale_delivery_note_track || []
                )
                  .map((prod: any) =>
                    tempInvoicedProducts.find(
                      p => p.sku === prod.sku,
                    ),
                  )
                  .map((prod: any) => prod.id)
                openDeliveryNotesModal(deliveryNoteInfo)
                setSelectedDeliveryData(_ids)
              }}
            />
          </Card>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <MarkCompleteHistoryCard
            historyData={markCompletedList || []}
            isLoading={
              isMarkCompleteListLoading ||
              isMarkCompleteListFetching
            }
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
                'SKU:': tableData.sku,
                'Name:': tableData.product_name,
                'Status:': (
                  <DeliveryStatusTag
                    status={
                      tableData.product_delivery_status
                    }
                  />
                ),
              }
            : {}
        }
      />
      {/* 
      <MarkDeliveryCompleteModal
        open={markCompleteModalStatus()}
        handleClose={closeMarkCompleteModal}
        products={[
          ...invoicedProducts?.filter(d =>
            selectedDeliveryData.includes(d.id),
          ),
        ]}
        markProductsAsComplete={({ products }) => {
          let temp = [...invoicedProducts]
          const idsOfComplete = products.map(
            prod => prod.id,
          )

          const getProductInfo = (id: number) =>
            products.find(prod => prod.id === id)
          const getOriginalProductInfo = (id: number) =>
            invoicedProducts.find(prod => prod.id === id)

          temp = temp.map(prod => {
            if (idsOfComplete.includes(prod.id)) {
              console.log(
                getProductInfo(prod.id)?.quantity,
                getOriginalProductInfo(prod.id)?.quantity,
              )

              return {
                ...prod,
                deliveryStatus:
                  getProductInfo(prod.id)?.quantity ===
                  getOriginalProductInfo(prod.id)?.quantity
                    ? 1
                    : prod.deliveryStatus,
              }
            }

            return prod
          })
          updateAllInvoicedProducts(temp)
          toast.success('TODO: products completed')
        }}
      /> */}

      <MarkDeliveryCompleteModal
        open={markCompleteModalStatus()}
        handleClose={closeMarkCompleteModal}
        products={(() => {
          const allProds = tempInvoicedProducts
            ?.filter(d =>
              selectedDeliveryData.includes(d.id),
            )
            .map(d => ({
              ...d,
              quantity_sold: d.quantity_hold,
              delivered_now:
                d.quantity_hold -
                d.quantity_delivered -
                (d?.products_returned || 0),
            }))

          const pendingProds = allProds.filter(
            d => d.delivered_now > 0,
          )

          // This delivery note contains some products that have already been completed.

          if (
            pendingProds.length < allProds.length &&
            markCompleteModalStatus()
          ) {
            toast.error('Some products have been completed')
          }

          return pendingProds
        })()}
        markProductsAsComplete={({
          products,
          date,
          delivery_mode,
          comments,
          trackingNumber,
        }) => {
          const getDeliveryStatus = (prod: any) => {
            if (
              prod.quantity_sold -
                (prod.quantity_delivered +
                  prod.delivered_now) ===
              0
            ) {
              return 'completed'
            } else if (
              prod.quantity_sold -
                (prod.quantity_delivered +
                  prod.delivered_now) ===
              prod.quantity_sold
            ) {
              return 'pending'
            } else {
              return 'partial'
            }
          }

          confirmMarkAsComplete({
            mark_date: dateToString(
              new Date(date),
              'yyyy-MM-dd',
            ),
            sale_invoice: null,
            sale_order: orderInfo?.id || 0,
            comments: comments,
            tracking_number: trackingNumber,
            products_track: products
              .map(prod => ({
                delivery_mode,

                product: prod.product,
                id: prod.id,
                sku: prod.sku,
                alternate_sku: prod.alternate_sku,
                product_name: prod.product_name,
                product_delivery_status:
                  getDeliveryStatus(prod),
                quantity: prod.quantity_sold,
                delivered: prod.quantity_delivered,
                returned: prod.products_returned,
                delivered_now: prod.delivered_now,
              }))
              .filter(d => d.delivered_now > 0),

            user: user?.id || 0,
            verified_by: user?.id || 0,
          })
        }}
      />

      <CreateDeliveryNoteModal
        orderInfo={orderInfo}
        customerInfo={orderInfo?.customer}
        open={createDeliveryNoteModalStatus()}
        handleClose={closeCreateDeliveryNoteModal}
        onSubmit={submittedData => {
          openDeliveryConfirmationModal(submittedData)
        }}
        products={tempInvoicedProducts
          ?.filter(d => selectedDeliveryData.includes(d.id))
          .map(d => ({
            ...d,
            quantity_sold: d.quantity_hold,
            delivered_now:
              d.quantity_hold - d.quantity_delivered,
          }))
          .filter(d => d.delivered_now > 0)}
      />

      {/* <CreateDeliveryNoteModal
        customerInfo={orderInfo?.customer}
        invoiceInfo={invoiceInfo}
        open={createDeliveryNoteModalStatus()}
        handleClose={closeCreateDeliveryNoteModal}
        onSubmit={submittedData =>
          openDeliveryConfirmationModal(submittedData)
        }
        products={tempInvoicedProducts
          .filter(d => selectedDeliveryData.includes(d.id))
          .map(prod => ({
            ...prod,
            deliverNow:
              prod.quantity_sold - prod.quantity_delivered,
          }))}
      /> */}

      <ConfirmationModal
        open={deliveryConfirmationModalStatus()}
        handleClose={closeDeliveryConfirmationModal}
        maxWidth={400}
        title='Delivery Note'
        content="Do you really want to create this delivery note? You won't be able to make changes after this!"
        confirmTitle='Create'
        onConfirm={confirmDelivery}
        rejectTitle='Cancel'
        rejectColor='error'
        onReject={closeDeliveryConfirmationModal}
      />

      {/**
       *
       * SIMILAR to invoices - Shown After successfully creating a delivery note
       *
       */}
      <DeliveryNotesModal
        open={deliveryNotesModalStatus()}
        handleClose={closeDeliveryNotesModal}
        invoiceInfo={invoiceInfo}
        customerInfo={orderInfo?.customer}
        data={deliveryNotesData || undefined}
        markAsComplete={(data: any) => {
          closeDeliveryNotesModal()
          openMarkCompleteConfirmationModal(data)
        }}
        isOrder
      />

      <ConfirmationModal
        open={markCompleteConfirmationModalStatus()}
        handleClose={closeMarkCompleteConfirmationModal}
        maxWidth={400}
        title='Mark As Complete'
        content='Do you realy want to mark items in the delivery note as complete?'
        confirmTitle='Yes'
        onConfirm={() => openMarkCompleteModal(1)}
        rejectTitle='No'
        rejectColor='error'
        onReject={closeMarkCompleteConfirmationModal}
      />
    </>
  )
}

export default DeliveryCollectionTab
