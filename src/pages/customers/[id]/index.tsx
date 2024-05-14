import { Box, Card } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import PageContainer from 'src/components/global/PageContainer'
import { useWindowSize } from 'src/hooks/useWindowSize'
import CustomerOverviewTab from './CustomerOverviewTab'
import TransactionsTab from './TransactionsTab'

// import CommentsSection from 'src/components/global/CommentsSection'
import StatementsTab from './StatementsTab'
import ReferencesTab from './ReferencesTab'
import CustomerInfoCard from 'src/components/customers/CustomerInfoCard'
import { isIdValid } from 'src/utils/routerUtils'
import {
  useGetSingleCustomerQuery,

  // useGetCommentsQuery,
} from 'src/store/apis/customersSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import Error404 from 'src/pages/404'
import {
  IsResourceNotFound,
  getCustomNotFoundError,
} from 'src/utils/apiUtils'
import { buildUrl } from 'src/utils/routeUtils'

const SingleCustomerPage = () => {
  const router = useRouter()
  const customerId = isIdValid(router.query.id)

  const {
    data: customerData,
    isLoading,
    isError,
  } = useGetSingleCustomerQuery(customerId)

  // const { data: comments } = useGetCommentsQuery()

  const { isMobileSize, isWindowBelow } = useWindowSize()
  const [openedTab, setOpenedTab] = useState(0)

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('customer')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError || !customerData) return <CustomError404 />

  return IsResourceNotFound(customerData) ? (
    <CustomError404 />
  ) : (
    <PageContainer
      breadcrumbs={[
        { label: 'Customers', to: buildUrl('customers') },
        { label: 'Details', to: '#' },
      ]}
      sx={{ gap: 6 }}
    >
      {customerData && (
        <CustomerInfoCard customerData={customerData} />
      )}

      <Box
        sx={{
          flex: 1,
          minWidth: isMobileSize ? 'fit-content' : 400,
          flexDirection: 'column',
          display: 'flex',
          gap: 5,
          height: '100%',
          maxWidth: '100%',
          overflow: 'visible',
        }}
      >
        <AppTabs
          legacy={false}
          openedTab={openedTab}
          changeTab={setOpenedTab}
          tabs={[
            {
              id: 0,
              title: 'Transactions',
              content: (
                <Card
                  sx={{
                    height: '100% !important',
                    width: isWindowBelow(670)
                      ? 'calc(100vw - 50px) !important'
                      : 'auto',
                  }}
                >
                  <TransactionsTab
                    customer_id={customerId}
                    customerInfo={customerData}
                  />
                </Card>
              ),
              icon: 'tabler:clock',
            },
            {
              id: 1,
              title: 'Statements',
              content: (
                <Card sx={{ height: '100% !important' }}>
                  <StatementsTab
                    customer_id={customerId}
                    customerInfo={customerData}
                  />
                </Card>
              ),
              icon: 'tabler:grid',
            },
            {
              id: 2,
              title: 'Customer Details',
              content: (
                <CustomerOverviewTab
                  customerId={customerId}
                />
              ),
              icon: 'tabler:user-circle',
            },
            {
              id: 3,
              title: 'References',
              content: (
                <Card>
                  <ReferencesTab customerId={customerId} />
                </Card>
              ),
              icon: 'tabler:user-check',
            },
          ]}
          topContainerSx={{ background: 'background.main' }}
          bottomContainerSx={{ pt: 2, height: '100%' }}
        />
      </Box>
      {/* <CommentsSection
        comments={comments ? comments.results : []}
        customerId={customerId}
      /> */}
    </PageContainer>
  )
}

SingleCustomerPage.acl = {
  action: 'read',
  subject: 'customer',
}

export default SingleCustomerPage
