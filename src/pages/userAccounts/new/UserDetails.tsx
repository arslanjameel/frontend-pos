import { Box, Button } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import UserInfo from 'src/components/userAccounts/UserInfo'
import { useAppDispatch } from 'src/store/hooks'
import { createUserStep1 } from 'src/store/reducers/userAccountsSlice'

interface Props {
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  prevStep: () => void
}

const UserDetails = ({
  isLastStep,
  nextStep,
  prevStep,
}: Props) => {
  const dispatch = useAppDispatch()

  return (
    <Box>
      <UserInfo
        onSubmit={values => {
          dispatch(createUserStep1(values))
          nextStep()
        }}
        actionBtns={
          <Box
            sx={{
              pt: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant='contained'
              startIcon={<Icon icon='tabler:arrow-left' />}
              onClick={prevStep}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              endIcon={<Icon icon='tabler:arrow-right' />}
              disabled={isLastStep}
            >
              Next
            </Button>
          </Box>
        }
      />
    </Box>
  )
}

export default UserDetails
