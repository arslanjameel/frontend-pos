import { Box, Card, Grid, Typography } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { GridColDef } from '@mui/x-data-grid'

import AppTable from 'src/components/global/AppTable'
import DeliveryNotesModal from 'src/components/invoices/DeliveryNotesModal'
import { useModal } from 'src/hooks/useModal'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import { isIdValid } from 'src/utils/routerUtils'
import { useAppSelector } from 'src/store/hooks'
import TableDataModal from 'src/components/global/TableDataModal'
import QuoteInfoTab from './QuoteInfoTab'

// import AppTabs from 'src/components/global/AppTabs'
// import ChatCard from 'src/components/global/ChatCard'
import { buildUrl } from 'src/utils/routeUtils'
import { useGetSingleQuoteQuery } from 'src/store/apis/quotesSlice'
import Error404 from 'src/pages/404'
import FallbackSpinner from 'src/@core/components/spinner'
import { getCustomNotFoundError } from 'src/utils/apiUtils'

const ViewQuotePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)
  const {
    data: quoteData,
    isLoading,
    isError,
  } = useGetSingleQuoteQuery(id)

  const invoiceAddress = useAppSelector(state =>
    state.customers.addresses.find(
      addr => addr.id === quoteData?.invoiceAddress,
    ),
  )
  const deliveryAddress = useAppSelector(state =>
    state.customers.addresses.find(
      addr => addr.id === quoteData?.deliveryAddress,
    ),
  )

  const customerInfo: IData = {
    firstName: '',
    lastName: '',
  }

  const {
    modalData: deliveryNotesData,

    // openModal: openDeliveryNotesModal,
    closeModal: closeDeliveryNotesModal,
    isModalOpen: deliveryNotesModalStatus,
  } = useModal<any>()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  // const [openedMiniTab, setOpenedMiniTab] = useState(0)

  const columns: GridColDef[] = [
    {
      field: 'product_name',
      headerName: 'PRODUCT',
      type: 'string',
      minWidth: 150,
      flex: 1,
      maxWidth: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight={500}>
            {params.value}
          </Typography>
          <Typography variant='body2' sx={{ opacity: 0.7 }}>
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'product_note',
      headerName: 'INTERNAL NOTES',
      type: 'string',
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value || '--'}</Typography>
      ),
    },
  ]

  // const quoteToInvoice = () => {
  //   localStorage.setItem(
  //     'quoteToInvoice',
  //     JSON.stringify(quoteData),
  //   )
  //   router.push(buildUrl('invoices', { mode: 'new' }))
  // }

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
          { label: 'Sales Quote', to: buildUrl('quotes') },
          { label: 'View', to: '#' },
        ]}
      >
        {isError || !quoteData ? (
          <CustomError404 />
        ) : (
          <Grid
            container
            columns={12}
            rowSpacing={6}
            columnSpacing={6}
          >
            <Grid item md={12} sm={12} xs={12}>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flex: 1,
                }}
              >
                <QuoteInfoTab
                  customerInfo={
                    quoteData == undefined
                      ? customerInfo
                      : quoteData.customer
                  }
                  quoteInfo={quoteData}
                  quotedProducts={
                    quoteData == undefined
                      ? []
                      : quoteData.sale_quote
                  }
                  addresses={{
                    invoiceAddress:
                      invoiceAddress?.addressLine || '',
                    deliveryAddress:
                      deliveryAddress?.addressLine || '',
                  }}
                />
              </Box>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid
                container
                columns={12}
                rowSpacing={6}
                columnSpacing={6}
              >
                <Grid item md={12} sm={12} xs={12}>
                  <Card sx={{ height: '100%' }}>
                    <AppTable
                      columns={columns}
                      rows={quoteData?.sale_quote || []}
                      miniColumns={['product_name']}
                      openMiniModal={openTableDataModal}
                      showToolbar={false}
                      showPageSizes={false}
                      pagination={false}
                      flexHeight
                    />
                  </Card>
                </Grid>
                {/* <Grid item md={3} sm={6} xs={12}>
                  <Card sx={{ flex: 1, px: 3, py: 1 }}>
                    <AppTabs
                      legacy
                      openedTab={openedMiniTab}
                      changeTab={tabId =>
                        setOpenedMiniTab(tabId)
                      }
                      tabs={[
                        {
                          id: 0,
                          icon: 'tabler:trending-up',
                          title: 'Activity',
                          content: (
                            <Box sx={{ py: 4 }}>
                              <ChatCard
                                img='add-img-link'
                                text='Raw Products with SKU FRANKIE TP125 has been deleted'
                                time='Today 10.00 AM'
                              />
                              <Divider sx={{ my: 2 }} />
                              <ChatCard
                                img='add-img-link'
                                text='Raw Products with SKU FRANKIE TP125 has been deleted'
                                time='Today 10.00 AM'
                              />
                            </Box>
                          ),
                        },
                      ]}
                      topContainerSx={{ width: '100%' }}
                      bottomContainerSx={{ height: '100%' }}
                      tabSx={{ flex: 1 }}
                    />
                  </Card>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        )}
      </PageContainer>

      <DeliveryNotesModal
        open={deliveryNotesModalStatus()}
        handleClose={closeDeliveryNotesModal}
        data={deliveryNotesData}
        print={() => {
          toast.success('TODO: print')
          closeDeliveryNotesModal()
        }}
        markAsComplete={() => {
          console.log('TODO')
        }}
      />

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.name,
                'SKU:': tableData.sku,
                'Notes:': tableData.internalNotes,
              }
            : {}
        }
      />
    </>
  )
}

ViewQuotePage.acl = {
  action: 'update',
  subject: 'quote',
}

export default ViewQuotePage
