import { ReactNode, useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ControlledInput from 'src/components/global/ControlledInput'
import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import { forgotPassword } from 'src/services/account/auth.service'
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
  email: yup
    .string()
    .matches(EmailRegex, emailInvalidErr())
    .required(requiredMsg('Email')),
})

interface FormData {
  email: string
}

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    forgotPassword({ email: data.email.toLowerCase() })
      .then(() => {
        toast.success('Email sent to ' + data.email)
        setValue('email', '')
      })
      .catch(() => toast.error('An error occured'))
      .finally(() => setIsLoading(false))
  }

  return (
    <AuthFormContainer
      title='Forgot Password? 🔒'
      subtitle="Enter your email, and we'll send you instructions to reset your password"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledInput
          inputType='email'
          name='email'
          control={control}
          label='Email'
          error={errors.email}
          placeholder='john.doe@gmail.com'
        />
        <Button
          fullWidth
          type='submit'
          disabled={isLoading}
          variant='contained'
          sx={{ my: 4 }}
        >
          Send reset link
        </Button>
      </form>
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

ForgotPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

ForgotPassword.guestGuard = true

export default ForgotPassword
