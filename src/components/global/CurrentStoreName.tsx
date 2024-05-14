import Typography from '@mui/material/Typography'
import React from 'react'
import { useAppSelector } from 'src/store/hooks'

const CurrentStoreName = () => {
  const { store } = useAppSelector(state => state.app)

  return (
    <Typography variant='h3' sx={{ mb: 5 }}>
      {store?.name || 'Store'}
    </Typography>
  )
}

export default CurrentStoreName
