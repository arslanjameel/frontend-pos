import {
  Box,
  Card,
  Typography,
  Grid,
  List,
  ListItem,
  Button,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import ControlledInput from 'src/components/global/ControlledInput'
import {
  passwordMinErr,
  requiredMsg,
} from 'src/utils/formUtils'
import { useUpdatePasswordPinCodeMutation } from 'src/store/apis/accountSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'

const SecurityTab = () => {
  const [updatePasswordPin] =
    useUpdatePasswordPinCodeMutation()

  interface FormData {
    old_password: string
    new_password: string
    verify_new_password: string
    new_pin_code: string
    verify_new_pin_code: string
  }

  const defaultValues = {
    old_password: '',
    new_password: '',
    verify_new_password: '',
    new_pin_code: '',
    verify_new_pin_code: '',
  }

  const schema = yup.object().shape({
    old_password: yup
      .string()
      .required(requiredMsg('Current Password')),
    new_password: yup
      .string()
      .min(8, passwordMinErr())
      .required(requiredMsg('New Password')),
    verify_new_password: yup
      .string()
      .required('Please confirm your password')
      .oneOf(
        [yup.ref('new_password'), ''],
        'Passwords must match',
      ),
    new_pin_code: yup
      .string()
      .min(6, 'Pin must have at least 6 characters')
      .required(requiredMsg('Pin Code')),
    verify_new_pin_code: yup
      .string()
      .required('Please confirm your Pin Code')
      .oneOf(
        [yup.ref('new_pin_code'), ''],
        'Codes must match',
      ),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = ({
    new_pin_code,
    old_password,
    new_password,
  }: FormData) => {
    updatePasswordPin({
      new_password,
      new_pin_code,
      old_password,
    })
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res)) {
          toast.error(extractErrorMessage(res))
        } else {
          toast.success('Password updated successfully')
          reset()
        }
      })
      .catch((error: any) =>
        toast.error(extractErrorMessage(error)),
      )
  }

  return (
    <Card sx={{ p: 4 }}>
      <Typography
        sx={{ fontWeight: 600, fontSize: 17, mb: 4 }}
      >
        Profile Details
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columns={12} spacing={4}>
          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='old_password'
              control={control}
              label='Current Password'
              error={errors.old_password}
              placeholder='******'
              inputType='password'
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}></Grid>

          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='new_password'
              control={control}
              label='New Password'
              error={errors.new_password}
              placeholder='******'
              inputType='password'
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='verify_new_password'
              control={control}
              label='Confirm New Password'
              error={errors.verify_new_password}
              placeholder='******'
              inputType='password'
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='new_pin_code'
              control={control}
              label='New Pin'
              error={errors.new_pin_code}
              placeholder='******'
              inputType='pinCode'
              maxLength={6}
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <ControlledInput
              name='verify_new_pin_code'
              control={control}
              label='Confirm New Pin'
              error={errors.verify_new_pin_code}
              placeholder='******'
              inputType='pinCode'
              maxLength={6}
            />
          </Grid>
        </Grid>

        <Grid container columns={12} spacing={4}>
          <Grid item md={6} sm={12} xs={12}>
            <Box sx={{ mt: 5 }}>
              <Typography sx={{ fontWeight: 600 }}>
                Password Requirements
              </Typography>
              <List
                sx={{
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                }}
              >
                <ListItem sx={{ display: 'list-item' }}>
                  Minimum 8 characters long - the more, the
                  better
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  At least one lowercase character
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  At least one number, symbol, or whitespace
                  character
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Box sx={{ mt: 5 }}>
              <Typography sx={{ fontWeight: 600 }}>
                Pin Requirements
              </Typography>
              <List
                sx={{
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                }}
              >
                <ListItem sx={{ display: 'list-item' }}>
                  Minimum 6 characters long
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                  Only numbers
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' type='submit'>
            Save Changes
          </Button>
          <Button variant='contained' color='secondary'>
            Cancel
          </Button>
        </Box>
      </form>
    </Card>
  )
}

export default SecurityTab
