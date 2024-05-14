import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'

interface IMenuItem {
  label: string
  icon?: string
  onClick: () => void
}

interface Props {
  menuItems: IMenuItem[]
}

const AppMenu = ({ menuItems }: Props) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const openOptions = (
    event: React.MouseEvent<HTMLElement>,
  ) => setAnchorEl(event.currentTarget)
  const closeOptions = () => setAnchorEl(null)

  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={openOptions}
      >
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeOptions}
        PaperProps={{ style: { width: 'fit-content' } }}
      >
        {menuItems.map(item => (
          <MenuItem
            key={item.label}
            onClick={() => {
              item.onClick()
              closeOptions()
            }}
          >
            <ListItemIcon>
              <Icon icon={item.icon || ''} />
            </ListItemIcon>
            <ListItemText> {item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default AppMenu
