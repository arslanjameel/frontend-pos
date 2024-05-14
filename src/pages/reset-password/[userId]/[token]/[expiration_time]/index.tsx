import { ReactNode, useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ControlledInput from 'src/components/global/ControlledInput'
import {
  passwordMinErr,
  requiredMsg,
} from 'src/utils/formUtils'
import FallbackSpinner from 'src/@core/components/spinner'
import { resetPassword } from 'src/services/account/auth.service'
import AuthFormContainer from 'src/components/global/AuthFormContainer'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}))

const schema = yup.object().shape({
  new_password: yup
    .string()
    .min(8, passwordMinErr())
    .required(requiredMsg('Passoword')),
  verifyPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf(
      [yup.ref('new_password'), ''],
      'Passwords must match',
    ),
})

interface FormData {
  new_password: string
  verifyPassword: string
}

const ResetPassword = () => {
  const router = useRouter()
  const queryParams = router.query

  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = (values: FormData) => {
    if (queryParams) {
      resetPassword(
        {
          userId: queryParams.userId?.toString() || '',
          token: queryParams.token?.toString() || '',
          expiration_time:
            queryParams.expiration_time?.toString() || '',
        },
        { new_password: values.new_password },
      )
        .then(() => {
          toast.success('Password updated successfully')
          router.replace('/login')
        })
        .catch(err =>
          toast.error(
            err?.response?.data?.message ||
              'An error occured',
          ),
        )
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <AuthFormContainer
      title='Reset Password? 🔒'
      subtitle={''}
    >
      {!queryParams ? (
        <FallbackSpinner brief />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlledInput
            autoComplete='new-password'
            name='new_password'
            control={control}
            label='Password'
            error={errors.new_password}
            placeholder='******'
            inputType='password'
          />
          <Box sx={{ my: 4 }}></Box>
          <ControlledInput
            autoComplete='new-password'
            name='verifyPassword'
            control={control}
            label='Verify Password'
            error={errors.verifyPassword}
            placeholder='******'
            inputType='password'
          />

          <Button
            fullWidth
            type='submit'
            disabled={isLoading}
            variant='contained'
            sx={{ my: 4 }}
          >
            Set New Password
          </Button>
        </form>
      )}

      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': { mr: 1 },
        }}
      >
        <LinkStyled href='/login'>
          <Icon
            fontSize='1.25rem'
            icon='tabler:chevron-left'
          />
          <span>Back to login</span>
        </LinkStyled>
      </Typography>
    </AuthFormContainer>
  )
}

ResetPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

ResetPassword.guestGuard = true

export default ResetPassword
