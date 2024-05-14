import React from 'react'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'

import { isIdValid } from 'src/utils/routerUtils'

const NewOrderPage = () => {
  const router = useRouter()
  const { id } = router.query

  const orderId = isIdValid(id)

  return <Box>NewOrderPage: {orderId}</Box>
}

export default NewOrderPage
