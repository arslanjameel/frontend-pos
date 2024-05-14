import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { calculateGross } from 'src/utils/dataUtils'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  products: any[]
  title?: string
  invoicePaidAmount?: number
  restockingFee?: number
  discount?: number

  delivery?: number
}

const QuoteTotalCard = ({
  products = [],
  title = 'Quote Total',
  discount,

  invoicePaidAmount,
  restockingFee,

  delivery,
}: Props) => {
  const { primaryFilled } = UseBgColor()
  const [netAmount, setNetAmount] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [grossTotal, setGrossTotal] = useState(0)

  useEffect(() => {
    const { net, vat, sub, gross } = calculateGross(
      products,
      {
        delivery,
        discount,
        restockingFee,
      },
    )

    setNetAmount(net)
    setVatAmount(vat)
    setSubTotal(sub)
    setGrossTotal(gross)
  }, [products, delivery, discount, restockingFee])

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
        {discount ? (
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Icon
                  fontSize={25}
                  icon='tabler:discount-2'
                />
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 600 }}
                >
                  Discount
                </Typography>
              </Box>

              <Typography variant='h5'>
                {formatCurrency(discount)}
              </Typography>
            </Box>
          </Grid>
        ) : (
          <></>
        )}

        {invoicePaidAmount && (
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Icon fontSize={25} icon='tabler:cash' />
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 600 }}
                >
                  Invoice Paid Amount
                </Typography>
              </Box>

              <Typography variant='h5'>
                {formatCurrency(invoicePaidAmount)}
              </Typography>
            </Box>
          </Grid>
        )}
        <Grid item md={12} sm={12} xs={12}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 4,
            }}
          >
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Gross Amount
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(netAmount)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
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
                {formatCurrency(vatAmount)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Subtotal
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(subTotal)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {delivery ? (
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Icon
                  fontSize={25}
                  icon='tabler:truck-delivery'
                />
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 600 }}
                >
                  Delivery
                </Typography>
              </Box>

              <Typography variant='h5'>
                {formatCurrency(delivery)}
              </Typography>
            </Box>
          </Grid>
        ) : (
          <></>
        )}
        {restockingFee && (
          <Grid item md={12} sm={12} xs={12}>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Icon
                  fontSize={25}
                  icon='tabler:discount-2'
                />
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 600 }}
                >
                  - Restocking Fee
                </Typography>
              </Box>

              <Typography variant='h5'>
                {formatCurrency(restockingFee)}
              </Typography>
            </Box>
          </Grid>
        )}
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
          Quotation Total
        </Typography>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            color: primaryFilled.color,
          }}
        >
          {formatCurrency(grossTotal)}
        </Typography>
      </Box>
    </Card>
  )
}

export default QuoteTotalCard
