import React, { useState } from 'react'
import { Box, Menu, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'

interface Props {
  children: React.ReactNode
}

const FilterMenu = ({ children }: Props) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const openOptions = (
    event: React.MouseEvent<HTMLElement>,
  ) => setAnchorEl(event.currentTarget)
  const closeOptions = () => setAnchorEl(null)

  return (
    <>
      <Menu
        id='long-menu'
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeOptions}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: 'fit-content',
            padding: 3,
            paddingRight: 6,
            paddingLeft: 6,
          },
        }}
      >
        {children}
      </Menu>
      <Box
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={openOptions}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          gap: 2,
          border: '1px solid rgba(219, 218, 222, 1)',
          borderRadius: 1,
          p: 1.8,
          px: 2.5,
        }}
      >
        <Typography sx={{ fontSize: 15 }}>
          Filter
        </Typography>{' '}
        <Icon icon='tabler:filter' />
      </Box>
    </>
  )
}

export default FilterMenu
