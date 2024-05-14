// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Typography
        sx={{
          mr: 2,
          display: 'flex',
          color: 'text.secondary',
        }}
        fontWeight={600}
        fontSize={14}
      >
        {`© ${new Date().getFullYear()}, POS Version 1.0.1-beta`}
      </Typography>
    </Box>
  )
}

export default FooterContent
