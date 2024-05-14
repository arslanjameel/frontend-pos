import { Box, Button, Card, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import ConfirmationModal from 'src/components/global/ConfirmationModal'
import CreateDeliveryNoteModal from 'src/components/invoices/CreateDeliveryNoteModal'
import MarkDeliveryCompleteModal from 'src/components/invoices/MarkDeliveryCompleteModal'
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/hooks/useModal'
import { useCreateDeliveryNoteMutation } from 'src/store/apis/deliveryNotesSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import { IData } from 'src/utils/types'

// import BottomProductsTable from '../BottomProductsTable'
import {
  IProductDeliveryMode,
  IProductStatus,
  ISaleInvoice,
  ProductSoldOn,
} from 'src/models/ISaleInvoice'
import MainTable from './MainTable'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { ICustomer } from 'src/models/ICustomer'
import DeliveryNotesModal from 'src/components/invoices/DeliveryNotesModal'
import { ISaleDeliveryNote } from 'src/models/ISaleDeliveryNote'

import {
  markCompletedApi,
  useCreateMarkCompletedMutation,
  useGetMarkCompletedNewQuery,
} from 'src/store/apis/markCompletedSlice'
import { IMarkCompletedNew } from 'src/models/IMarkCompleted'
import { invoicesApi } from 'src/store/apis/invoicesSlice'
import MarkCompleteHistoryCard from 'src/components/global/Sales/MarkCompleteHistoryCard'
import InvoiceOptionBtnsWrapper from 'src/components/invoices/InvoiceOptionBtnsWrapper'
import DeliveryNotesTabCard from 'src/components/global/Sales/DeliveryNotesTabCard'

interface Props {
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  invoiceId?: number
  invoicedProducts: ProductSoldOn[]
  updateInvoicedProducts: (
    id: number,
    key: string,
    value: string | number,
  ) => void
  updateAllInvoicedProducts: (
    updatedProducts: IData[],
  ) => void
}

const DeliveryCollectionTab = ({
  customerInfo,
  invoiceInfo,
  invoiceId,

  // openDeliveryNotesModal,
  invoicedProducts,
}: // updateInvoicedProducts,
// updateAllInvoicedProducts,
Props) => {
  const { user } = useAuth()
  const { store } = useAppSelector(state => state.app)

  const [tempInvoiceProducts, setTempInvoiceProducts] =
    useState<ProductSoldOn[]>([])

  /**
   *
   * START - Mark Complete
   *
   *
   *
   * */

  // const [markCompletedPage, setMarkCompletePage] =
  //   useState(1)
  const {
    data: markCompletedList,
    isLoading: isMarkCompleteListLoading,
    isFetching: isMarkCompleteListFetching,
  } = useGetMarkCompletedNewQuery({
    sale_invoice_id: invoiceId || null,
    sale_order_id: null,
  })

  // } = useGetMarkCompletedQuery({ page: markCompletedPage })

  const [markCompletedPost] =
    useCreateMarkCompletedMutation()

  /**
   *
   * END - Mark Complete
   *
   *
   *
   * */

  const [_createDeliveryNote, {}] =
    useCreateDeliveryNoteMutation()

  const [selectedDeliveryData, setSelectedDeliveryData] =
    useState<number[]>([])

  const [overallStatus, setOverallStatus] =
    useState<IProductDeliveryMode>('pick_up')

  const updateOverallStatus = (
    status: IProductDeliveryMode,
  ) => {
    let tempProducts = [...tempInvoiceProducts]
    tempProducts = tempProducts.map(prod => ({
      ...prod,
      delivery_mode: status,
    }))
    setTempInvoiceProducts(tempProducts)

    setOverallStatus(status)
  }

  const updateDeliveryStatus = (
    productId: number,
    status: IProductStatus,
  ) => {
    let tempProducts = [...tempInvoiceProducts]
    tempProducts = tempProducts.map(prod =>
      prod.id === productId
        ? {
            ...prod,
            delivery_mode: status,
          }
        : prod,
    )
    setTempInvoiceProducts(tempProducts)
  }

  const {
    // modalData: markComplete,
    openModal: openMarkCompleteModal,
    closeModal: closeMarkCompleteModal,
    isModalOpen: markCompleteModalStatus,
  } = useModal<any>()

  const {
    // modalData: markComplete,
    openModal: openCreateDeliveryNoteModal,
    closeModal: closeCreateDeliveryNoteModal,
    isModalOpen: createDeliveryNoteModalStatus,
  } = useModal<any>()

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

  const dispatch = useAppDispatch()

  const invalidateInvoiceInfomation = () => {
    dispatch(
      invoicesApi.util.invalidateTags([
        { type: 'SaleInvoice' },
      ]),
    )
  }

  const invalidateMarkAsCompleteList = () => {
    dispatch(
      markCompletedApi.util.invalidateTags([
        'MarkCompleted',
      ]),
    )
  }

  const confirmDelivery = () => {
    const submittedDataForDelivery =
      deliveryConfirmationData
    if (
      submittedDataForDelivery &&
      user &&
      invoiceId &&
      customerInfo &&
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
        customer_number: customerInfo.id.toString(),
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
        sale_invoice: invoiceId,
        sale_order: invoiceInfo?.sale_order || null,
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
          invalidateInvoiceInfomation()
          invalidateMarkAsCompleteList()
        }
      })
      .catch(() => toast.error('An error occured'))
  }

  useEffect(() => {
    setTempInvoiceProducts(invoicedProducts)
  }, [invoicedProducts])

  return (
    <Box sx={{ flex: 1 }}>
      <Grid
        container
        columns={12}
        rowSpacing={6}
        columnSpacing={6}
      >
        <Grid item md={9} sm={12} xs={12}>
          <Card sx={{ width: '100%', height: '100%' }}>
            <MainTable
              invoicedProducts={tempInvoiceProducts}
              overallStatus={overallStatus}
              selectedDeliveryData={selectedDeliveryData}
              setSelectedDeliveryData={
                setSelectedDeliveryData
              }
              updateDeliveryStatus={updateDeliveryStatus}
              updateOverallStatus={updateOverallStatus}
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
          <InvoiceOptionBtnsWrapper
            invoiceInfo={invoiceInfo}
            customerInfo={customerInfo}
            invoicedProducts={invoicedProducts}
          />

          <Box sx={{ height: 20 }}></Box>

          <Card sx={{ flex: 1, px: 3, py: 1 }}>
            <DeliveryNotesTabCard
              invoiceId={invoiceInfo?.id}
              openDeliveryModal={deliveryNoteInfo => {
                const _ids = (
                  deliveryNoteInfo?.deliveryNote
                    ?.sale_delivery_note_track || []
                )
                  .map((prod: any) =>
                    tempInvoiceProducts.find(
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
      </Grid>

      <Box sx={{ height: 20 }}></Box>

      <Grid item md={12} sm={12} xs={12}>
        <MarkCompleteHistoryCard
          historyData={markCompletedList || []}
          isLoading={
            isMarkCompleteListLoading ||
            isMarkCompleteListFetching
          }
        />
      </Grid>

      <MarkDeliveryCompleteModal
        open={markCompleteModalStatus()}
        handleClose={closeMarkCompleteModal}
        products={(() => {
          const allProds = tempInvoiceProducts
            ?.filter(d =>
              selectedDeliveryData.includes(d.id),
            )
            .map(d => ({
              ...d,
              delivered_now:
                d.quantity_sold -
                d.quantity_delivered -
                d.products_returned,
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
            sale_invoice: invoiceInfo?.id || 0,
            sale_order: null,
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
        customerInfo={customerInfo}
        invoiceInfo={invoiceInfo}
        open={createDeliveryNoteModalStatus()}
        handleClose={closeCreateDeliveryNoteModal}
        onSubmit={submittedData =>
          openDeliveryConfirmationModal(submittedData)
        }
        products={tempInvoiceProducts
          .filter(d => selectedDeliveryData.includes(d.id))
          .map(prod => ({
            ...prod,
            deliverNow:
              prod.quantity_sold -
              prod.quantity_delivered -
              prod.products_returned,
          }))
          .filter(d => d.deliverNow > 0)}
      />

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
       * Shown After successfully creating a delivery note
       *
       */}
      <DeliveryNotesModal
        open={deliveryNotesModalStatus()}
        handleClose={closeDeliveryNotesModal}
        invoiceInfo={invoiceInfo}
        customerInfo={customerInfo}
        data={deliveryNotesData || undefined}
        markAsComplete={(data: any) => {
          closeDeliveryNotesModal()
          openMarkCompleteConfirmationModal(data)
        }}
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
    </Box>
  )
}

export default DeliveryCollectionTab
