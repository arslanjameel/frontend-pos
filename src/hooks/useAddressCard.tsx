import { Box, Typography } from '@mui/material'

import AddressCard from 'src/components/invoices/AddressCard'
import { IAddress } from 'src/models/IAddress'
import useGetCountryName from './useGetCountryName'
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
} from 'src/store/apis/accountSlice'
import { addressPlaceholder } from 'src/utils/placeholders'
import useGetCityName from './useGetCityName'

interface Props {
  addressType: 'invoice' | 'delivery'
  address?: IAddress
  disabled: boolean
  onButtonClick: () => void
  textBoxValue?: string
  onTextBoxChange: (val: string) => void
}

const useAddressCard = () => {
  const addressTypeInfo = {
    invoice: {
      title: 'Invoices To',
      icon: 'tabler:user',
      buttonIcon: 'tabler:map',
    },
    delivery: {
      title: 'Deliver To',
      icon: 'tabler:user',
      buttonIcon: 'tabler:truck-delivery',
    },
  }

  const { data: countries } = useGetCountriesQuery()
  const { data: cities } = useGetCitiesQuery()
  const { getCity } = useGetCityName(cities ? cities : [])
  const { getCountry } = useGetCountryName(
    countries ? countries : [],
  )

  const AddressCardComponent = ({
    address,
    addressType,
    textBoxValue,
    onTextBoxChange,
    disabled,
    onButtonClick,
  }: Props) => {
    return (
      <AddressCard
        {...addressTypeInfo[addressType]}
        onButtonClick={onButtonClick}
        value={address ? address.addressLine1 : ''}
        renderValue={
          address ? (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
              }}
            >
              <Typography>
                {address.addressLine1 || addressPlaceholder}
              </Typography>
              <Typography>{address.postCode}</Typography>
              <Typography>
                {getCity(address.city)}
              </Typography>
              <Typography>
                {getCountry(address.country)}
              </Typography>
            </Box>
          ) : (
            <Typography>{addressPlaceholder}</Typography>
          )
        }
        isView={disabled}
        textBoxValue={textBoxValue}
        onTextBoxChange={onTextBoxChange}
      />
    )
  }

  return { AddressCardComponent }
}

export default useAddressCard
