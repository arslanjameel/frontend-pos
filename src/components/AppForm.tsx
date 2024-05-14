import React from 'react'
import Image from 'next/image'
import { Box, Card, Typography } from '@mui/material'

import themeConfig from 'src/configs/themeConfig'
import { useWindowSize } from 'src/hooks/useWindowSize'

interface Props {
  children: React.ReactNode | React.ReactNode[]
  title: string
  subtitle: string
  maxWidth?: number
  onSubmit: () => void
  useForm?: boolean
}

const AppForm = ({
  title = '',
  subtitle = '',
  children,
  maxWidth = 450,
  onSubmit,
  useForm = true,
}: Props) => {
  const { isMobileSize } = useWindowSize()

  const FormContainer = () => (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 'fit-content',
          maxWidth,

          // minHeight: 'fit-content',
        }}
      >
        <Image
          src={'/images/login-top.png'}
          alt='login-top'
          height={150}
          width={150}
          style={{
            position: 'absolute',
            zIndex: 1,
            left: 0,
            top: 0,
            transform: 'translate(-50%,-50%)',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            background: 'background.paper',
            borderRadius: 3,
            zIndex: 10,
            mb: 10,
          }}
        >
          <Card
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: isMobileSize ? '100%' : maxWidth,
              p: isMobileSize ? 8 : 10,
              borderRadius: 3,
              zIndex: 10,
              mb: 10,
            }}
          >
            <Typography
              variant='h1'
              fontWeight={600}
              textAlign='center'
            >
              {themeConfig.templateName}
            </Typography>
            <Box sx={{ my: 6 }}>
              <Typography
                variant='h4'
                fontWeight={600}
                sx={{ mb: 1.5 }}
              >
                {title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            </Box>

            {children}
          </Card>
          <Image
            src={'/images/login-bottom.png'}
            alt='login-bottom'
            height={150}
            width={150}
            style={{
              position: 'absolute',
              zIndex: 1,
              right: 0,
              bottom: 0,
              transform: 'translate(50%,50%)',
            }}
          />
        </Box>
      </Box>
    </Box>
  )

  return useForm ? (
    <form onSubmit={onSubmit}>
      <FormContainer />
    </form>
  ) : (
    <FormContainer />
  )
}

export default AppForm
