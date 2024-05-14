import { Box } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import DeliveryNotesModal from 'src/components/invoices/DeliveryNotesModal'
import { useModal } from 'src/hooks/useModal'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import EmailModal from 'src/components/global/EmailModal'
import { isIdValid } from 'src/utils/routerUtils'
import { getFullName } from 'src/utils/dataUtils'

// import Icon from 'src/@core/components/icon'
// import AppTabs from 'src/components/global/AppTabs'
// import ChatCard from 'src/components/global/ChatCard'
import ReceiptInfoTab from './ReceiptInfoTab'
import { buildUrl } from 'src/utils/routeUtils'
import { useGetSingleReceiptQuery } from 'src/store/apis/receiptsSlice'
import GoToInvoiceModal from 'src/components/global/GoToInvoiceModal'

const ViewReceiptPage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)
  const { data: receiptData } = useGetSingleReceiptQuery(id)

  const {
    modalData: deliveryNotesData,
    closeModal: closeDeliveryNotesModal,
    isModalOpen: deliveryNotesModalStatus,
  } = useModal<any>()

  const {
    modalData: invoiceToEmail,
    openModal: openEmailInvoiceModal,
    closeModal: closeEmailInvoiceModal,
    isModalOpen: emailInvoiceModalStatus,
  } = useModal<IData>()

  const {
    openModal: openGotoInvoiceModal,
    closeModal: closeGotoInvoiceModal,
    isModalOpen: gotoInvoiceModalStatus,
  } = useModal<IData>()

  // const [openedMiniTab, setOpenedMiniTab] = useState(0)

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Payment Receipts',
            to: buildUrl('receipts'),
          },
          { label: 'View', to: '#' },
        ]}
      >
        {/* <Grid
          container
          columns={12}
          rowSpacing={2}
          columnSpacing={6}
          spacing={6}
        >
          <Grid item md={12} sm={12} xs={12}> */}
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flex: 1,
          }}
        >
          <ReceiptInfoTab
            customerInfo={
              receiptData
                ? receiptData.customer
                : { firstName: '', lastName: '', id: 0 }
            }
            receiptInfo={receiptData}
            invoices={
              receiptData ? receiptData.receipt_track : []
            }
            openEmailInvoiceModal={() =>
              receiptData
                ? openEmailInvoiceModal(
                    receiptData?.customer,
                  )
                : toast.error('Customer data not found')
            }
            openGotoInvoiceModal={() =>
              openGotoInvoiceModal({})
            }
          />
        </Box>
        {/* </Grid> */}

        {/* <Grid
            item
            md={3.4}
            sm={12}
            xs={12}
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          > */}

        {/* <Card sx={{ flex: 1, px: 3, py: 1 }}>
              <AppTabs
                legacy
                openedTab={openedMiniTab}
                changeTab={tabId => setOpenedMiniTab(tabId)}
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
            </Card> */}
        {/* </Grid> */}
        {/* </Grid> */}
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
          console.log('TODO: edit')
        }}
      />

      <EmailModal
        open={emailInvoiceModalStatus()}
        handleClose={closeEmailInvoiceModal}
        onSubmit={({ email }) => {
          toast.success(`TODO: Email sent to ${email}`)
          closeEmailInvoiceModal()
        }}
        title='Email Customer'
        data={{
          'Customer Name':
            invoiceToEmail && getFullName(invoiceToEmail),
          'Document ID':
            invoiceToEmail && invoiceToEmail.id,
          'Document Type': 'Invoice',
          'Document Date':
            invoiceToEmail && invoiceToEmail.createdAt,
        }}
      />

      <GoToInvoiceModal
        title='Select Invoice'
        subTitle='Select the invoice you would like to view'
        open={gotoInvoiceModalStatus()}
        handleClose={closeGotoInvoiceModal}
        invoices={receiptData?.receipt_track || []}
      />
    </>
  )
}

ViewReceiptPage.acl = {
  action: 'read',
  subject: 'receipt',
}

export default ViewReceiptPage
