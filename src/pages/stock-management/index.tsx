import { Card, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import UseBgColor from 'src/@core/hooks/useBgColor'
import PageContainer from 'src/components/global/PageContainer'
import {
  ProductsPendingOrderTable,
  PendingSupplierCollectionTable,
  PendingSupplierDeliveryTable,
  PurchaseOrdersTable,
  SupplierCollectionTable,
  SupplierDeliveryNotesTable,
} from 'src/components/stock-management'

const StockAcquisition = () => {
  const { primaryFilled, primaryLight } = UseBgColor()
  const [isShow, setIsShow] = useState({
    productsPendingOrder: true,
    pendingSupplierDelivery: false,
    pendingSupplierCollection: false,
    purchaseOrders: false,
    supplierDeliveryNotes: false,
    supplierCollection: false,
  })

  const updateIsShow = (key: string) => {
    setIsShow(prevIsShow => ({
      ...prevIsShow,
      productsPendingOrder: false,
      pendingSupplierDelivery: false,
      pendingSupplierCollection: false,
      purchaseOrders: false,
      supplierDeliveryNotes: false,
      supplierCollection: false,
      [key]: true,
    }))
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Stock Acquisition',
            to: '/stock-acquisition',
          },
        ]}
      >
        <Grid container columns={12} spacing={6} mb={6}>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.productsPendingOrder
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.productsPendingOrder
                  ? primaryFilled
                  : {}),
              }}
              onClick={() =>
                updateIsShow('productsPendingOrder')
              }
            >
              <Typography
                color={
                  isShow.productsPendingOrder
                    ? 'white'
                    : 'black'
                }
                variant='h5'
              >
                Products Pending Order
              </Typography>
              <Typography
                color={
                  isShow.productsPendingOrder
                    ? 'white'
                    : 'black'
                }
                variant='h4'
              >
                35
              </Typography>
              <Typography
                color={
                  isShow.productsPendingOrder
                    ? 'white'
                    : 'black'
                }
                variant='h6'
              >
                Total Products
              </Typography>
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.pendingSupplierDelivery
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.pendingSupplierDelivery
                  ? primaryFilled
                  : {}),
              }}
              onClick={() =>
                updateIsShow('pendingSupplierDelivery')
              }
            >
              <Typography
                color={
                  isShow.pendingSupplierDelivery
                    ? 'white'
                    : 'black'
                }
                variant='h5'
              >
                Pending Supplier Delivery
              </Typography>
              <Typography
                color={
                  isShow.pendingSupplierDelivery
                    ? 'white'
                    : 'black'
                }
                variant='h4'
              >
                11,000
              </Typography>
              <Typography
                color={
                  isShow.pendingSupplierDelivery
                    ? 'white'
                    : 'black'
                }
                variant='h6'
              >
                This week
              </Typography>
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.pendingSupplierCollection
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.pendingSupplierCollection
                  ? primaryFilled
                  : {}),
              }}
              onClick={() =>
                updateIsShow('pendingSupplierCollection')
              }
            >
              <Typography
                color={
                  isShow.pendingSupplierCollection
                    ? 'white'
                    : 'black'
                }
                variant='h5'
              >
                Pending Supplier Collection
              </Typography>
              <Typography
                color={
                  isShow.pendingSupplierCollection
                    ? 'white'
                    : 'black'
                }
                variant='h4'
              >
                20
              </Typography>
              <Typography
                color={
                  isShow.pendingSupplierCollection
                    ? 'white'
                    : 'black'
                }
                variant='h6'
              >
                Total Products
              </Typography>
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.purchaseOrders
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.purchaseOrders
                  ? primaryFilled
                  : {}),
              }}
              onClick={() => updateIsShow('purchaseOrders')}
            >
              <Typography
                color={
                  isShow.purchaseOrders ? 'white' : 'black'
                }
                variant='h5'
              >
                Purchase Orders
              </Typography>
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.supplierDeliveryNotes
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.supplierDeliveryNotes
                  ? primaryFilled
                  : {}),
              }}
              onClick={() =>
                updateIsShow('supplierDeliveryNotes')
              }
            >
              <Typography
                color={
                  isShow.supplierDeliveryNotes
                    ? 'white'
                    : 'black'
                }
                variant='h5'
              >
                Supplier Delivery Notes
              </Typography>
            </Card>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                '&:hover': !isShow.supplierCollection
                  ? {
                      ...primaryLight,
                    }
                  : '',
                ...(isShow.supplierCollection
                  ? primaryFilled
                  : {}),
              }}
              onClick={() =>
                updateIsShow('supplierCollection')
              }
            >
              <Typography
                color={
                  isShow.supplierCollection
                    ? 'white'
                    : 'black'
                }
                variant='h5'
              >
                Supplier Collection
              </Typography>
            </Card>
          </Grid>
        </Grid>
        {isShow.productsPendingOrder && (
          <ProductsPendingOrderTable />
        )}
        {isShow.pendingSupplierCollection && (
          <PendingSupplierCollectionTable />
        )}
        {isShow.pendingSupplierDelivery && (
          <PendingSupplierDeliveryTable />
        )}
        {isShow.purchaseOrders && <PurchaseOrdersTable />}
        {isShow.supplierCollection && (
          <SupplierCollectionTable />
        )}
        {isShow.supplierDeliveryNotes && (
          <SupplierDeliveryNotesTable />
        )}
      </PageContainer>
    </>
  )
}

export default StockAcquisition
