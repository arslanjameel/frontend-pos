import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useWindowSize } from 'src/hooks/useWindowSize'
import UseBgColor from 'src/@core/hooks/useBgColor'
import DeliveryCollectionTab from './DeliveryCollectionTab'
import HistoryTab from './HistoryTab'

// import ReturnsTab from './ReturnsTab'
// import CostsTab from './CostsTab'
import CustomTag from 'src/components/global/CustomTag'
import PageContainer from 'src/components/global/PageContainer'
import { isIdValid } from 'src/utils/routerUtils'
import { useGetSingleInvoiceQuery } from 'src/store/apis/invoicesSlice'
import InvoiceDetailsTab from './InvoiceDetailsTab'
import { getCustomNotFoundError } from 'src/utils/apiUtils'
import Error404 from 'src/pages/404'
import FallbackSpinner from 'src/@core/components/spinner'
import InvoiceReturnsTab from 'src/components/global/Sales/InvoiceReturnsTab'
import { getInvoicePaidAndBalance } from 'src/utils/invoicesUtils'

const ViewInvoicePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetSingleInvoiceQuery(id)

  const [invoicedProducts, setInvoicedProducts] = useState<
    any[]
  >([])

  const { primaryFilled } = UseBgColor()
  const [openedTab, setOpenedTab] = useState(1)
  const { isMobileSize } = useWindowSize()

  const tabs = [
    {
      id: 1,
      title: 'Invoice Details',
      content: (
        <InvoiceDetailsTab
          invoiceId={id}
          invoiceInfo={invoiceData}
          customerInfo={invoiceData?.customer}
          invoicedProducts={invoiceData?.sold_on_invoice}
        />
      ),
    },
    {
      id: 2,
      title: 'Delivery/Collection',
      content: (
        <DeliveryCollectionTab
          invoiceId={invoiceData?.id}
          invoiceInfo={invoiceData}
          invoicedProducts={
            invoiceData?.sold_on_invoice || []
          }
          updateInvoicedProducts={(
            productId,
            key,
            value,
          ) => {
            let tempProducts = [...invoicedProducts]
            tempProducts = tempProducts.map(prod =>
              prod.id === productId
                ? { ...prod, [key]: value }
                : prod,
            )
            setInvoicedProducts(tempProducts)
          }}
          updateAllInvoicedProducts={updatedProducts =>
            setInvoicedProducts(updatedProducts)
          }
          customerInfo={invoiceData?.customer}
        />
      ),
    },
    {
      id: 3,
      title: 'Returns',
      content: (
        <InvoiceReturnsTab
          invoiceId={invoiceData?.id || 0}
          invoiceInfo={invoiceData}
          customerInfo={invoiceData?.customer}
          invoicedProducts={
            invoiceData?.sold_on_invoice || []
          }
        />
      ),
    },
    {
      id: 4,
      title: 'History',
      content: (
        <HistoryTab
          invoiceInfo={invoiceData}
          customerInfo={invoiceData?.customer}
          invoicedProducts={
            invoiceData?.sold_on_invoice || []
          }
        />
      ),
    },

    // { id: 5, title: 'Costs', content: <CostsTab invoicedProducts={invoiceData?.sold_on_invoice} /> }
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

  useEffect(() => {
    setInvoicedProducts(
      invoiceData
        ? invoiceData.sold_on_invoice
          ? invoiceData.sold_on_invoice.map(prod => ({
              ...prod,
              deliveryStatus: 2,
              productStatus: 2,
              delivered: 0,
              deliverNow: 2,
            }))
          : []
        : [],
    )
  }, [invoiceData])

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('invoice')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
      backToText='Back To Invoices'
      backToLink='/invoices'
    />
  )

  if (isLoading) return <FallbackSpinner brief />

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Sales Invoices', to: '/invoices' },
          { label: 'View', to: '#' },
        ]}
      >
        {isError || !invoiceData ? (
          <CustomError404 />
        ) : (
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

                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                  }}
                >
                  {Number(
                    invoiceData
                      ? getInvoicePaidAndBalance(
                          invoiceData,
                        ).amountDue
                      : -1,
                  ) === 0 && (
                    <CustomTag
                      label='INVOICE PAID'
                      color='success'
                    />
                  )}
                  {/* <CustomTag label='ITEMS RECEIVED' color='success' /> */}
                </Box>
              </Card>
            </Grid>

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
          </Grid>
        )}
      </PageContainer>
    </>
  )
}

ViewInvoicePage.acl = {
  action: 'read',
  subject: 'invoice',
}

export default ViewInvoicePage
