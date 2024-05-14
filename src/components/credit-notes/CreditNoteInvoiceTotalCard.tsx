import { Box, Card, Grid, Typography } from '@mui/material'
import React from 'react'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { formatCurrency } from 'src/utils/formatCurrency'

interface Props {
  products: any[]
  title?: string
  delivery?: number
  checked?: boolean
  adjustmentamount: number
  selectedproducts: any[]

  paymentMethods?: string
  creditNoteTotals?: {
    invoiceTotal?: number
    invoicePaidAmount?: number
    restockingFee?: number
    netAmount?: number
    vatAmount?: number
    total?: number
    refundTotal?: number
  }
}

const InvoiceTotalCard = ({
  // products = [],
  title = 'Order Total',

  // checked,
  // adjustmentamount,
  // selectedproducts,

  paymentMethods,
  creditNoteTotals,
}: Props) => {
  const { primaryFilled } = UseBgColor()

  // const [InvoiceAmount, setInvoiceAmount] =
  //   useState<number>(0)
  // const [Invoicetotal, setInvoicetotal] =
  //   useState<number>(0)

  // const [vatAmount, setVatAmount] = useState<number>(0)
  // const [restocked, setrestockfee] = useState<number>(0)
  // const [netamount, setnetamount] = useState<number>(0)
  // const [grossamount, setgrossamount] = useState<number>(0)
  // const [refund, setrefund] = useState<number>(0)

  // useEffect(() => {
  //   if (!checked) {
  //     if (products !== undefined && products.length > 0) {
  //       const calculatedProductTotal = products.reduce(
  //         (accumulator, product) =>
  //           accumulator +
  //           parseFloat(product?.vatInc) *
  //             product?.quantity -
  //           product?.rFee,
  //         0,
  //       )
  //       if (products[0]?.payable < calculatedProductTotal) {
  //         setrefund(products[0]?.payable)
  //       } else {
  //         setrefund(calculatedProductTotal.toFixed(2))
  //       }
  //       setgrossamount(calculatedProductTotal.toFixed(2))
  //     } else {
  //       // Handle the case when products is undefined or empty
  //       setrefund(0.0)
  //       setgrossamount(0.0)
  //     }
  //   } else {
  //     if (selectedproducts?.length) {
  //       setrefund(adjustmentamount)
  //       setInvoiceAmount(selectedproducts[0]?.payable)
  //       setInvoicetotal(
  //         selectedproducts[0]?.invoicetotalamount,
  //       )
  //     } else {
  //       setrefund(0.0)
  //       setInvoiceAmount(0.0)
  //       setInvoicetotal(0.0)
  //     }
  //   }
  // }, [
  //   products,
  //   selectedproducts,
  //   adjustmentamount,
  //   checked,
  // ])

  // useEffect(() => {
  //   if (
  //     products !== undefined &&
  //     products.length > 0 &&
  //     !checked
  //   ) {
  //     const payable = products[0].payable
  //     const invoicestotal = products[0].invoicetotalamount
  //     setInvoiceAmount(payable)
  //     setInvoicetotal(invoicestotal)
  //   }
  // }, [products, checked])

  // useEffect(() => {
  //   if (grossamount > 0) {
  //     const totalamount = grossamount / 1.2
  //     setnetamount(Number(totalamount.toFixed(2)))
  //   } else {
  //     setnetamount(0.0)
  //   }
  // }, [grossamount])

  // useEffect(() => {
  //   if (netamount > 0) {
  //     const amount = grossamount - netamount
  //     setVatAmount(Number(amount.toFixed(2)))
  //   } else {
  //     setVatAmount(0.0)
  //   }
  // }, [netamount, grossamount])

  // useEffect(() => {
  //   if (selectedproducts.length > 0) {
  //     const calculatedProductTotal =
  //       selectedproducts.reduce(
  //         (accumulator, product) =>
  //           accumulator + parseFloat(product.rFee),
  //         0,
  //       )
  //     setrestockfee(calculatedProductTotal.toFixed(2))
  //   } else {
  //     // Handle the case when products is undefined or empty
  //     setrestockfee(0.0)
  //   }
  // }, [selectedproducts])

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
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Invoice Total
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(
                  creditNoteTotals?.invoiceTotal || 0,
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Invoice Paid Amount
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(
                  creditNoteTotals?.invoicePaidAmount || 0,
                )}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {/* {!checked && ( */}
        {/* <> */}{' '}
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
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Payment Method
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {paymentMethods || ''}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Restocking Fee
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(
                  creditNoteTotals?.restockingFee || 0,
                )}
              </Typography>
            </Box>
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
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                {formatCurrency(
                  creditNoteTotals?.netAmount || 0,
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                {formatCurrency(
                  creditNoteTotals?.vatAmount || 0,
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                border: '1.5px dashed #dcdcdc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Total
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 300,
                  textAlign: 'center',
                }}
              >
                {formatCurrency(
                  creditNoteTotals?.total || 0,
                )}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {/* </> */}
        {/* )} */}
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
          Refund Total
        </Typography>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            color: primaryFilled.color,
          }}
        >
          {formatCurrency(
            creditNoteTotals?.refundTotal || 0,
          )}
        </Typography>
      </Box>
    </Card>
  )
}

export default InvoiceTotalCard
