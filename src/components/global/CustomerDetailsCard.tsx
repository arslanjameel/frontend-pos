import React from 'react'
import { Box, Card, Typography } from '@mui/material'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'
import CustomerMoneyCard from '../customers/CustomerMoneyCard'
import CustomTextField from 'src/@core/components/mui/text-field'
import BoxIconButton from './BoxIconButton'
import { useModal } from 'src/hooks/useModal'
import SelectCustomerModal from './Modals/SelectCustomerModal'
import { ICustomer, PriceBand } from 'src/models/ICustomer'
import { isCashCustomer } from 'src/utils/customers.util'
import { getFullName, numTo2dp } from 'src/utils/dataUtils'

interface Props {
  title?: string
  selectedCustomer: ICustomer
  setSelectedCustomer?: (newCustomer: ICustomer) => void
  referenceValue?: string
  setReferenceValue?: (newValue: string) => void
  selectBtn?: boolean
  readOnly?: boolean
  showPriceBand?: boolean
  invoiceNo?: string
  cashCustomers?: boolean
}

const CustomerDetailsCard = ({
  title = 'Customer Details',
  selectedCustomer,
  setSelectedCustomer,
  referenceValue,
  setReferenceValue,
  selectBtn = true,
  readOnly,
  showPriceBand = true,
  invoiceNo,
  cashCustomers = true,
}: Props) => {
  const {
    openModal: openSelectCustomerModal,
    closeModal: closeSelectCustomerModal,
    isModalOpen: selectCustomerModalStatus,
  } = useModal<number>()

  const availableBalence = (
    current: string,
    limit: string,
  ) => {
    const currentNum = parseFloat(current)
    const limitNum = parseFloat(limit)
    const availableNum = limitNum - currentNum

    return availableNum
  }

  // const hideUpDownArrows = {
  //   '& input[type=number]': {
  //     MozAppearance: 'textfield',
  //   },
  //   '& input[type=number]::-webkit-outer-spin-button': {
  //     WebkitAppearance: 'none',
  //     margin: 0,
  //   },
  //   '& input[type=number]::-webkit-inner-spin-button': {
  //     WebkitAppearance: 'none',
  //     margin: 0,
  //   },
  // }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          pb: 4,
          px: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            my: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Icon icon='tabler:user' />
            <Typography variant='h5' fontWeight={600}>
              {title}
            </Typography>
          </Box>

          {selectBtn && (
            <BoxIconButton
              icon='tabler:user-plus'
              onClick={() => openSelectCustomerModal(1)}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {selectedCustomer?.id === 0 ||
          !selectedCustomer ? (
            <Typography
              sx={{ fontWeight: 600 }}
              color={'primary'}
            >
              No Customer Selected
            </Typography>
          ) : !isCashCustomer(selectedCustomer) ? (
            <Link
              href={`/customers/${selectedCustomer.id}`}
            >
              <Typography
                sx={{ fontWeight: 600 }}
                color={'primary'}
              >
                {getFullName(selectedCustomer)}
              </Typography>
            </Link>
          ) : (
            <Typography sx={{ fontWeight: 600 }}>
              {getFullName(selectedCustomer)}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Icon icon='tabler:id' />
            <Typography sx={{ fontWeight: 600 }}>
              {selectedCustomer.id}
            </Typography>
          </Box>
        </Box>

        {!isCashCustomer(selectedCustomer) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <CustomerMoneyCard
              amount={availableBalence(
                selectedCustomer.currentCredit,
                selectedCustomer.creditLimit,
              )}
              label='Available'
              color='success'
              stretch
              sx={{ maxWidth: '150px !important' }}
            />

            <CustomerMoneyCard
              amount={numTo2dp(
                selectedCustomer.currentCredit,
              )}
              label='Balance'
              color={
                numTo2dp(selectedCustomer.currentCredit) >
                numTo2dp(selectedCustomer.creditLimit)
                  ? 'error'
                  : 'success'
              }
              stretch
              sx={{ maxWidth: '150px !important' }}
            />
          </Box>
        )}

        {!isCashCustomer(selectedCustomer) &&
          showPriceBand && (
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography sx={{ minWidth: 120 }}>
                Price Band
              </Typography>
              <Typography>
                {PriceBand[selectedCustomer.priceBand] ||
                  'N/A'}
              </Typography>
            </Box>
          )}

        {invoiceNo && (
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography sx={{ minWidth: 120 }}>
              Invoice No
            </Typography>
            <Typography fontWeight={600}>
              {invoiceNo}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ minWidth: 120 }}>
            Customer Ref
          </Typography>
          <CustomTextField
            InputProps={{ readOnly }}
            placeholder='Reference'
            value={referenceValue}
            onChange={e =>
              setReferenceValue &&
              setReferenceValue(e.target.value)
            }
          />
        </Box>
      </Card>

      <SelectCustomerModal
        selected={selectedCustomer}
        open={selectCustomerModalStatus()}
        handleClose={closeSelectCustomerModal}
        handleChange={customerInfo => {
          if (setSelectedCustomer) {
            setSelectedCustomer(customerInfo)
          }
        }}
        cash={cashCustomers}
      />
    </>
  )
}

export default CustomerDetailsCard
