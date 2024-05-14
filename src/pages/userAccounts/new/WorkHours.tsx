import { Box, Typography } from '@mui/material'
import React from 'react'

import WeekWorkHours from 'src/components/userAccounts/WeekWorkHours'

interface Props {
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  prevStep: () => void
}

const WorkHours = ({ nextStep, prevStep }: Props) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pb: 5,
        }}
      >
        <Typography fontWeight={600} fontSize={20}>
          Work Hours
        </Typography>
        <Typography>
          Enter the Standard Work Hours
        </Typography>
      </Box>

      <WeekWorkHours
        useForm
        headerShown={false}
        prevNext
        prevStep={prevStep}
        nextStep={nextStep}
      />
    </Box>
  )
}

export default WorkHours
