import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import React, { useState } from 'react'

import AppTabs from 'src/components/global/AppTabs'
import CustomTag from 'src/components/global/CustomTag'

interface Props {
  itemsList: {
    link: string
    label: string | number
    value: number | string
  }[]
}

const BottomTabsList = ({ itemsList }: Props) => {
  const [openedMiniTab, setOpenedMiniTab] = useState(0)

  return (
    <AppTabs
      legacy
      openedTab={openedMiniTab}
      changeTab={tabId => setOpenedMiniTab(tabId)}
      tabs={[
        {
          id: 0,
          icon: 'tabler:receipt-2',
          title: 'Receipts',
          content: (
            <Box sx={{ py: 3 }}>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: `1px solid #ddd`,
                }}
              >
                {itemsList.map(obj => (
                  <Box
                    key={obj.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: `1px solid #ddd`,
                      px: 2,
                      py: 2,
                    }}
                  >
                    <Link href={obj.link}>
                      <Typography color='primary'>
                        {obj.label}
                      </Typography>
                    </Link>
                    <CustomTag
                      color='success'
                      label={obj.value}
                    />
                  </Box>
                ))}

                {itemsList.length === 0 && (
                  <Typography
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      fontStyle: 'italic',
                    }}
                  >
                    No Receipts Added
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

export default BottomTabsList
