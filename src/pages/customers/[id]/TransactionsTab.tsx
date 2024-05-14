import { Box } from '@mui/material'
import React, { useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import OutstandingTab from './OutstandingTab'
import DetailedTab from './DetailedTab'
import { ICustomer } from 'src/models/ICustomer'

interface Props {
  customer_id: number
  customerInfo?: ICustomer
}

const TransactionsTab = ({
  customer_id,
  customerInfo,
}: Props) => {
  const [openedTab, setOpenedTab] = useState(0)

  return (
    <Box>
      <AppTabs
        legacy
        openedTab={openedTab}
        changeTab={tabId => setOpenedTab(tabId)}
        tabs={[
          {
            id: 0,
            title: 'Outstanding',
            content: (
              <OutstandingTab
                customer_id={customer_id}
                customerInfo={customerInfo}
              />
            ),
          },
          {
            id: 1,
            title: 'Detailed',
            content: (
              <DetailedTab
                customer_id={customer_id}
                customerInfo={customerInfo}
              />
            ),
          },
        ]}
        bottomContainerSx={{ height: '100%' }}
      />
    </Box>
  )
}

export default TransactionsTab
