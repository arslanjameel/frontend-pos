import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useWindowSize } from 'src/hooks/useWindowSize'
import UseBgColor from 'src/@core/hooks/useBgColor'
import OrderDetailsTab from './OrderDetailsTab'
import DeliveryCollectionTab from './DeliveryCollectionTab'
import PageContainer from 'src/components/global/PageContainer'
import { isIdValid } from 'src/utils/routerUtils'
import { useGetSingleOrderQuery } from 'src/store/apis/orderSlice'
import InvoiceReturnsTab from 'src/components/global/Sales/InvoiceReturnsTab'
import { useGetSingleInvoiceQuery } from 'src/store/apis/invoicesSlice'
import HistoryTab from './HistoryTab'
import Error404 from 'src/pages/404'
import FallbackSpinner from 'src/@core/components/spinner'
import { getCustomNotFoundError } from 'src/utils/apiUtils'

const ViewOrderPage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)
  const {
    data: orderInfo,
    isLoading,
    isError,
  } = useGetSingleOrderQuery(id)

  //Get invoice Data
  const { data: invoiceInfo } = useGetSingleInvoiceQuery(
    orderInfo?.sale_invoice,
  )

  const [invoicedProducts, setInvoicedProducts] = useState<
    any[]
  >([])
  const { primaryFilled } = UseBgColor()
  const [openedTab, setOpenedTab] = useState(1)
  const { isMobileSize } = useWindowSize()

  useEffect(() => {
    setInvoicedProducts(
      (orderInfo?.sale_order_track || []).map(
        (prod: any) => ({
          ...prod,
          deliveryStatus: 2,
          productStatus: 2,
          delivered: 0,
          deliverNow: 1,
        }),
      ),
    )
  }, [orderInfo])

  const tabs = [
    {
      id: 1,
      title: 'Order Details',
      content: (
        <OrderDetailsTab
          customerInfo={orderInfo?.customer || {}}
          orderInfo={orderInfo}
          invoiceInfo={invoiceInfo}
          invoicedProducts={invoicedProducts}
        />
      ),
    },
    {
      id: 2,
      title: 'Delivery/Collection',
      content: (
        <DeliveryCollectionTab
          orderInfo={orderInfo}
          invoiceInfo={invoiceInfo}
          invoicedProducts={invoicedProducts}
        />
      ),
    },
    {
      id: 3,
      title: 'Returns',
      content: (
        <InvoiceReturnsTab
          invoiceId={orderInfo?.sale_invoice || 0}
          customerInfo={orderInfo?.customer}
          invoiceInfo={invoiceInfo}
          orderInfo={orderInfo}
          invoicedProducts={invoicedProducts}
          hasInvoiceBtns={false}
          hasOrderBtns
        />
      ),
    },
    {
      id: 4,
      title: 'History',
      content: <HistoryTab orderInfo={orderInfo} />,
    },

    // { id: 5, title: 'Costs', content: <CostsTab /> },
  ]

  const TopLink = ({
    label,
    id,
  }: {
    label: string
    id: number
  }) => (
    <Typography
      variant='h5'
      sx={{
        cursor: 'pointer',
        fontWeight: 600,
        color:
          id === openedTab
            ? primaryFilled.backgroundColor
            : '#a5a2ad',
      }}
      onClick={() => setOpenedTab(id)}
    >
      {label}
    </Typography>
  )

  const TabContent = ({
    children,
    id,
  }: {
    children: React.ReactNode
    id: number
  }) => (
    <Box
      sx={{
        display: id === openedTab ? 'flex' : 'none',
        height: '100%',
        width: '100%',
        flex: 1,
      }}
    >
      {children}
    </Box>
  )

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('order')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
      backToText='Back To Orders'
      backToLink='/orders'
    />
  )

  if (isLoading) return <FallbackSpinner brief />

  return (
    <PageContainer
      breadcrumbs={[
        { label: 'Sales Orders', to: '/orders' },
        { label: 'View', to: '#' },
      ]}
    >
      {/* {JSON.stringify(orderInfo)} */}
      <Grid
        container
        columns={12}
        rowSpacing={6}
        columnSpacing={6}
      >
        <Grid item md={12} sm={12} xs={12}>
          <Card
            sx={{
              p: 4,
              mb: 4,
              display: 'flex',
              flexWrap: 'wrap',
              rowGap: 5,
              alignItems: 'center',
              justifyContent: 'space-between',
              pl: !isMobileSize ? 10 : 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 8,
                rowGap: 3,
                py: 1,
              }}
            >
              {tabs.map(tab => (
                <TopLink
                  key={tab.id}
                  label={tab.title}
                  id={tab.id}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {isError || !orderInfo ? (
          <CustomError404 />
        ) : (
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flex: 1,
              }}
            >
              {tabs.map(tab => (
                <TabContent key={tab.id} id={tab.id}>
                  {tab.content}
                </TabContent>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  )
}

ViewOrderPage.acl = {
  action: 'create',
  subject: 'order',
}

export default ViewOrderPage
