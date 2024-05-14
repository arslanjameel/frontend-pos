import React from 'react'
import { Box, Button } from '@mui/material'
import toast from 'react-hot-toast'

import AppModal from '../global/AppModal'
import WeekWorkHours from './WeekWorkHours'
import IWorkingHr from 'src/models/shared/IWorkingHr'
import {
  useGetSingleUserQuery,
  useGetUserStoresQuery,
  useUpdateUserPartialMutation,
} from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'

interface Props {
  userId: number
  open: boolean
  handleClose: () => void
}

const UpdateWeekWorkHoursModal = ({
  userId,
  open,
  handleClose,
}: Props) => {
  const { data: userData, isLoading } =
    useGetSingleUserQuery(userId)
  const [
    updateUserPartial,
    { isLoading: isUpdateLoading },
  ] = useUpdateUserPartialMutation()
  const { data: userStores } = useGetUserStoresQuery(userId)

  const updateWeekWorkHours = (
    weekHrsInfo: IWorkingHr[],
  ) => {
    updateUserPartial({
      id: userId,
      body: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        working_hours: weekHrsInfo.map(
          ({  ...obj }) => obj,
        ),
        stores: (userStores?.results || []).map(
          (_store: any) => _store.id,
        ),
      },
    })
      .unwrap()
      .then(() =>
        toast.success('User details updated successfully'),
      )
      .catch(() => toast.error('An error occured'))
      .finally(() => handleClose())
  }

  if (isLoading) return <FallbackSpinner brief />

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={700}
    >
      <WeekWorkHours
        useForm
        weekHoursData={userData?.working_hours || []}
        onUpdate={updateWeekWorkHours}
        actionBtns={
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
              variant='outlined'
              color='primary'
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={isUpdateLoading}
            >
              Save
            </Button>
          </Box>
        }
      />
    </AppModal>
  )
}

export default UpdateWeekWorkHoursModal
