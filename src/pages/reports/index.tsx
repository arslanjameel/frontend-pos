import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
import React from 'react'
import PageContainer from 'src/components/global/PageContainer'

const ReportsListPage = () => {
  return (
    <PageContainer title='Reports'>
      <Card>
        <CardHeader title='Coming soon! ⏱️'></CardHeader>
        <CardContent>
          <Typography>
            The reports section will be coming very soon.
          </Typography>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default ReportsListPage
