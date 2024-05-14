import { Box, Card, Grid, Typography } from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import useCalculateTransactionTotals from 'src/hooks/global/useCalculateTransactionTotals'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  products: any[]
  title?: string
  invoicePaidAmount?: number
  restockingFee?: number
  discount?: number
  delivery?: number
  hasDeliverySection?: boolean
}

const InvoiceTotalCard = ({
  products = [],
  title = 'Order Total',
  delivery = 0,
  hasDeliverySection = true,
}: Props) => {
  const {
    // amountDue,
    grossAmount,
    netAmount,
    productTotalIncVAT,
    vatAmount,
    discountTotal,
  } = useCalculateTransactionTotals({
    products,
    deliveryCost: hasDeliverySection ? delivery : 0,
  })

  const { primaryFilled } = UseBgColor()

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
                Product Total
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(productTotalIncVAT)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 4,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Icon
                fontSize={35}
                icon='tabler:discount-2'
              />
              <Box
                sx={{
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
                  Discount
                </Typography>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 300,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(discountTotal)}
                </Typography>
              </Box>
            </Box>
            {hasDeliverySection && (
              <Box
                sx={{
                  p: 4,
                  border: '1.5px dashed #dcdcdc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Icon
                  fontSize={35}
                  icon='tabler:truck-delivery'
                />
                <Box
                  sx={{
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
                    Delivery
                  </Typography>
                  <Typography
                    variant='h5'
                    sx={{
                      fontWeight: 300,
                      textAlign: 'center',
                    }}
                  >
                    {formatCurrency(delivery)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
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
                {formatCurrency(netAmount)}
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
                {formatCurrency(vatAmount)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* {delivery ? (
          <Grid item md={12} sm={12} xs={12}>
            <Box sx={{ p: 4, border: '1.5px dashed #dcdcdc', display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Icon fontSize={25} icon='tabler:truck-delivery' />
                <Typography variant='h5' sx={{ fontWeight: 600 }}>
                  Delivery
                </Typography>
              </Box>

              <Typography variant='h5'>{formatCurrency(delivery, '0')}</Typography>
            </Box>
          </Grid>
        ) : (
          <></>
        )}
        {restockingFee && (
          <Grid item md={12} sm={12} xs={12}>
            <Box sx={{ p: 4, border: '1.5px dashed #dcdcdc', display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Icon fontSize={25} icon='tabler:discount-2' />
                <Typography variant='h5' sx={{ fontWeight: 600 }}>
                  - Restocking Fee
                </Typography>
              </Box>

              <Typography variant='h5'>{formatCurrency(restockingFee, '0')}</Typography>
            </Box>
          </Grid>
        )} */}
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
          {formatCurrency(grossAmount)}
        </Typography>
      </Box>
    </Card>
  )
}

export default InvoiceTotalCard
