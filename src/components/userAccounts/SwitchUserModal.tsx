import {
  Avatar,
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import AppModal from '../global/AppModal'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { closeSwitchUserModal } from 'src/store/reducers/appSlice'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useAuth } from 'src/hooks/useAuth'
import { requiredMsg } from 'src/utils/formUtils'
import ControlledInput from '../global/ControlledInput'

const SwitchUserModal = () => {
  const { user } = useAuth()
  const { primaryFilled } = UseBgColor()
  const dispatch = useAppDispatch()

  const [userSelected, setUserSelected] = useState<
    null | any
  >(null)

  const { switchUserModal } = useAppSelector(
    state => state.app,
  )

  const users = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'admin@vuexy.com',
      role: 'Admin',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@gmail.com',
      role: 'Admin',
    },
    {
      id: 3,
      first_name: 'Josh',
      last_name: 'Doe',
      email: 'josh@gmail.com',
      role: 'Admin',
    },
  ]

  const schema = yup.object().shape({
    pin_code: yup.string().required(requiredMsg('Pin')),
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pin_code: string }>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = (values: { pin_code: string }) => {
    console.log(values)
    toast.success('TODO: switch user')
    dispatch(closeSwitchUserModal())
  }

  return (
    <AppModal
      open={switchUserModal}
      handleClose={() => dispatch(closeSwitchUserModal())}
      maxWidth={500}
    >
      <Box sx={{ p: 4 }}>
        <Typography
          id='modal-title'
          variant='h4'
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 3,
          }}
        >
          Switch User
        </Typography>

        {user &&
          (!userSelected ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {users.map(_user => (
                <Card
                  key={_user.id}
                  sx={{
                    background:
                      _user.id === user.id
                        ? primaryFilled.backgroundColor
                        : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 1,
                    p: 2,
                    gap: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => setUserSelected(_user)}
                >
                  <Avatar
                    src={'/images/avatars/person1.png'}
                    alt={_user.first_name}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color:
                          _user.id === user.id
                            ? '#fff'
                            : '#2e2e2e',
                      }}
                    >
                      {_user.first_name +
                        ' ' +
                        _user.last_name}
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color:
                          _user.id === user.id
                            ? '#fff'
                            : '#2e2e2e',
                      }}
                    >
                      {_user.role}
                    </Typography>
                  </Box>
                </Card>
              ))}
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
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 1,
                    p: 2,
                    gap: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => setUserSelected(null)}
                >
                  <Avatar
                    src={'/images/avatars/person1.png'}
                    alt={userSelected.first_name}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color:
                          userSelected.id === user.id
                            ? '#fff'
                            : '#2e2e2e',
                      }}
                    >
                      {userSelected.first_name +
                        ' ' +
                        userSelected.last_name}
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color:
                          userSelected.id === user.id
                            ? '#fff'
                            : '#2e2e2e',
                      }}
                    >
                      {userSelected.role}
                    </Typography>
                  </Box>
                </Card>

                <ControlledInput
                  name='pin_code'
                  control={control}
                  label='Pin Code'
                  error={errors.pin_code}
                  placeholder='*******'
                  inputType='pinCode'
                  maxLength={6}
                />

                <Button variant='contained' type='submit'>
                  Sign In
                </Button>
              </Box>
            </form>
          ))}
      </Box>
    </AppModal>
  )
}

export default SwitchUserModal
