import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'

import { isIdValid } from 'src/utils/routerUtils'
import { buildUrl } from 'src/utils/routeUtils'

const NewInvoicePage = () => {
  const router = useRouter()
  const { id } = router.query

  const invoiceId = isIdValid(id)

  useEffect(() => {
    router.replace(
      buildUrl('invoices', {
        itemId: invoiceId,
        mode: 'view',
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId])

  return <Box>NewInvoicePage: {invoiceId}</Box>
}

export default NewInvoicePage
