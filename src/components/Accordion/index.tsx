import React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion, {
  AccordionProps,
} from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'

import Icon from 'src/@core/components/icon'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
  />
))(() => ({
  '&.MuiPaper-elevation': {
    boxShadow: 'none !important',
  },
  '&.MuiButtonBase-root': {
    padding: '0px !important',
  },
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    boxShadow: 'none',
  },
}))

const AccordionSummary = styled(
  (props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<Icon icon='tabler:chevron-down' />}
      {...props}
    />
  ),
)(() => ({}))

const AccordionSummaryOpposite = styled(
  (props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<Icon icon='tabler:chevron-down' />}
      {...props}
    />
  ),
)(() => ({
  display: 'flex',
  gap: 15,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {},
}))

const AccordionDetails = styled(MuiAccordionDetails)(
  () => ({
    marginTop: 10,
  }),
)

export default {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryOpposite,
}
