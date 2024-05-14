import {
  Box,
  Card,
  IconButton,
  SxProps,
  Typography,
} from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'

import useClipboard from 'src/@core/hooks/useClipboard'
import Icon from 'src/@core/components/icon'
import BoxIconButton from '../global/BoxIconButton'
import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  value: string
  isView?: boolean
  title: string
  icon?: string
  buttonIcon?: string
  onButtonClick?: () => void
  sx?: SxProps
  renderValue?: React.ReactNode
  placeholder?: string

  textBoxValue?: string
  onTextBoxChange?: (val: string) => void
  hasPickerBtn?: boolean

  isDelivery?: boolean
  deliveryCost?: number
  updateDeliveryCost?: (val: number) => void
}

const AddressCard = ({
  value,
  isView,
  title,
  icon,
  buttonIcon,
  onButtonClick,
  sx,

  // renderValue,
  // textBoxValue = '',
  placeholder = 'Select Address',
  onTextBoxChange,
  hasPickerBtn = true,

  isDelivery,
  deliveryCost,
  updateDeliveryCost,
}: Props) => {
  const copyToClipboard = useClipboard()

  // const { getCity } = useGetCityName()
  // const { getCountry } = useGetCountryName()

  // const { data: address, isError } =
  //   useGetSingleAddressQuery(Number(value) || -1)

  const copyAddress = () => {
    copyToClipboard.copy(value)
    toast.success('Address copied to clipboard')

    // if (address) {
    //   const values = [
    //     address.addressLine1,

    //     address.postCode,

    //     getCity(address?.city),

    //     getCountry(address?.country),
    //   ]
    // } else {
    //   if (isError) {
    //     copyToClipboard.copy(value)
    //     toast.success('Address copied to clipboard')
    //   } else {
    //     toast.error('Address data loading')
    //   }
    // }
  }

  return (
    <Card
      sx={{
        pb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1.3px solid #dcdcdc',
          px: 5,
          height: 50,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {icon && <Icon icon={icon} />}
          <Typography
            variant={icon ? 'h5' : 'h6'}
            fontWeight={600}
            sx={{ wordBreak: 'break-word' }}
          >
            {title}
          </Typography>
        </Box>

        {hasPickerBtn &&
          (buttonIcon && onButtonClick ? (
            <BoxIconButton
              icon={buttonIcon}
              onClick={onButtonClick}
            />
          ) : (
            <IconButton
              color='primary'
              size='small'
              onClick={() => {
                copyAddress()
              }}
            >
              <Icon icon='tabler:copy' />
            </IconButton>
          ))}
      </Box>

      <Box sx={{ px: 5, pb: 3 }}>
        {!isView ? (
          <Box>
            <CustomTextField
              multiline
              minRows={6}
              fullWidth
              value={value}
              placeholder={placeholder}
              onChange={(e: any) =>
                onTextBoxChange &&
                onTextBoxChange(e.target.value)
              }
            />
            {isDelivery && (
              <Box
                sx={{
                  mt: 5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography width={180}>
                  Delivery Cost:
                </Typography>
                <CustomTextField
                  fullWidth
                  type='number'
                  placeholder='Cost'
                  value={deliveryCost}
                  onChange={e =>
                    updateDeliveryCost &&
                    updateDeliveryCost(
                      Number(e.target.value),
                    )
                  }
                />
              </Box>
            )}
          </Box>
        ) : (
          <Typography sx={{ color: '#787878' }}>
            {value ? (
              (value || '')
                .split('\n')
                .map(val => (
                  <Typography key={val}>{val}</Typography>
                ))
            ) : (
              <Typography fontStyle='italic'>
                No Address Selected
              </Typography>
            )}
            {}
          </Typography>
        )}
      </Box>
    </Card>
  )
}

export default AddressCard
