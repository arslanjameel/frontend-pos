import {
  Box,
  Typography,
  Card,
  Button,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import CustomerFormInputs from 'src/components/customers/CustomerFormInputs'
import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'

// import UserInfoCard from 'src/components/userAccounts/UserInfoCard'
import { useModal } from 'src/hooks/useModal'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import AddressesList from 'src/components/customers/AddressesList'
import {
  useDeleteCustomerMutation,
  useGetSingleCustomerAddressesQuery,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from 'src/store/apis/customersSlice'
import { IPriceBand } from 'src/models/ICustomer'
import { formatTo2dp } from 'src/utils/dataUtils'

interface FormData {
  accountName: string
  email: string
  firstName: string
  lastName: string
  primaryPhone: string
  secondPhone: string
  priceBand: IPriceBand
  creditLimit: string
}

const _defaultValues: FormData = {
  accountName: '',
  email: '',
  firstName: '',
  lastName: '',
  primaryPhone: '',
  secondPhone: '',
  priceBand: 'Band_C',
  creditLimit: '0',
}

interface Props {
  customerId: number
}

const CustomerOverviewTab = ({ customerId }: Props) => {
  const router = useRouter()

  const { data: customerData } =
    useGetSingleCustomerQuery(customerId)
  const { data: addresses } =
    useGetSingleCustomerAddressesQuery(customerId)

  const [deleteCustomer] = useDeleteCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const schema = yup.object().shape({
    accountName: yup
      .string()
      .required(requiredMsg('Account Name')),
    email: yup
      .string()
      .matches(EmailRegex, emailInvalidErr())
      .required(requiredMsg('Email')),
    firstName: yup
      .string()
      .required(requiredMsg('First Name')),
    lastName: yup
      .string()
      .required(requiredMsg('Last Name')),
    primaryPhone: yup
      .string()
      .min(11, 'Minimum of 11 numbers required')
      .required(requiredMsg('Primary Phone')),
    priceBand: yup
      .string()
      .required(requiredMsg('Price Band')),
    creditLimit: yup
      .string()
      .required(requiredMsg('Credit Limit')),
  })

  const onSubmit = (values: FormData) => {
    // toast.success('Customer updated successfully')
    // console.log(values)

    updateCustomer({ id: customerId, body: { ...values } })
      .unwrap()
      .then(() => {
        toast.success('Customer updated successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  const _deleteCustomer = () => {
    if (deleteModal) {
      deleteCustomer(deleteModal)
        .unwrap()
        .then(() => {
          toast.success('Customer deleted successfully')
          router.push('/customers')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  const _defaults = customerData
    ? {
        accountName: customerData.accountName,
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        primaryPhone: customerData.primaryPhone,
        secondPhone: customerData.secondPhone,
        priceBand: customerData.priceBand,
        creditLimit: formatTo2dp(customerData.creditLimit),
        createdBy: customerData.createdBy,
      }
    : {}

  const {
    control,

    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    values: { ..._defaultValues, ..._defaults },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Box
              sx={{
                p: 4,
                px: 6,
                borderBottom: '1.5px solid #b6b6b650',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  // mb: 3,
                }}
              >
                <Typography
                  variant='h5'

                  //  sx={{ mb: 2 }}
                >
                  Customer Details
                </Typography>
                <Button
                  variant='tonal'
                  color='error'
                  onClick={() =>
                    openDeleteModal(customerId)
                  }
                >
                  Delete Customer
                </Button>
              </Box>

              {/* <UserInfoCard
                legacy
                primaryBtnText='Upload new photo'
              /> */}
            </Box>
            <CustomerFormInputs
              control={control}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              watch={watch}
            />

            <Box
              sx={{ p: 4, pt: 0, display: 'flex', gap: 4 }}
            >
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='tonal' color='secondary'>
                Cancel
              </Button>
            </Box>
          </Card>
        </form>

        <AddressesList
          addressesData={addresses ? addresses.results : []}
          customerId={customerId}
        />
      </Box>

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        title='Delete Customer'
        content='Are you sure you want to delete this customer?'
        confirmTitle='Delete'
        confirmColor='error'
        onConfirm={_deleteCustomer}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

export default CustomerOverviewTab
