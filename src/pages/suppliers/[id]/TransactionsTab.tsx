import { Box } from '@mui/material'
import React, { useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import DetailedTab from './DetailedTab'
import OutstandingTab from './OutstandingTab'

const TransactionsTab = () => {
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
            content: <OutstandingTab />,
          },
          {
            id: 1,
            title: 'Detailed',
            content: <DetailedTab />,
          },
        ]}
        bottomContainerSx={{ height: '100%' }}
      />
    </Box>
  )
}

export default TransactionsTab
