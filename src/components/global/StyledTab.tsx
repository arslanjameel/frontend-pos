import React from 'react'
import { Tab, styled } from '@mui/material'

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

export default StyledTab
