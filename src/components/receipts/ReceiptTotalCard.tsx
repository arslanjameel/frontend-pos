import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UseBgColor from 'src/@core/hooks/useBgColor'

interface Props {
  products: any[]
  title?: string
}

const ReceiptTotalCard = ({
  products = [],
  title = '',
}: Props) => {
  const { primaryFilled } = UseBgColor()
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    let total = 0
    products.map(e => {
      total += Number(e.transaction.payable)
    })
    setTotalAmount(total)
  }, [products])

  return (
    <Card
      sx={{
        p: 4,
        px: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
      }}
    >
      <Typography variant='h5' fontWeight={600}>
        {title}
      </Typography>

      <Grid container columns={12} spacing={4}>
        <Grid item md={12} sm={12} xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Net Amount
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                <span>
                  £{(totalAmount / 1.2).toFixed(2)}
                </span>
              </Typography>
            </Box>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                VAT Amount
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                £
                {(totalAmount - totalAmount / 1.2).toFixed(
                  2,
                )}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 'auto',
          background: primaryFilled.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 4,
          py: 2,
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            color: primaryFilled.color,
          }}
        >
          Gross Total
        </Typography>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            color: primaryFilled.color,
          }}
        >
          £{totalAmount.toFixed(2)}
        </Typography>
      </Box>
    </Card>
  )
}

export default ReceiptTotalCard
