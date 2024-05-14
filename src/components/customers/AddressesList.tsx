import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import Accordion from '../Accordion'
import CustomTag from '../global/CustomTag'
import useClipboard from 'src/@core/hooks/useClipboard'
import AddressModal from './AddressModal'
import { useModal } from 'src/hooks/useModal'
import { IAddress, IAddressNew } from 'src/models/IAddress'
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
} from 'src/store/apis/accountSlice'
import useGetCountryName from 'src/hooks/useGetCountryName'
import useGetCityName from 'src/hooks/useGetCityName'
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from 'src/store/apis/customersSlice'
import { sortAddressesByDate } from 'src/utils/addressUtils'

interface Props {
  addressesData: IAddress[]
  customerId?: number
}

const AddressesList = ({
  addressesData,
  customerId,
}: Props) => {
  const { data: countries } = useGetCountriesQuery()
  const { data: cities } = useGetCitiesQuery()
  const { getCountry } = useGetCountryName(
    countries ? countries : [],
  )
  const { getCity } = useGetCityName(cities ? cities : [])

  const [createAddress] = useCreateAddressMutation()
  const [updateAddress] = useUpdateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()

  const getFullAddress = (address: IAddress) => {
    return `${address.addressLine1} ${getCountry(
      address.country,
    )}, ${address.postCode}`
  }

  const [expanded, setExpanded] = useState(0)
  const handleChange =
    (panel: number) =>
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : -1)
    }

  const {
    modalData: addressToEdit,
    openModal: openEditAddressModal,
    closeModal: closeEditAddressModal,
    isModalOpen: editAddressModalStatus,
  } = useModal<IAddress>()

  const {
    openModal: openNewAddressModal,
    closeModal: closeNewAddressModal,
    isModalOpen: newAddressModalStatus,
  } = useModal<null>()

  const createNewAddress = (
    values: IAddressNew,
    reset?: () => void,
  ) => {
    createAddress({ ...values, customer: customerId })
      .unwrap()
      .then(() => {
        toast.success('Address added successfully')
        closeNewAddressModal()
        reset && reset()
      })
      .catch(() => toast.error('An error occured'))
  }

  const handleAddressUpdate = (
    values: IAddress,
    reset?: () => void,
  ) => {
    updateAddress({
      id: values.id,
      body: { ...values, customer: customerId },
    })
      .unwrap()
      .then(() => {
        toast.success('Address updated successfully')
        closeEditAddressModal()
        reset && reset()
      })
      .catch(() => toast.error('An error occured'))
  }

  const _deleteAddress = (id: number) => {
    deleteAddress(id)
      .unwrap()
      .then(() => {
        toast.success('Address deleted successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  const copyAddress = useClipboard()

  return (
    <>
      <Card sx={{ pt: 4 }}>
        <Box
          sx={{
            px: 4,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant='h5' fontWeight={600}>
            Addresses
          </Typography>

          <Button
            variant='tonal'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => openNewAddressModal(null)}
          >
            Add new address
          </Button>
        </Box>

        <Box
          sx={{ mt: 4, borderTop: '2px solid #d5d5d5aa' }}
        >
          {addressesData.length === 0 && (
            <Typography sx={{ fontStyle: 'italic', p: 4 }}>
              No Addresses Added
            </Typography>
          )}

          {sortAddressesByDate(addressesData)
            .filter(address => !address.deleted)
            .map((address, i) => (
              <Accordion.Accordion
                key={i}
                sx={{
                  borderTop:
                    i !== 0 ? '2px dashed #d5d5d5aa' : '',
                }}
                expanded={expanded === i}
                onChange={handleChange(i)}
              >
                <Accordion.AccordionSummaryOpposite>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: '600 !important',
                        }}
                      >
                        {address.addressNickName}
                      </Typography>
                      {address.defaultShipping && (
                        <CustomTag
                          label='Default Shipping'
                          size='small'
                        />
                      )}
                      {address.defaultBilling && (
                        <CustomTag
                          label='Default Billing'
                          size='small'
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IconButton
                        color='primary'
                        onClick={e => {
                          e.stopPropagation()
                          openEditAddressModal(address)
                        }}
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={e => {
                          e.stopPropagation()
                          _deleteAddress(address.id)
                        }}
                      >
                        <Icon icon='tabler:trash' />
                      </IconButton>
                    </Box>
                  </Box>
                </Accordion.AccordionSummaryOpposite>
                <Accordion.AccordionDetails>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 5,
                      pl: 9.3,
                    }}
                  >
                    <Box sx={{ minWidth: 160, flex: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant='h6'
                          fontWeight={600}
                        >
                          Full Address
                        </Typography>
                        <IconButton
                          color='primary'
                          size='small'
                          onClick={() => {
                            copyAddress.copy(
                              getFullAddress(address),
                            )
                            toast.success('Address copied')
                          }}
                        >
                          <Icon icon='tabler:copy' />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 500,
                          letterSpacing: 0,
                          color: '#959495da',
                        }}
                      >
                        {getFullAddress(address)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        minWidth: 140,
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                      }}
                    >
                      <Box>
                        <Typography
                          variant='h6'
                          fontWeight={600}
                        >
                          Address Line
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            letterSpacing: 0,
                            color: '#959495da',
                          }}
                        >
                          {address.addressLine1}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant='h6'
                          fontWeight={600}
                        >
                          Post Code
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            letterSpacing: 0,
                            color: '#959495da',
                          }}
                        >
                          {address.postCode}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        minWidth: 100,
                        width: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        flex: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant='h6'
                          fontWeight={600}
                        >
                          City
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            letterSpacing: 0,
                            color: '#959495da',
                          }}
                        >
                          {getCity(address.city)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant='h6'
                          fontWeight={600}
                        >
                          Country
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            letterSpacing: 0,
                            color: '#959495da',
                          }}
                        >
                          {getCountry(address.country)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Accordion.AccordionDetails>
              </Accordion.Accordion>
            ))}
        </Box>
      </Card>

      <AddressModal
        open={newAddressModalStatus()}
        handleClose={closeNewAddressModal}
        onSubmit={createNewAddress}
      />

      <AddressModal
        open={editAddressModalStatus()}
        handleClose={closeEditAddressModal}
        onSubmit={(values, reset) => {
          if (addressToEdit) {
            handleAddressUpdate(
              {
                ...values,
                id: addressToEdit.id,
                createdAt: addressToEdit.createdAt,
              },
              reset,
            )
          }
        }}
        data={addressToEdit}
      />
    </>
  )
}

export default AddressesList
