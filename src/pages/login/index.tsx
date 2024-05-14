// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiFormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import {
  EmailRegex,
  emailInvalidErr,
  requiredMsg,
} from 'src/utils/formUtils'
import ControlledInput from 'src/components/global/ControlledInput'
import AuthFormContainer from 'src/components/global/AuthFormContainer'
import { extractErrorMessage } from 'src/utils/apiUtils'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
}))

const FormControlLabel = styled(
  MuiFormControlLabel,
)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary,
  },
}))

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(EmailRegex, emailInvalidErr())
    .required(requiredMsg('Email')),
  password: yup.string().required(requiredMsg('Password')),
})

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [formError, setFormError] = useState('')
  const [rememberMe, setRememberMe] =
    useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { email: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const { email, password } = data

    auth.login(
      { email: email.toLowerCase(), password, rememberMe },
      (err: any) => {
        const errMsg = extractErrorMessage(err)

        setFormError(errMsg)
      },
    )
  }

  return (
    <AuthFormContainer
      title={`Welcome to ${themeConfig.templateName}! 👋`}
      subtitle='Please sign in to your account'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {formError && (
          <Typography
            color='error'
            marginBottom={6}
            textAlign='center'
          >
            {formError}
          </Typography>
        )}

        <Box sx={{ mb: 4 }}>
          <ControlledInput
            autoComplete='email'
            inputType='email'
            name='email'
            control={control}
            label='Email'
            error={errors.email}
            placeholder='john.doe@gmail.com'
          />
        </Box>

        <Box sx={{ mb: 1.5 }}>
          <ControlledInput
            autoComplete='current-password'
            name='password'
            control={control}
            label='Password'
            error={errors.password}
            placeholder='*******'
            inputType='password'
          />
        </Box>
        <Box
          sx={{
            mb: 1.75,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <FormControlLabel
            label='Remember Me'
            control={
              <Checkbox
                checked={rememberMe}
                onChange={e =>
                  setRememberMe(e.target.checked)
                }
              />
            }
          />
          <Typography
            component={LinkStyled}
            href='/forgot-password'
          >
            Forgot Password?
          </Typography>
        </Box>
        <Button
          fullWidth
          type='submit'
          variant='contained'
          sx={{ mb: 4 }}
        >
          Sign in
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{ color: 'text.secondary', mr: 2 }}
          >
            Don't have a login?
          </Typography>
          <Typography
            href='/register'
            component={LinkStyled}
          >
            Request an account
          </Typography>
        </Box>
      </form>
    </AuthFormContainer>
  )
}

LoginPage.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

LoginPage.guestGuard = true

export default LoginPage
