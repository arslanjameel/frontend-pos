// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import toast from 'react-hot-toast'

import UserInfo from 'src/components/userAccounts/UserInfo'

// import { registerUser } from 'src/services/account/auth.service'
import { useRegisterUserMutation } from 'src/store/apis/authSlice'
import { useRouter } from 'next/router'
import AuthFormContainer from 'src/components/global/AuthFormContainer'
import { UserType } from 'src/types/UserTypes'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
}))

const Register = () => {
  const router = useRouter()

  const [formError, setFormError] = useState('')
  const [registerUser, { isLoading }] =
    useRegisterUserMutation()

  interface FormData {
    first_name: string
    last_name: string
    password: string
    verifyPassword?: string
    pin_code: string
    verifyPinCode?: string
    email: string
    mobile: string
    address: string
    city: number
    country: number
    postalCode: string
  }

  const onSubmit = (values: FormData) => {
    registerUser({
      first_name: values.first_name,
      last_name: values.last_name,
      address: values.address,
      city: values.city,
      country: values.country,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
      pin_code: values.pin_code,
      stores: [],
      user_type: UserType.SALESPERSON,
      working_hours: [],
      postalCode: values.postalCode,
      status: 'Pending',
    })
      .unwrap()
      .then(() => {
        toast.success('User created successfully')
        router.replace('/login')
      })
      .catch(err => {
        if (err.data) {
          const firstErr = Object.values(err.data)[0]
          setFormError(firstErr as string)
        }
        toast.error('An error occurred')
      })
  }

  return (
    <AuthFormContainer
      title='Request Account'
      subtitle="Enter your information below and we'll have an account set up for you"
      maxWidth={600}
    >
      {formError && (
        <Typography
          color='error'
          marginBottom={6}
          textAlign='center'
        >
          {formError}
        </Typography>
      )}
      <UserInfo
        headerShown={false}
        onSubmit={onSubmit}
        actionBtns={
          <Button
            fullWidth
            type='submit'
            disabled={isLoading}
            variant='contained'
            sx={{ my: 4 }}
          >
            Submit Account Request
          </Button>
        }
      />

      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': { mr: 1 },
        }}
      >
        <LinkStyled
          href='/login'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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

Register.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

Register.guestGuard = true

export default Register
