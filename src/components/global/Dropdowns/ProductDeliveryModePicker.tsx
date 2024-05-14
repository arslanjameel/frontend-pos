import React, { useState } from 'react'
import { Box, Menu, Tooltip } from '@mui/material'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import {
  IProductDeliveryMode,
  ProductDeliveryMode,
} from 'src/models/ISaleInvoice'

interface Props {
  status: IProductDeliveryMode
  onChange?: (val: IProductDeliveryMode) => void
  readOnly?: boolean
}

interface StatusOption {
  status: IProductDeliveryMode
  colors: {
    color: string
    backgroundColor: string
  }
  icon: string
  tooltip: string
  readOnly?: boolean
}

const ProductDeliveryModePicker = ({
  status,
  onChange,
  readOnly,
}: Props) => {
  const {
    infoFilled,
    primaryFilled,
    successFilled,
    warningFilled,
  } = UseBgColor()

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const openOptions = (
    event: React.MouseEvent<HTMLElement>,
  ) => !readOnly && setAnchorEl(event.currentTarget)
  const closeOptions = () => setAnchorEl(null)

  const options: StatusOption[] = [
    {
      status: ProductDeliveryMode.PICK_UP,
      colors: warningFilled,
      icon: 'tabler:box-seam',
      tooltip: 'Collect later',
    },
    {
      status: ProductDeliveryMode.COLLECTED,
      colors: successFilled,
      icon: 'tabler:square-check',
      tooltip: 'Collecting now',
    },
    {
      status: ProductDeliveryMode.DELIVERY,
      colors: primaryFilled,
      icon: 'tabler:truck-delivery',
      tooltip: 'Store to deliver',
    },
    {
      status: ProductDeliveryMode.SUPPLIERDELIVERY,
      colors: infoFilled,
      icon: 'tabler:door-enter',
      tooltip: 'Supplier direct delivery',
    },
  ]
  const getOption = (status: IProductDeliveryMode) =>
    options.find(v => v.status === status) || {
      colors: infoFilled,
      icon: 'tabler:door-enter',
      status,
      tooltip: status,
    }

  const StyledStatus = ({
    statusInfo,
  }: {
    statusInfo: StatusOption
  }) => (
    <Tooltip
      title={statusInfo.tooltip}
      arrow
      placement='right'
      sx={{ fontSize: 8 }}
      PopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -8],
            },
          },
        ],
      }}
    >
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          ...statusInfo.colors,
          borderRadius: 3,
          minWidth: 60,
          m: 1.5,
          p: 1.5,
          px: 2,
        }}
        onClick={() => {
          onChange && onChange(statusInfo.status)
          closeOptions()
        }}
      >
        <Icon icon={statusInfo.icon} />
      </Box>
    </Tooltip>
  )

  return (
    <>
      <Tooltip
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        title={getOption(status).tooltip}
        arrow
        sx={{ fontSize: 8, userSelect: 'none' }}
        placement='top'
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -8],
              },
            },
          ],
        }}
      >
        <Box
          onClick={openOptions}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            ...getOption(status).colors,
            borderRadius: 3,
            p: 1.5,
            px: 2,
            minWidth: 50,
            width: 'fit-content',
          }}
        >
          <Icon icon={getOption(status).icon} />

          {!readOnly && (
            <Icon
              icon='tabler:brackets-angle'
              style={{ transform: 'rotate(90deg)' }}
            />
          )}
        </Box>
      </Tooltip>

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
            width: 'fit-content',
          },
        }}
      >
        {options.map(opt => (
          <StyledStatus key={opt.status} statusInfo={opt} />
        ))}
      </Menu>
    </>
  )
}

export default ProductDeliveryModePicker
