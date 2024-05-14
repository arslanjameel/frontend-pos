import * as React from 'react'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'

import Icon from 'src/@core/components/icon'

interface Props {
  product_note: string
  onClick: () => void
}

const NotesBtnWithPopover = ({
  product_note,
  onClick,
}: Props) => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLElement | null>(null)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <IconButton
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={e => {
          product_note !== '' && handlePopoverOpen(e)
        }}
        onMouseLeave={handlePopoverClose}
        color={
          product_note === '' ? 'secondary' : 'primary'
        }
        onClick={onClick}
      >
        <Icon icon='tabler:notes' />
      </IconButton>

      <Popover
        id='mouse-over-popover'
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}>
          {product_note}
        </Typography>
      </Popover>
    </div>
  )
}

export default NotesBtnWithPopover
