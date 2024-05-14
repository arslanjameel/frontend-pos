import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import AppModal from '../AppModal'
import { requiredMsg } from 'src/utils/formUtils'
import ControlledInput from '../ControlledInput'
import { getFullName } from 'src/utils/dataUtils'
import { useAppSelector } from 'src/store/hooks'
import UserCard from '../UserCard'
import {
  useGetStoreManagersQuery,
  useValidateManagerPinMutation,
} from 'src/store/apis/accountSlice'
import { IStoreManager } from 'src/models/IUser'
import {
  extractErrorMessage,
  hasErrorStatus,
} from 'src/utils/apiUtils'

const NO_STORE_ID = 0

interface Props {
  open: boolean
  handleClose: () => void
  onApprove: () => void
}

const ManagerApprovalModal = ({
  open,
  handleClose,
  onApprove,
}: Props) => {
  const { selectedStore } = useAppSelector(
    state => state.app,
  )

  const { data: managersList } = useGetStoreManagersQuery(
    selectedStore || NO_STORE_ID,
  )

  const [validatePin, { isLoading: isValidatingPin }] =
    useValidateManagerPinMutation()

  const [isManagerSelected, setIsManagerSelected] =
    useState(false)
  const [selectedManager, setSelectedManager] =
    useState<IStoreManager | null>(null)

  const schema = yup.object().shape({
    pin_code: yup.string().required(requiredMsg('Pin')),
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ pin_code: string }>({
    values: { pin_code: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = (values: { pin_code: string }) => {
    if (selectedManager) {
      validatePin({
        manager_id: selectedManager.id,
        pin_code: values.pin_code,
      })
        .unwrap()
        .then((res: any) => {
          if (hasErrorStatus(res)) {
            toast.error(extractErrorMessage(res))
          } else {
            onApprove()
            handleClose()
            toast.success('Pin validated successfully')
            reset()
          }
        })
        .catch((e: any) => {
          toast.error(extractErrorMessage(e))
        })
    }
  }

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={500}
      title='Manager Approval'
      subTitle='Select a manager for this request'
    >
      {!isManagerSelected || !selectedManager ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {(managersList ? managersList : []).map(
            (_user: any) => (
              <UserCard
                key={_user.id}
                onClick={() => {
                  setSelectedManager(_user)
                  setIsManagerSelected(true)
                }}
                img='/images/avatars/person1.png'
                name={getFullName(_user)}
                active={_user.id === selectedManager?.id}
              />
            ),
          )}

          {(managersList ? managersList : []).length ===
            0 && (
            <Typography
              sx={{
                fontStyle: 'italic',
                textAlign: 'center',
                mt: 4,
                fontSize: 20,
              }}
            >
              No Managers Found
            </Typography>
          )}
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <UserCard
              img='/images/avatars/person1.png'
              name={getFullName(selectedManager)}
              active
              onClick={() => {
                setIsManagerSelected(false)
              }}
            />

            <ControlledInput
              name='pin_code'
              control={control}
              label='Pin Code'
              error={errors.pin_code}
              placeholder='*******'
              inputType='pinCode'
              maxLength={6}
            />

            <Button
              variant='contained'
              type='submit'
              disabled={isValidatingPin}
            >
              Approve
            </Button>
          </Box>
        </form>
      )}
    </AppModal>
  )
}

export default ManagerApprovalModal
