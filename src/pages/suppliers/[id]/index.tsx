import { Box, Card } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import PageContainer from 'src/components/global/PageContainer'
import { useWindowSize } from 'src/hooks/useWindowSize'

// import { useAppSelector } from 'src/store/hooks'
// import CommentsSection from 'src/components/global/CommentsSection'
// import { useGetCommentsQuery } from 'src/store/apis/customersSlice'
import StatementsTab from './StatementsTab'
import SuppliersDetailsTab from './SuppliersDetailsTab'
import SupplierInfoCard from 'src/components/suppliers/SupplierInfoCard'
import TransactionsTab from './TransactionsTab'
import { useGetSingleSupplierQuery } from 'src/store/apis/suppliersSlice'
import { isIdValid } from 'src/utils/routerUtils'
import Error404 from 'src/pages/404'
import FallbackSpinner from 'src/@core/components/spinner'
import {
  IsResourceNotFound,
  getCustomNotFoundError,
} from 'src/utils/apiUtils'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const SingleSupplierPage = () => {
  const ability = useContext(AbilityContext)

  const router = useRouter()
  const userId = isIdValid(router.query.id)

  const {
    data: supplierData,
    isLoading,
    isError,
  } = useGetSingleSupplierQuery(userId)

  // const supplierData = useAppSelector(state =>
  //   state.suppliers.suppliers.find(
  //     supplier => supplier.id === Number(userId),
  //   ),
  // )

  // const { data: comments } = useGetCommentsQuery()

  const { isMobileSize, isWindowBelow } = useWindowSize()
  const [openedTab, setOpenedTab] = useState(0)

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('supplier')

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError || !supplierData) return <CustomError404 />

  return IsResourceNotFound(supplierData) ? (
    <CustomError404 />
  ) : (
    <PageContainer
      breadcrumbs={[
        { label: 'Suppliers', to: '/suppliers' },
        { label: 'Details', to: '#' },
      ]}
      sx={{ gap: 5 }}
    >
      <SupplierInfoCard supplierData={supplierData} />

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
                  <TransactionsTab />
                </Card>
              ),
              icon: 'tabler:clock',
            },
            {
              id: 1,
              title: 'Statements',
              content: (
                <Card sx={{ height: '100% !important' }}>
                  <StatementsTab />
                </Card>
              ),
              icon: 'tabler:grid',
            },
            {
              id: 2,
              title: 'Supplier Details',
              content: (
                <Box sx={{ height: '100% !important' }}>
                  <SuppliersDetailsTab
                    isView={ability.cannot(
                      'update',
                      'supplier',
                    )}
                    defaultValues={supplierData}
                  />
                </Box>
              ),
              icon: 'tabler:user-circle',
            },
          ]}
          topContainerSx={{ background: 'background.main' }}
          bottomContainerSx={{ pt: 2, height: '100%' }}
        />
      </Box>

      {/* <CommentsSection
        comments={comments ? comments.results : []}
      /> */}
    </PageContainer>
  )
}

SingleSupplierPage.acl = {
  action: 'read',
  subject: 'supplier',
}

export default SingleSupplierPage
