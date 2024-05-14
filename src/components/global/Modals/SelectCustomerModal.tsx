import { Avatar, Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import AppModal from '../AppModal'
import TableSearchInput from '../TableSearchInput'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { getInitials } from 'src/@core/utils/get-initials'
import { useSearchCustomersQuery } from 'src/store/apis/customersSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import { getFullName } from 'src/utils/dataUtils'
import {
  bringCashCustomerToFront,
  isCashCustomer,
  removeCashCustomer,
} from 'src/utils/customers.util'
import { useAppSelector } from 'src/store/hooks'
import { isStoreB2B } from 'src/utils/storeUtils'

interface Props {
  selected: any
  open: boolean
  handleClose: () => void
  handleChange: (customerInfo: any) => void
  cash?: boolean
}

const SelectCustomerModal = ({
  selected,
  open,
  handleClose,
  handleChange,
  cash = true,
}: Props) => {
  const { store } = useAppSelector(state => state.app)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: searchedCustomers,
    isLoading,
    isFetching,
  } = useSearchCustomersQuery(searchTerm)

  const { primaryFilled } = UseBgColor()

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      title='Select Customer'
      subTitle='Select a customer for this transaction'
      maxWidth={500}
      sx={{ p: 6 }}
    >
      <TableSearchInput
        placeholder='Customer Name'
        value={searchTerm}
        onChange={val => setSearchTerm(val)}
      />
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxHeight: 280,
          overflow: 'auto',
        }}
      >
        {isLoading || isFetching ? (
          <FallbackSpinner brief />
        ) : (
          (isStoreB2B(store)
            ? removeCashCustomer(
                searchedCustomers?.results || [],
              )
            : !cash
            ? searchedCustomers
              ? removeCashCustomer(
                  searchedCustomers.results,
                )
              : []
            : bringCashCustomerToFront(
                searchedCustomers
                  ? searchedCustomers.results
                  : [],
              )
          ).map((customer: any) => (
            <Box
              key={customer.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                background:
                  customer.id === selected.id
                    ? primaryFilled.backgroundColor
                    : 'transparent',
                gap: 2,
                p: 2,
                py: 1,
                borderRadius: 2,
              }}
              onClick={() => {
                handleChange(customer)
                handleClose()
              }}
            >
              <Avatar
                src={
                  customer.image !== null ||
                  isCashCustomer(customer)
                    ? customer.image
                    : 'add-img-link'
                }
                alt={getFullName(customer)}
              >
                {getInitials(getFullName(customer))}
              </Avatar>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  spacing: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color:
                      customer.id === selected.id
                        ? primaryFilled.color
                        : 'inherit',
                  }}
                >
                  {getFullName(customer)}
                </Typography>

                {!isCashCustomer(customer) && (
                  <Typography
                    sx={{
                      color:
                        customer.id === selected.id
                          ? primaryFilled.color
                          : 'inherit',
                    }}
                  >
                    {customer.email}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </AppModal>
  )
}

export default SelectCustomerModal
