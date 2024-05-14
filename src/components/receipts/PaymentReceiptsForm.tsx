import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { GridColDef } from '@mui/x-data-grid'

import PageContainer from 'src/components/global/PageContainer'
import CustomerDetailsCard from 'src/components/global/CustomerDetailsCard'
import AddPaymentCard from '../invoices/AddPaymentCard'
import { IData } from 'src/utils/types'
import AppTable from '../global/AppTable'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { IReceipt } from 'src/@fake-db/receipts'
import { IPayInfo } from 'src/types/IPayInfo'
import { buildUrl } from 'src/utils/routeUtils'
import { ICustomer } from 'src/models/ICustomer'
import {
  useGetCustomerPendingInvoicesQuery,
  useGetCustomersQuery,
} from 'src/store/apis/customersSlice'
import CustomTextField from 'src/@core/components/mui/text-field'
import ReceiptTotalCard from './ReceiptTotalCard'
import AppModal from '../global/AppModal'
import ReceiptsPreviewCard from './ReceiptsPreviewCard'
import { useModal } from 'src/hooks/useModal'
import {
  getPaymentMethodsStr,
  getPaymentMethodsTotal,
} from 'src/utils/invoicesUtils'
import {
  calculateVAT,
  getFullName,
} from 'src/utils/dataUtils'
import { useAuth } from 'src/hooks/useAuth'
import { DEFAULT_CUSTOMER } from 'src/utils/globalConstants'
import { isCashCustomer } from 'src/utils/customers.util'

interface Props {
  defaultValues?: IReceipt
  onSubmit: (values: IData) => void
}

const PaymentReceiptsForm = ({
  defaultValues,
  onSubmit,
}: Props) => {
  const { user } = useAuth()

  const [referenceValue, setReferenceValue] =
    useState<string>('')

  const [internalNotes, setInternalNotes] = useState('')
  const [paymentData, setPaymentData] = useState<
    IPayInfo[]
  >([])

  const {
    closeModal: closePreviewReceiptModal,
    openModal: openReceiptModalStatus,
    isModalOpen: previewReceiptModalStatus,
  } = useModal<any>()

  const calculateTypes = (data: any) => {
    const types = {
      cash: 0,
      card: 0,
      bacs: 0,
      credit: 0,
    }
    data.forEach((item: any) => {
      switch (item.id) {
        case 1:
          types.credit += item.amount
          break
        case 2:
          types.cash += item.amount
          break
        case 3:
          types.card += item.amount
          break
        case 4:
          types.bacs += item.amount
          break
      }
    })

    return types
  }

  const calculateTotal = (data: any) => {
    return data.cash + data.card + data.bacs + data.credit
  }

  const [selectedCustomer, setSelectedCustomer] =
    useState<any>(DEFAULT_CUSTOMER)

  const { data: userData } =
    useGetCustomerPendingInvoicesQuery({
      page: 1,
      customer_id: selectedCustomer.id,
    })

  const [selectedRowsIds, setSelectedRowsIds] = useState<
    number[]
  >([])

  const getInvoicesArr = (ids: any[]) => {
    if (ids) {
      return (userData?.results || []).filter((d: any) =>
        ids.includes(d.id),
      )
    }

    return []
  }

  const updateSelectedRows = (array: any) => {
    let total = 0
    array.map((e: any) => {
      total += Number(e.transaction.payable)
    })

    return total
  }

  const { data: customers } = useGetCustomersQuery()

  const switchCustomer = useCallback(
    (customer: ICustomer) => {
      setSelectedCustomer(customer)
    },
    [],
  )

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'DATE',
      type: 'string',
      minWidth: 180,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatDate(params.value, 'EEEE d MMM yyyy')}
        </Typography>
      ),
    },
    {
      field: 'invoice_number',
      headerName: 'INVOICE NO.',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'INVOICE TOTAL',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 180,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value).toFixed(2))}
        </Typography>
      ),
    },
    {
      field: '',
      headerName: 'AMOUNT CLEARED',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            (
              Number(params.row.total) -
              Number(params.row.transaction.payable)
            ).toFixed(2),
          )}
        </Typography>
      ),
    },
    {
      field: 'payable',
      headerName: 'OUTSTANDING',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            Number(params.row.transaction.payable).toFixed(
              2,
            ),
          )}
        </Typography>
      ),
    },
  ]

  const calculateAmountCleared = (products: any[]) => {
    let pendingPayment = getPaymentMethodsTotal(paymentData)

    const _products: any[] = []

    products.forEach((prod: any) => {
      const outstanding = Number(prod.transaction.payable)

      const amountCleared = Math.min(
        outstanding,
        pendingPayment,
      )

      pendingPayment -= amountCleared

      _products.push({
        ...prod,
        amount_cleared: amountCleared,
      })
    })

    return _products
  }

  const handleSubmit = () => {
    let total = 0
    getInvoicesArr(selectedRowsIds).map((e: any) => {
      total += Number(e.transaction.payable)
    })
    if (calculateTotal(calculateTypes(paymentData)) == 0) {
      toast.error('Payment is required')
    } else if (
      calculateTotal(calculateTypes(paymentData)) > total
    ) {
      toast.error('Payment is larger then the due amount')
    } else {
      const _defaults = defaultValues
        ? { ...defaultValues }
        : {}
      const total = updateSelectedRows(
        getInvoicesArr(selectedRowsIds),
      )
      const net = total / 1.2
      const vat = total - net

      onSubmit({
        ..._defaults,
        customer: selectedCustomer.id,
        sale_invoices: selectedRowsIds,
        extra_notes: internalNotes,
        payment: calculateTotal(
          calculateTypes(paymentData),
        ).toFixed(2),
        customer_ref: referenceValue,
        total: total.toFixed(2),
        total_vat: vat.toFixed(2),
        paid_from_cash:
          calculateTypes(paymentData).cash.toFixed(2),
        paid_from_card:
          calculateTypes(paymentData).card.toFixed(2),
        paid_from_bacs:
          calculateTypes(paymentData).bacs.toFixed(2),
        paid_from_credit:
          calculateTypes(paymentData).credit.toFixed(2),
      })
    }
  }

  useEffect(() => {
    if (window && selectedCustomer.id === 0) {
      const addInvoicePaymentInfo =
        window.localStorage.getItem('addInvoicePayment')

      setTimeout(() => {
        window.localStorage.removeItem('addInvoicePayment')
      }, 3000)

      if (addInvoicePaymentInfo) {
        const addInvoicePaymentParsed = JSON.parse(
          addInvoicePaymentInfo,
        )

        const invoicesSelected =
          addInvoicePaymentParsed.invoices

        setSelectedCustomer(
          addInvoicePaymentParsed.customer,
        )

        setSelectedRowsIds(invoicesSelected)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, userData])

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Payment Receipts',
            to: buildUrl('receipts'),
          },
          {
            label: defaultValues ? 'Edit' : 'Add',
            to: '#',
          },
        ]}
        actionBtns={
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              variant='contained'
              onClick={() => openReceiptModalStatus(1)}
            >
              Preview
            </Button>
            <Button
              variant='contained'
              onClick={handleSubmit}
            >
              Save Payment
            </Button>
          </Box>
        }
      >
        <Grid
          container
          columns={12}
          rowSpacing={2}
          columnSpacing={6}
          spacing={6}
        >
          <Grid item md={5} sm={6} xs={12}>
            <Card>
              <CustomerDetailsCard
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={newCustomer =>
                  switchCustomer(newCustomer)
                }
                referenceValue={referenceValue}
                setReferenceValue={(val: string) =>
                  setReferenceValue(val)
                }
                cashCustomers={false}
              />
            </Card>
          </Grid>

          <Grid
            item
            md={7}
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
                    Internal Notes
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 5, pb: 3 }}>
                <CustomTextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder='Internal Notes'
                  value={internalNotes}
                  onChange={e =>
                    setInternalNotes(e.target.value)
                  }
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Card sx={{ mt: 6, px: 2, py: 3 }}>
          <Box sx={{ borderTop: '1px solid #dedede' }}>
            <AppTable
              columns={columns}
              rows={userData ? userData.results : []}
              showToolbar={false}
              showSearch={false}
              pagination={false}
              autoHeight
              checkboxSelection
              rowHeight={45}
              rowSelectionModel={selectedRowsIds}
              onRowSelectionModelChange={ids => {
                setSelectedRowsIds(
                  ids.map(id => Number(id)),
                )
              }}
            />
          </Box>
        </Card>
        <Grid
          container
          columns={12}
          spacing={6}
          sx={{ mt: 1 }}
        >
          <Grid
            item
            md={6}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <AddPaymentCard
              total={updateSelectedRows(
                getInvoicesArr(selectedRowsIds),
              )}
              customercredit={
                selectedCustomer.currentCredit
              }
              paymentData={paymentData}
              onChange={values => setPaymentData(values)}
              isCashCustomer={isCashCustomer(
                selectedCustomer,
              )}
            />
          </Grid>

          <Grid
            item
            md={6}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <ReceiptTotalCard
              title='Receipt Total'
              products={getInvoicesArr(selectedRowsIds)}
            />
          </Grid>
        </Grid>
      </PageContainer>

      <AppModal
        maxWidth={900}
        open={previewReceiptModalStatus()}
        handleClose={closePreviewReceiptModal}
        sx={{ p: 0 }}
      >
        <ReceiptsPreviewCard
          products={calculateAmountCleared(
            getInvoicesArr(selectedRowsIds),
          )}
          receiptInfo={{
            'Receipt Date': dateToString(
              new Date(),
              'MM/dd/yyyy',
            ),
            'Receipt Time': dateToString(
              new Date(),
              'HH:mm',
            ),
            'Customer No.': selectedCustomer?.id,
            'Customer Ref.': referenceValue,
            'Raised By': getFullName(user),
          }}
          title='Receipt'
          invoiceTotals={{
            netTotal:
              getPaymentMethodsTotal(paymentData) -
              calculateVAT(
                getPaymentMethodsTotal(paymentData),
              ),
            vatAmount: calculateVAT(
              getPaymentMethodsTotal(paymentData),
            ),
            grossAmount:
              getPaymentMethodsTotal(paymentData),
          }}
          paymentInfo={
            getPaymentMethodsStr(
              paymentData.filter(pay => pay.amount > 0),
            ) || 'To Pay'
          }
          paymentData={paymentData}
        />
      </AppModal>
    </>
  )
}

export default PaymentReceiptsForm
