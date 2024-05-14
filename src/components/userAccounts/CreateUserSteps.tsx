import { Box, Card, Typography } from '@mui/material'
import React from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import DefaultPalette from 'src/@core/theme/palette'
import { useWindowSize } from 'src/hooks/useWindowSize'

interface Step {
  id: number
  title: string
  icon: string
  PageComponent: React.ReactNode
}

interface Props {
  activeStep: number
  activatedSteps: number[]
  changeStep: (step: number) => void
  steps: Step[]
}

const CreateUserSteps = ({
  activeStep,
  activatedSteps,
  changeStep,
  steps,
}: Props) => {
  const { isWindowBelow } = useWindowSize()
  const { settings } = useSettings()
  const { primary, grey } = DefaultPalette(
    'light',
    settings.skin,
  )

  return (
    <Card sx={{ mt: 5 }}>
      <Box
        sx={{
          p: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          borderBottom: '2px solid #dddddd8a',
        }}
      >
        {steps.map(step => (
          <>
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() =>
                activatedSteps.includes(step.id) &&
                changeStep(step.id)
              }
            >
              <Icon
                icon={step.icon}
                fontSize={36}
                color={
                  step.id === activeStep
                    ? primary.light
                    : grey[600]
                }
              />
              {!isWindowBelow(450) && (
                <Typography
                  textAlign='center'
                  color={
                    step.id === activeStep
                      ? primary.light
                      : grey[600]
                  }
                >
                  {step.title}
                </Typography>
              )}
            </Box>
            {step.id !== steps.length && (
              <Icon icon='tabler:chevron-right' />
            )}
          </>
        ))}
      </Box>

      <Box sx={{ p: 5 }}>
        {
          steps.find(step => step.id === activeStep)
            ?.PageComponent
        }
      </Box>
    </Card>
  )
}

export default CreateUserSteps
