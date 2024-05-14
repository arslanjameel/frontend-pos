// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material'
import toast from 'react-hot-toast'

import AppModal from '../global/AppModal'
import { IAddress, IData } from 'src/utils/types'
import { useModal } from 'src/hooks/useModal'
import AddressModal from '../customers/AddressModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import AddressListMini from '../global/AddressListMini'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetSingleCustomerAddressesQuery,
  useUpdateAddressMutation,
} from 'src/store/apis/customersSlice'
import { sortAddressesByDate } from 'src/utils/addressUtils'

interface Props {
  selectedAddress: number
  delivery?: number
  hideDeliverySection?: boolean
  open: boolean
  handleClose: () => void
  onSubmit: ({
    id,
    deliveryCost,
  }: {
    id: number
    deliveryCost: number
  }) => void
  customerInfo: IData
}

const SelectDeliveryAddressModal = ({
  selectedAddress,
  delivery,
  open,
  handleClose,
  onSubmit,
  customerInfo,
  hideDeliverySection,
}: Props) => {
  const { isMobileSize } = useWindowSize()

  const { data: addresses } =
    useGetSingleCustomerAddressesQuery(
      customerInfo['Customer ID'],
    )

  const [createAddress] = useCreateAddressMutation()
  const [updateAddress] = useUpdateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()

  const [addressId, setAddressId] =
    useState(selectedAddress)
  const [deliveryCost, setDeliveryCost] = useState(0)

  const {
    openModal: openNewAddressModal,
    closeModal: closeNewAddressModal,
    isModalOpen: newAddressModalStatus,
  } = useModal<null>()

  const {
    modalData: addressToEdit,
    openModal: openEditAddressModal,
    closeModal: closeEditAddressModal,
    isModalOpen: editAddressModalStatus,
  } = useModal<IAddress>()

  const createNewAddress = (
    values: IAddressNew,
    reset?: () => void,
  ) => {
    createAddress({
      ...values,
      addressType: 'shippingAddress',
      customer: customerInfo['Customer ID'],
    })
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
      body: {
        ...values,
        customer: customerInfo['Customer ID'],
      },
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

  const handleSubmit = () => {
    onSubmit({ id: addressId, deliveryCost })
    handleClose()
  }

  useEffect(() => {
    setAddressId(selectedAddress)
    setDeliveryCost(delivery || 0)
  }, [selectedAddress, delivery])

  return (
    <>
      <AppModal
        open={open}
        handleClose={handleClose}
        title='Select Delivery Address'
        maxWidth={640}
        sx={{ p: 6, px: isMobileSize ? 4 : 15 }}
      >
        <Grid
          container
          columns={12}
          spacing={4}
          sx={{ mb: 6 }}
        >
          {Object.entries(customerInfo).map((obj, i) => (
            <Grid item md={6} sm={6} xs={6} key={i}>
              <Typography
                sx={{
                  textAlign: i % 2 !== 0 ? 'right' : 'left',
                }}
              >
                {obj[0]}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: i % 2 !== 0 ? 'right' : 'left',
                }}
              >
                {obj[1]}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {!hideDeliverySection && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 6,
              mt: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Delivery Cost
            </Typography>
            <CustomTextField
              type='number'
              value={deliveryCost === 0 ? '' : deliveryCost}
              onChange={e =>
                setDeliveryCost(Number(e.target.value))
              }
            />
          </Box>
        )}

        <AddressListMini
          activeAddress={addressId}
          addresses={sortAddressesByDate(
            addresses
              ? addresses.results.filter(
                  addr => !addr.deleted,
                )
              : [],
          )}
          onChange={id => setAddressId(id)}
          onAddInit={() => openNewAddressModal(null)}
          onEditInit={address =>
            openEditAddressModal(address)
          }
          onDeleteInit={id => _deleteAddress(id)}
        />

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant='contained'
            onClick={handleSubmit}
          >
            Select
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </AppModal>

      <AddressModal
        open={newAddressModalStatus()}
        handleClose={closeNewAddressModal}
        onSubmit={createNewAddress}
      />

      <AddressModal
        open={editAddressModalStatus()}
        handleClose={closeEditAddressModal}
        onSubmit={handleAddressUpdate}
        data={addressToEdit}
      />
    </>
  )
}

export default SelectDeliveryAddressModal
