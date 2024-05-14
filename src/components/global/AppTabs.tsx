import {
  Box,
  SxProps,
  Tab,
  Tabs,
  styled,
} from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  sx?: SxProps
}

interface ITabs {
  id: number
  icon?: string
  title: string
  content: React.ReactNode
}

interface Props {
  tabs: ITabs[]
  openedTab: number
  changeTab: (index: number) => void
  customBtns?: React.ReactNode
  legacy?: boolean
  topContainerSx?: SxProps
  bottomContainerSx?: SxProps
  tabSx?: SxProps
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props

  return (
    <Box
      role='tabpanel'
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{ overflowY: 'auto', ...sx }}
    >
      {value === index && children}
    </Box>
  )
}

interface StyledTabsProps {
  children?: React.ReactNode
  value: number
  onChange: (
    event: React.SyntheticEvent,
    newValue: number,
  ) => void
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    scrollButtons={true}
    TabIndicatorProps={{
      children: <span className='MuiTabs-indicatorSpan' />,
    }}
    variant='scrollable'
  />
))({
  borderBottomWidth: '0 !important',
  marginBottom: 15,

  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    display: 'none',
  },
  '& .MuiTabs-scrollButtons': {
    position: 'absolute',
  },
})

interface StyledTabProps {
  label: string
  icon?:
    | string
    | React.ReactElement<
        any,
        string | React.JSXElementConstructor<any>
      >
    | undefined
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab iconPosition='start' disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'rgba(168, 170, 174, 1)',
  borderRadius: 6,
  minWidth: 'fit-content !important',
  padding: '5px 12px',
  gap: 3,

  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: theme.palette.primary.dark,
  },
}))

const AppTabs = ({
  legacy = true,
  tabs,
  openedTab,
  changeTab,
  customBtns,
  topContainerSx = {},
  bottomContainerSx = {},
  tabSx = {},
}: Props) => {
  const { isMobileSize } = useWindowSize()
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    changeTab(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {legacy ? (
        <Tabs
          value={openedTab}
          onChange={handleChange}
          sx={{ overflowX: 'auto', ...topContainerSx }}
        >
          {tabs.map((tab: ITabs) => (
            <Tab
              sx={{ padding: '5px 12px', ...tabSx }}
              iconPosition='start'
              icon={<Icon icon={tab.icon || ''} />}
              key={tab.id}
              label={
                isMobileSize && tab.icon ? '' : tab.title
              }
              {...a11yProps(tab.id)}
            />
          ))}

          {customBtns && customBtns}
        </Tabs>
      ) : (
        <StyledTabs
          value={openedTab}
          onChange={handleChange}
        >
          {tabs.map((tab: ITabs) => (
            <StyledTab
              icon={<Icon icon={tab.icon || ''} />}
              key={tab.id}
              label={
                isMobileSize && tab.icon ? '' : tab.title
              }
              {...a11yProps(tab.id)}
            />
          ))}

          {customBtns && customBtns}
        </StyledTabs>
      )}

      {tabs.map(tab => (
        <CustomTabPanel
          key={tab.id}
          value={openedTab}
          index={tab.id}
          sx={{
            overflow: 'visible',
            flex: 1,
            display: openedTab !== tab.id ? 'none' : 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            ...bottomContainerSx,
          }}
        >
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  )
}

export default AppTabs
