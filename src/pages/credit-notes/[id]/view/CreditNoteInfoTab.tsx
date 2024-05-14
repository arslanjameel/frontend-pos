import { Box, Card, Grid, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import CreditNoteRefundSection from 'src/components/credit-notes/CreditNoteRefundSection'
import CreditNotesTotalSection from 'src/components/credit-notes/CreditNotesTotalSection'
import AppBtn from 'src/components/global/AppBtn'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { calculateCRNetAmount } from 'src/utils/creditNotesUtils'
import { getFullName, numTo2dp } from 'src/utils/dataUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  getInvoicePaidAmount,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import { IData } from 'src/utils/types'

interface Props {
  invoiceInfo?: ISaleInvoice
  customerInfo: any
  returnInfo?: any
  invoicedProducts: any[]
  totalamount?: {
    sale_invoices?: {
      invoice_number: any
      total_vat: any
      total_restocking_fee: any
    }
    created_at: any
    extra_notes: any
    reason_for_adjustment: any
    total: any
    invoice_number: any
    return_number: any
    return_on: any[]
    total_vat?: any
    total_restocking_fee?: any
    paid_from_cash: any
    paid_from_card: any
    paid_from_credit: any
  }

  openEmailInvoiceModal: (customerInfo: any) => void
  openPreviewInvoiceModal: () => void
  goToInvoice: () => void
}

const CreditNoteInfoTab = ({
  invoiceInfo,
  customerInfo,
  invoicedProducts,
  totalamount,
  returnInfo,
  openEmailInvoiceModal,
  openPreviewInvoiceModal,
  goToInvoice,
}: // ,
Props) => {
  const { isMobileSize } = useWindowSize()
  const [netamount, setnetamount] = useState<any>('0')
  const [vatamount, setvatamount] = useState<any>('0')
  const [grossamount, setgrossamount] = useState<any>('0')
  const [subtotal, setsubtotal] = useState<any>('0')
  const rawDate = totalamount?.created_at || '' // Ensure you have a valid date string

  const formattedDate = new Date(
    rawDate,
  ).toLocaleDateString('en-US')
  const formattedTime = new Date(
    rawDate,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const customerDetails = {
    'Customer Name': getFullName(customerInfo),
    'Customer ID': customerInfo.id,
    'Invoice No.':
      totalamount?.sale_invoices?.invoice_number,
    'Credit Note No.':
      totalamount?.return_number || 'WWIDJWID76',
    'Date Issued': formattedDate,
    Time: formattedTime,
  }

  useEffect(() => {
    if (totalamount?.return_on?.length) {
      const _net = calculateCRNetAmount(totalamount)
      const _vat = numTo2dp(_net * 0.2)
      const _subtotal = _net + _vat
      const _gross =
        _subtotal - (totalamount?.total_restocking_fee || 0)

      setvatamount(_vat)
      setnetamount(_net)
      setsubtotal(_subtotal)
      setgrossamount(_gross)
    }
  }, [totalamount])

  // useEffect(() => {
  //   if (netamount) {
  //     const testvat =
  //     setvatamount(testvat.toFixed(2))
  //   }
  // }, [netamount])

  // useEffect(() => {
  //   if (netamount && vatamount) {
  //     const totalVat =
  //       parseFloat(netamount) + parseFloat(vatamount)
  //     setsubtotal(totalVat)
  //   }
  // }, [netamount, vatamount])

  useEffect(() => {
    if (
      subtotal &&
      totalamount?.total_restocking_fee &&
      invoiceInfo
    ) {
      const subtotalAsNumber = parseFloat(subtotal)
      const totalresfes = parseFloat(
        totalamount.total_restocking_fee,
      )

      if (!isNaN(subtotalAsNumber) && !isNaN(totalresfes)) {
        const calculatedProductTotal = (
          Math.min(
            getInvoicePaidAmount(invoiceInfo),
            subtotalAsNumber,
          ) - totalresfes
        ).toFixed(2)

        //   calculateVAT(getNetAmount()) +
        // getNetAmount() -
        // getTotalRestocking()

        setgrossamount(calculatedProductTotal)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, totalamount])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography sx={{ py: 2 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography sx={{ py: 1 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'quantity_returned',
      headerName: 'QTY',
      type: 'number',
      width: 75,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {params.row.quantity_returned}
        </Typography>
      ),
    },
    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 125,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            parseFloat(params.row.unit_price),
          )}
        </Typography>
      ),
    },
    {
      field: 'VAT',
      headerName: 'VAT INC',
      type: 'number',
      width: 125,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          <Typography>
            {formatCurrency(
              parseFloat(params.row.unit_price) * 1.2,
            )}
          </Typography>
        </Typography>
      ),
    },

    // {
    //   field: 'restocking_fee',
    //   headerName: 'R.FEE',
    //   type: 'number',
    //   width: 90,
    //   align: 'center',
    //   headerAlign: 'center',
    //   disableColumnMenu: true,
    //   sortable: false,
    //   renderCell: params => (
    //     <Typography>
    //       {formatCurrency(
    //         parseFloat(params.row.restocking_fee),
    //       )}
    //     </Typography>
    //   ),
    // },
    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      width: 105,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            parseFloat(params.row.unit_price) *
              1.2 *
              params.row.quantity_returned,
          )}
        </Typography>
      ),
    },
  ]

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <Grid
          container
          columns={12}
          spacing={6}
          sx={{ mb: 6 }}
        >
          <Grid item md={4} sm={6} xs={12}>
            <Card>
              <Box
                sx={{
                  px: 6,
                  height: 50,
                  borderBottom: '1.3px solid #dcdcdc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h5' fontWeight={600}>
                  Credit Note Details
                </Typography>
                <Typography variant='h5' fontWeight={600}>
                  {totalamount?.return_number}
                </Typography>
              </Box>

              <Box
                sx={{
                  py: 3,
                  px: 6.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {Object.entries(customerDetails).map(
                  info => (
                    <Box
                      key={info[0]}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          minWidth: 130,
                          fontWeight: 600,
                        }}
                      >
                        {info[0]}
                      </Typography>
                      {info[0] === 'Customer Name' ? (
                        <Typography
                          color='primary'
                          fontWeight={600}
                        >
                          <Link
                            href={`/customers/${customerInfo.id}`}
                          >
                            {info[1]}
                          </Link>
                        </Typography>
                      ) : (
                        <Typography>{info[1]}</Typography>
                      )}
                    </Box>
                  ),
                )}
              </Box>
            </Card>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <Card
              sx={{
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1.3px solid #dcdcdc',
                  px: 5,
                  height: 50,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    variant={'h6'}
                    fontWeight={600}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    Notes
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 5, pb: 3 }}>{''}</Box>
            </Card>
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Card
              sx={{
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <AppBtn
                icon='tabler:mail'
                text='Email Credit Note'
                onClick={() =>
                  openEmailInvoiceModal(customerInfo)
                }
              />
              <AppBtn
                icon='tabler:file-download'
                text='Download'
                onClick={() => openPreviewInvoiceModal()}
              />
              <AppBtn
                icon='tabler:file-dollar'
                text='Go to Invoice'
                onClick={goToInvoice}
              />
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            border: '1px solid #ddd',
            py: 5,
          }}
        >
          <Typography
            variant='h5'
            sx={{ fontWeight: 600, mx: 8 }}
          >
            Products
          </Typography>
          <Box
            sx={{
              borderTop: '1px solid #ddd',
              mx: isMobileSize ? 0 : 4,
            }}
          >
            <AppTable
              columns={columns}
              rows={invoicedProducts}
              showToolbar={false}
              pagination={false}
              flexHeight
              miniColumns={['sku', 'total']}
              openMiniModal={openTableDataModal}
            />
            <Typography
              variant='h5'
              sx={{ fontWeight: 600, mx: 4, mt: 4 }}
            >
              {totalamount?.reason_for_adjustment && (
                <>
                  Reason For Adjustment :
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {totalamount?.reason_for_adjustment}
                </>
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 3,
              px: 8,
            }}
          >
            {/* <Box
              sx={{
                flex: 1,
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
                pb: isMobileSize ? 6 : 0,
                minWidth: 'fit-content',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    flex: 1,
                    maxWidth: 120,
                  }}
                >
                  Refund Amount
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {formatCurrency(
                    returnInfo?.payment_to_customer || 0,
                  )}
                </Typography>
              </Box>

              {parseFloat(
                totalamount?.paid_from_credit || 0,
              ) > 0 && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      flex: 1,
                      maxWidth: 120,
                    }}
                  >
                    Credit
                  </Typography>
                  <Typography sx={{ flex: 1 }}>
                    {formatCurrency(
                      totalamount?.paid_from_credit || 0,
                    )}
                  </Typography>
                </Box>
              )}

              {parseFloat(
                totalamount?.paid_from_cash || 0,
              ) > 0 && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      flex: 1,
                      maxWidth: 120,
                    }}
                  >
                    Cash
                  </Typography>
                  <Typography sx={{ flex: 1 }}>
                    {formatCurrency(
                      totalamount?.paid_from_cash || 0,
                    )}
                  </Typography>
                </Box>
              )}

              {parseFloat(
                totalamount?.paid_from_card || 0,
              ) > 0 && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      flex: 1,
                      maxWidth: 120,
                    }}
                  >
                    Card
                  </Typography>
                  <Typography sx={{ flex: 1 }}>
                    {formatCurrency(
                      totalamount?.paid_from_card || 0,
                    )}
                  </Typography>
                </Box>
              )}
            </Box> */}

            <CreditNoteRefundSection
              fontSize={15}
              paymentToCustomer={
                returnInfo?.payment_to_customer || 0
              }
              paymentsObj={totalamount}
            />

            <CreditNotesTotalSection
              fontSize={15}
              maxWidth={310}
              netAmount={netamount}
              vatAmount={vatamount}
              subTotal={subtotal}
              totalRestockingFee={
                totalamount?.total_restocking_fee || 0
              }
              grossAmount={grossamount}
              invoicePaidAmount={
                invoiceInfo
                  ? getInvoicePaidAmount(invoiceInfo)
                  : 0
              }
              refundMethod={getPaymentMethodsStr(
                getPaymentMethods(totalamount),
              )}
            />

            {/* <Box
              sx={{
                flex: 1,
                minWidth: 'fit-content',
                maxWidth: 215,
                ml: 'auto',
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  Net Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 85,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(netamount)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  VAT Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 85,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(vatamount)}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  Subtotal
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 85,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ textAlign: 'left', flex: 1 }}
                >
                  Restocking Fee
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 85,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  -
                  {formatCurrency(
                    totalamount?.total_restocking_fee || 0,
                  )}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    textAlign: 'left',
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  Gross Amount
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 85,
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(grossamount)}
                </Typography>
              </Box>
            </Box> */}
          </Box>
        </Card>
      </Box>
      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'SKU:': tableData.sku,
                'Product Name:': tableData.product_name,
                'Quantity:': tableData.quantity,
                'Unit Price:': formatCurrency(
                  tableData.unit_price,
                ),
                'R. Fee:': formatCurrency(tableData.rFee),
                'Total:': formatCurrency(tableData.total),
              }
            : {}
        }
      />
    </>
  )
}

export default CreditNoteInfoTab
