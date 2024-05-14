import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import CustomTag from 'src/components/global/CustomTag'
import {
  useGetInvoiceDeliveryNotesQuery,
  useGetOrderDeliveryNotesQuery,
} from 'src/store/apis/deliveryNotesSlice'
import { formatDate } from 'src/utils/dateUtils'

interface Props {
  invoiceId?: number
  orderId?: number
  openDeliveryModal: (values: any) => void
}

const DeliveryNotesTabCard = ({
  invoiceId,
  orderId,
  openDeliveryModal,
}: Props) => {
  const [openedMiniTab, setOpenedMiniTab] = useState(0)

  const { data: invoiceDeliveryNotes } =
    useGetInvoiceDeliveryNotesQuery(invoiceId || 0)
  const { data: orderDeliveryNotes } =
    useGetOrderDeliveryNotesQuery(orderId || 0)

  const getList = () => {
    if (invoiceId) {
      return invoiceDeliveryNotes || []
    }

    return orderDeliveryNotes || []
  }

  return (
    <AppTabs
      legacy
      openedTab={openedMiniTab}
      changeTab={tabId => setOpenedMiniTab(tabId)}
      tabs={[
        {
          id: 0,
          icon: 'tabler:receipt-2',
          title: 'Delivery Notes',
          content: (
            <Box sx={{ py: 3 }}>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: `1px solid #ddd`,
                }}
              >
                {getList()
                  .map(val => ({
                    ...val,
                    title: val.id,
                    amount: formatDate(val.created_at),
                  }))
                  .map(obj => (
                    <Box
                      key={obj.title}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: `1px solid #ddd`,
                        px: 2,
                        py: 2,
                      }}
                    >
                      <Typography
                        color='primary'
                        fontWeight={600}
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          openDeliveryModal({
                            submittedDataForDelivery: {
                              customerName:
                                obj.customer_name,
                              customerRef: obj.customer_ref,
                              customerDeliveryAddress:
                                obj.delivery_address,
                              productsInfo:
                                obj.sale_delivery_note_track ||
                                [],
                            },
                            deliveryNote: obj,
                          })
                        }
                      >
                        {obj.title}
                      </Typography>
                      <CustomTag
                        color='success'
                        label={obj.amount}
                      />
                    </Box>
                  ))}

                {(getList().length || 0) === 0 && (
                  <Typography
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      fontStyle: 'italic',
                    }}
                  >
                    No Delivery Notes Added
                  </Typography>
                )}
              </Box>
            </Box>
          ),
        },
      ]}
      topContainerSx={{ width: '100%' }}
      bottomContainerSx={{ height: '100%' }}
      tabSx={{ flex: 1 }}
    />
  )
}

export default DeliveryNotesTabCard
