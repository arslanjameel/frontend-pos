import { Box, Card, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import themeConfig from 'src/configs/themeConfig'

interface Props {
  children: React.ReactNode | React.ReactNode[]
  title: string
  subtitle: string
  textAlign?: 'center' | 'left'
  maxWidth?: number
}

const AuthFormContainer = ({
  title = '',
  subtitle = '',
  textAlign = 'left',
  children,
  maxWidth = 450,
}: Props) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: maxWidth,
          minHeight: 'fit-content',
          pt: 10,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth,
            minHeight: 'fit-content',
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

                maxWidth: maxWidth,
                p: 8,
                borderRadius: 3,
                zIndex: 10,
                mb: 10,
                '@media screen and (max-width: 700px)': {
                  maxWidth: '100%',
                  p: 10,
                },
              }}
            >
              <Typography
                variant='h1'
                fontWeight={600}
                textAlign='center'
              >
                {themeConfig.templateName}
                {/* {windowSize.width} */}
              </Typography>
              <Box sx={{ my: 6 }}>
                <Typography
                  variant='h4'
                  fontWeight={600}
                  sx={{ mb: 1.5, textAlign }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    textAlign,
                  }}
                >
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
    </Box>
  )
}

export default AuthFormContainer
