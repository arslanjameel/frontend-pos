'use client'
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import { formatCurrency } from 'src/utils/formatCurrency'
import {
  COMPANY_NUMBER,
  COMPANY_VAT_NUMBER,
} from 'src/utils/globalConstants'
import AppTable from '../global/AppTable'
import CurrentStoreName from '../global/CurrentStoreName'
import CurrentStoreAddress from '../global/CurrentStoreAddress'
import { calculateVAT } from 'src/utils/dataUtils'
import CreditNoteRefundSection from './CreditNoteRefundSection'
import CreditNotesTotalSection from './CreditNotesTotalSection'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'
import {
  getApiStylePaymentMethods,
  getInvoicePaidAmount,
  getPaymentMethodsTotal,
} from 'src/utils/invoicesUtils'
import { ISaleInvoice } from 'src/models/ISaleInvoice'

interface Props {
  title: string
  invoiceInfo: {
    [key: string]: string
  }
  invoice?: ISaleInvoice
  products: any[]
  refundMethod?: string
  allowPrint?: boolean
  closeAction?: () => void
  notes?: string
  paymentData?: IPayInfo[]
}

const CreditNotePreviewCard = ({
  title,
  invoiceInfo,
  invoice,
  refundMethod,
  products,
  allowPrint,
  closeAction,
  paymentData = [],
}: Props) => {
  const getNetAmount = () =>
    products.reduce(
      (total, curr) =>
        total + curr.unit_price * curr.quantity,
      0,
    )
  const getTotalRestocking = () =>
    products.reduce(
      (total, curr) => total + (curr.restocking_fee || 0),
      0,
    )

  const getGrossAmount = () =>
    calculateVAT(getNetAmount()) +
      getNetAmount() -
      getTotalRestocking() || 0

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
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
        <Typography fontSize={13}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 115,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'vat',
      headerName: 'VAT INC',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 110,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: params =>
        Number(params.row.unit_price) +
        Number(params.value),
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'restocking_fee',
      headerName: 'R.FEE',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography fontSize={13}>
          {formatCurrency(Number(params.value))}
        </Typography>
      ),
    },
  ]

  return (
    <Box>
      {allowPrint && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 5,
            gap: 2,
          }}
        >
          {allowPrint && (
            <Button
              variant='contained'
              onClick={() => {
                // handleGeneratePdf()
                closeAction && closeAction()

                // downloadPDF('pdf-content')
              }}
            >
              Print
            </Button>
          )}
        </Box>
      )}

      <Box
        id='pdf-content'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

          border: allowPrint ? '1px solid #ddd' : '',
          py: 8,
          minHeight: 1000,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            px: 8,
          }}
        >
          <Box sx={{ maxWidth: 230 }}>
            <CurrentStoreName />
            <CurrentStoreAddress withMoreInfo />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxWidth: 300,
              flex: 1,
            }}
          >
            <Typography
              variant='h4'
              fontWeight={600}
              textAlign={'right'}
            >
              {title}
            </Typography>

            <Box>
              {Object.entries(invoiceInfo).map(
                (info, i) => (
                  <Box
                    key={info[0]}
                    sx={{ display: 'flex' }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.3,
                        border: '1.5px solid #8f8f8f94',
                        borderBottom:
                          Object.entries(invoiceInfo)
                            .length !==
                          i + 1
                            ? 'none'
                            : '1.5px solid #8f8f8f94',
                        flex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: 13,
                        background: '#dddddd95',
                      }}
                    >
                      {info[0]}
                    </Box>
                    <Box
                      sx={{
                        p: 1,
                        py: 1.3,
                        border: '1.5px solid #8f8f8f94',
                        borderBottom:
                          Object.entries(invoiceInfo)
                            .length !==
                          i + 1
                            ? 'none'
                            : '1.5px solid #8f8f8f94',
                        borderLeft: 'none',
                        flex: 3,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {info[1]}
                    </Box>
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </Box>

        {/*
        // *
        // * Products Section
        // *
        // *
      */}
        <Box
          sx={{
            mx: 8,
            pb: 8,
            mt: 4,

            // minHeight: 400,
            // borderBottom: '1.5px solid #ddd',
          }}
        >
          <Box sx={{ border: '1px solid #ddd' }}>
            <AppTable
              compress
              rowHeight={38}
              headerStyle={{ background: '#dddddd95' }}
              columns={columns}
              rows={products}
              miniColumns={['sku']}
              showToolbar={false}
              pagination={false}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}></Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 3,
            px: 8,
          }}
        >
          <CreditNoteRefundSection
            paymentToCustomer={
              getPaymentMethodsTotal(paymentData) || 0
            }
            paymentsObj={getApiStylePaymentMethods(
              paymentData.map(val =>
                val.id === PayTypes.Credit
                  ? {
                      ...val,
                      amount: invoice
                        ? Math.min(
                            invoice
                              ? getInvoicePaidAmount(
                                  invoice,
                                )
                              : 0,
                            getGrossAmount(),
                          ) -
                          getTotalRestocking() -
                          getPaymentMethodsTotal(
                            paymentData,
                          )
                        : 0,
                    }
                  : val,
              ),
            )}
          />

          <CreditNotesTotalSection
            refundMethod={refundMethod}
            netAmount={getNetAmount()}
            vatAmount={calculateVAT(getNetAmount())}
            subTotal={
              calculateVAT(getNetAmount()) + getNetAmount()
            }
            totalRestockingFee={getTotalRestocking() || 0}
            grossAmount={
              Math.min(
                invoice ? getInvoicePaidAmount(invoice) : 0,
                getGrossAmount(),
              ) - getTotalRestocking()
            }
            invoicePaidAmount={
              invoice ? getInvoicePaidAmount(invoice) : 0
            }
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mx: 8,
            borderTop: '1.5px solid #ddd',
            py: 3,
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography fontSize={13}>
                Sharjah Ltd Company Number
              </Typography>
              <Typography fontSize={13} fontWeight={600}>
                {COMPANY_NUMBER}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography fontSize={13}>
                VAT Number
              </Typography>
              <Typography fontSize={13} fontWeight={600}>
                {COMPANY_VAT_NUMBER}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreditNotePreviewCard
