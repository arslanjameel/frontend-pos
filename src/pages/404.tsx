// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20),
  },
}))

interface Props {
  title?: string
  subTitle?: string
  brief?: boolean
  backToText?: string
  backToLink?: string
}

const Error404 = ({
  title = 'Page Not Found :(',
  subTitle = 'Oops! 😖 The requested URL was not found on this server.',
  brief = false,
  backToText = 'Back to Home',
  backToLink = '/',
}: Props) => {
  return (
    <Box className='content-center'>
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BoxWrapper>
          <Typography variant='h2' sx={{ mb: 1.5 }}>
            {title}
          </Typography>
          <Typography
            sx={{ mb: 6, color: 'text.secondary' }}
          >
            {subTitle}
          </Typography>
          <Button
            href={backToLink}
            component={Link}
            variant='contained'
          >
            {backToText}
          </Button>
        </BoxWrapper>
        {!brief && (
          <Img
            height='500'
            alt='error-illustration'
            src='/images/pages/404.png'
          />
        )}
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Error404.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

export default Error404
