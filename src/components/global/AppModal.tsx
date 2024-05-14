import {
  Box,
  Card,
  Modal,
  SxProps,
  Typography,
} from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'

interface Props {
  open: boolean
  handleClose: () => void
  width?: number
  maxWidth?: number
  zIndex?: number
  maxHeight?: number | string
  children: React.ReactNode
  sx?: SxProps
  isMobile?: boolean
  title?: string
  subTitle?: string
  titleAlign?: 'center' | 'left' | 'right'
  closeBtn?: boolean
}

const AppModal = ({
  open,
  handleClose,
  maxWidth = 450,
  zIndex = 999,
  maxHeight = '75vh',
  children,
  sx = {},
  isMobile,
  title,
  subTitle,
  titleAlign = 'center',
  closeBtn = true,
}: Props) => {
  const { isWindowBelow } = useWindowSize()

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus={true}
      sx={{
        outline: '0 !important',
        '&:focus': {
          outline: '0 !important',
        },
      }}
    >
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',

          // minWidth: 'fit-content',
          width: '100%',
          transition: 'all .2s linear ',
          maxWidth:
            isMobile || isWindowBelow(maxWidth + 100)
              ? '90% !important'
              : maxWidth,
          bgcolor: 'background.paper',
          boxShadow: 24,
          my: '1vh',
          overflow: 'visible',
          zIndex,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight,
            maxWidth: '100%',
          }}
        >
          {closeBtn && (
            <Box sx={{ position: 'relative' }}>
              <Box
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  transform: 'translate(50%, -50%)',
                  backgroundColor: 'background.paper',
                  boxShadow: 24,
                  width: 27,
                  height: 27,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              >
                <Icon
                  icon='tabler:x'
                  style={{ fontSize: 17 }}
                />
              </Box>
            </Box>
          )}

          <Box sx={{ p: 7, overflow: 'auto', ...sx }}>
            {title && (
              <Box>
                <Typography
                  id='modal-modal-title'
                  variant='h4'
                  sx={{
                    p: 2,
                    pt: 3,
                    pb: 0,
                    textAlign: titleAlign,
                    mb: 5,
                    fontWeight: 600,
                  }}
                >
                  {title}
                </Typography>

                {subTitle && (
                  <Typography
                    id='modal-modal-description'
                    sx={{ mb: 3, textAlign: titleAlign }}
                  >
                    {subTitle}
                  </Typography>
                )}
              </Box>
            )}
            {children}
          </Box>
        </Box>
      </Card>
    </Modal>
  )
}

export default AppModal
