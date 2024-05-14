import React, { useState } from 'react'
import { Box, Menu } from '@mui/material'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import {
  IProductStatus,
  ProductStatus,
} from 'src/models/ISaleInvoice'

interface Props {
  status: IProductStatus
  onChange?: (val: IProductStatus) => void
  readOnly?: boolean
}

interface StatusOption {
  status: IProductStatus
  colors: {
    color: string
    backgroundColor: string
  }
  icon: string
}

const ProductStatusPicker = ({
  status,
  onChange,
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
  ) => setAnchorEl(event.currentTarget)
  const closeOptions = () => setAnchorEl(null)

  const options: StatusOption[] = [
    {
      status: ProductStatus.PICKUP,
      colors: warningFilled,
      icon: 'tabler:box-seam',
    },
    {
      status: ProductStatus.COLLECTED,
      colors: successFilled,
      icon: 'tabler:square-check',
    },
    {
      status: ProductStatus.DELIVERY,
      colors: primaryFilled,
      icon: 'tabler:truck-delivery',
    },
    {
      status: ProductStatus.SUPPLIERDELIVERY,
      colors: infoFilled,
      icon: 'tabler:door-enter',
    },
  ]
  const getOption = (status: IProductStatus) =>
    options.find(v => v.status === status) || {
      colors: infoFilled,
      icon: 'tabler:door-enter',
      status,
    }

  const StyledStatus = ({
    statusInfo,
  }: {
    statusInfo: StatusOption
  }) => (
    <Box
      title={statusInfo.status}
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
  )

  return (
    <>
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
          ...getOption(status).colors,
          borderRadius: 3,
          p: 1.5,
          px: 2,
          width: 'fit-content',
        }}
      >
        <Icon icon={getOption(status).icon} />

        <Icon
          icon='tabler:brackets-angle'
          style={{ transform: 'rotate(90deg)' }}
        />
      </Box>

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

export default ProductStatusPicker
