import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material'
import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'
import {
  GridColDef,
  GridRowSelectionModel,
} from '@mui/x-data-grid'

import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import PageContainer from 'src/components/global/PageContainer'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'
import AppTable from '../global/AppTable'
import { formatCurrency } from 'src/utils/formatCurrency'
import CustomTextField from 'src/@core/components/mui/text-field'
import CreditNoteInvoiceTotalCard from './CreditNoteInvoiceTotalCard'
import ConfirmationModal from '../global/ConfirmationModal'
import CreditModal from './CreditConfirmationModal'
import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'
import AppModal from '../global/AppModal'
import ManagerApprovalModal from '../global/Modals/ManagerApprovalModal'
import InvoicesDropdown from '../global/Dropdowns/InvoicesDropdown'
import { useGetInvoicesSearchQuery } from 'src/store/apis/invoicesSlice'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import AddPaymentCard from '../invoices/AddPaymentCard'
import {
  getInvoicePaidAmount,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import { useAppSelector } from 'src/store/hooks'
import { useAuth } from 'src/hooks/useAuth'
import {
  calculateVAT,
  getFullName,
  numTo2dp,
} from 'src/utils/dataUtils'
import { isCashCustomer } from 'src/utils/customers.util'
import CustomerDetailsCard from '../global/CustomerDetailsCard'
import ProductReturnsModal from '../global/Modals/ProductReturnsModal'
import { isStoreSelected } from 'src/utils/storeUtils'
import { isUserAManager } from 'src/utils/rolesUtils'
import {
  getConfirmationMessage,
  getUpdatedPaymentData,
} from 'src/utils/creditNotesUtils'
import CreditNotePreviewCard from './CreditNotePreviewCard'

interface Props {
  defaultValues?: any //TODO: update to ICreditNote
  onSubmit: (values: IData) => void //TODO: update to ICreditNote
}

const CreditNotesForm = ({
  defaultValues,
  onSubmit,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')

  const { store } = useAppSelector(state => state.app)
  const { user } = useAuth()

  const { data: invoices } = useGetInvoicesSearchQuery({
    page: 1,
    searchTerm,
    store: isStoreSelected(store) ? store.id : undefined,
  })

  /**
   *
   * START - Keep track of selected invoice and its returns
   *
   */
  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState(0)
  const [selectedInvoice, setSelectedInvoice] =
    useState<ISaleInvoice | null>(null)

  const [invoiceProducts, setInvoiceProducts] = useState<
    any[]
  >([])

  const [customerRef, setCustomerRef] = useState('')

  /**
   * What payment method exists in the invoice
   */
  const [invoicePaymentOptions, setInvoicePaymentOptions] =
    useState<IPayInfo[]>([])

  /**
   *
   * END - Keep track of selected invoice
   *
   */

  /**
   *
   * START - Credit Note Totals
   *
   */

  const [creditNoteTotals, setCreditNoteTotals] = useState({
    invoiceTotal: 0,
    invoicePaidAmount: 0,
    restockingFee: 0,
    netAmount: 0,
    vatAmount: 0,
    total: 0,
    refundTotal: 0,
  })

  /**
   *
   * END - Credit Note Totals
   *
   */

  const [selectedProductIds, setSelectedProductIds] =
    useState<GridRowSelectionModel>([])

  const [selectedRows, setSelectedRows] = useState<any[]>(
    [],
  )
  const [selectedProducts, setSelectedProducts] = useState<
    any[]
  >([])

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const [selectedCustomer, setSelectedCustomer] =
    useState<any>({
      id: 0,
      firstName: 'Cash',
      lastName: 'Customer',
    })

  const columns: GridColDef[] = [
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight={500} fontSize={15.5}>
            {params.value}
          </Typography>
          <Typography variant='body2'>
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          placeholder='QTY'
          value={params.value}
          disabled={isChecked}
          type='number'
          onChange={(e: any) => {
            if (params.row.not_returnable) return

            const enteredValue = Number(e.target.value)
            const originalQuantity =
              params.row.max_quantity || 0
            const newValue =
              enteredValue >= 0 ? enteredValue : 0
            const finalValue =
              newValue >= originalQuantity
                ? originalQuantity
                : newValue >= 1
                ? newValue
                : 0

            let tempProducts = [...invoiceProducts]
            tempProducts = tempProducts.map(prod =>
              prod.id === params.row.id
                ? {
                    ...prod,
                    quantity: finalValue,
                  }
                : prod,
            )
            setInvoiceProducts(tempProducts)
          }}
        />
      ),
    },

    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'vat',
      headerName: 'VAT INC',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      disableColumnMenu: true,
      valueGetter: params =>
        Number(params.row.unit_price) +
        Number(params.value),
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'restocking_fee',
      headerName: 'R. FEE',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          placeholder='R. Fee'
          disabled={isChecked}
          value={params.value}
          type='number'
          onChange={(e: any) => {
            const newValue = Math.max(
              0,
              Number(e.target.value),
            )

            let tempProducts = [...invoiceProducts]
            tempProducts = tempProducts.map(prod =>
              prod.id === params.row.id
                ? {
                    ...prod,
                    restocking_fee: newValue,
                  }
                : prod,
            )

            setInvoiceProducts(tempProducts)
          }}
        />
      ),
    },
    {
      field: 'faulty',
      headerName: 'FAULTY',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Checkbox
          disabled={isChecked}
          checked={params.row.faulty}
          onChange={(e: any) => {
            const newValue = e.target.checked // Assuming 'faulty' is a boolean field

            let tempProducts = [...invoiceProducts]
            tempProducts = tempProducts.map(prod =>
              prod.id === params.row.id
                ? {
                    ...prod,
                    faulty: newValue,
                  }
                : prod,
            )

            setInvoiceProducts(tempProducts)
          }}
        />
      ),
    },

    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      valueGetter: params =>
        (Number(params.row.unit_price) +
          Number(params.row.vat)) *
          Number(params.row.quantity) -
        Number(params.row.discount) -
        (params.row.restocking_fee || 0),

      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  const {
    openModal: openConfirmSubmitModal,
    closeModal: closeConfirmSubmitModal,
    isModalOpen: confirmSubmitModalStatus,
  } = useModal<number>()

  const {
    openModal: openConfirmCreditSubmitModal,
    closeModal: closeConfirmCreditSubmitModal,
    isModalOpen: confirmSubmitCreditModalStatus,
  } = useModal<number>()

  const getPaymentAmount = (
    title: string,
    pDataObj?: IPayInfo[],
  ) => {
    const paymentItem = (pDataObj || paymentData).find(
      item =>
        item.title.toLowerCase() === title.toLowerCase(),
    )

    return paymentItem ? paymentItem.amount : 0
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState(0)
  const [enteredValue, setEnteredValue] = useState(0)
  const [enteredReason, setEnteredReason] = useState('')
  const [isChecked, setChecked] = useState(false)

  const [extra_notes, setExtra_notes] = useState('')

  const getInvoiceAmountDue = () =>
    paymentData.reduce(
      (balance, pay) => balance - pay.amount,
      creditNoteTotals.refundTotal,
    )
  const getPaymentInfo = (products: any[]) => {
    let _paymentData = [...paymentData]

    _paymentData = _paymentData.map(pay =>
      pay.id === PayTypes.Credit
        ? {
            ...pay,
            amount: pay.amount + getInvoiceAmountDue(),
          }
        : pay,
    )

    const calculatedTotal = _paymentData.reduce(
      (acc, payment) => acc + payment.amount,
      0,
    )
    const totalRestockingFee = products.reduce(
      (total, product) => total + product.restocking_fee,
      0,
    )

    const total_vat = products.reduce(
      (total, product) => total + Number(product.vat),
      0,
    )

    let totalAmount = -totalRestockingFee

    if (!isChecked) {
      totalAmount += products.reduce(
        (total, product) =>
          total +
          (Number(product.vat) +
            Number(product.unit_price)) *
            product.quantity,
        0,
      )
    } else {
      totalAmount += enteredValue
    }

    return {
      calculatedTotal,
      total_vat,
      totalAmount,
      totalRestockingFee,
      _paymentData,
    }
  }

  const handleSubmit = () => {
    //check if an invoice is selected
    if (!selectedInvoice) {
      toast.error('No invoice was selected')

      return
    }

    //check if any product was selected
    if (selectedProductIds.length === 0) {
      toast.error('No product was selected')

      return
    }

    //check if customer is cash Customer -> Should make full refund
    const amountDue = getInvoiceAmountDue()
    if (isCashCustomer(selectedCustomer)) {
      if (amountDue > 0)
        return toast.error(
          'Refund entire balance for cash customer',
        )
    }
    if (amountDue < 0)
      return toast.error(
        'You can only return a maximum of what the customer paid',
      )

    const _selectedProducts = selectedProductIds.map(id =>
      invoiceProducts.find(
        product => product.id === Number(id),
      ),
    )

    const showReturnsModal = _selectedProducts.some(
      prod =>
        prod.quantity_delivered > 0 &&
        prod.quantity_pending > 0,
    )

    if (showReturnsModal) {
      openProductReturnsModal(
        _selectedProducts.map(prod => ({
          ...prod,
          max_delivered: prod.quantity_delivered,
        })),
      )

      return
    }

    completeCreation(_selectedProducts)
  }

  const completeCreation = (products: any[]) => {
    const {
      calculatedTotal,
      totalAmount,
      total_vat,
      _paymentData,
      totalRestockingFee,
    } = getPaymentInfo(products)

    if (isStoreSelected(store)) {
      const _defaults = defaultValues
        ? { ...defaultValues }
        : {}

      const _updatedPaymentData = getUpdatedPaymentData(
        getInvoiceAmountDue(),
        _paymentData,
        isCashCustomer(selectedCustomer),
      )

      onSubmit({
        ..._defaults,
        customer: selectedInvoice?.customer.id || 0,
        extra_notes: extra_notes || '',
        customer_reference: customerRef,
        over_charge: isChecked,
        paid_from_cash: getPaymentAmount(
          'cash',
          _updatedPaymentData,
        ).toString(),
        paid_from_card: getPaymentAmount(
          'card',
          _updatedPaymentData,
        ).toString(),
        paid_from_bacs: getPaymentAmount(
          'bacs',
          _updatedPaymentData,
        ).toString(),
        paid_from_credit: getPaymentAmount(
          'credit',
          _updatedPaymentData,
        ).toString(),
        payment_to_customer: numTo2dp(
          Number(
            selectedInvoice?.transaction.payment &&
              calculatedTotal >
                Number(selectedInvoice?.transaction.payment)
              ? selectedInvoice?.transaction.payment
              : calculatedTotal,
          ),
        ).toString(),

        quantity: products.reduce(
          (total, curr) =>
            Number(total) + (Number(curr.quantity) || 0),
          0,
        ),
        reason_for_adjustment: enteredReason,

        sale_invoices: selectedInvoiceId,
        total: String(totalAmount),
        total_restocking_fee: totalRestockingFee.toString(),
        total_vat: total_vat.toString(),
        user: user?.id,
        store: store?.id,

        return_type: 1,
        product_sold_on: invoiceProducts.filter(prod =>
          selectedProductIds.includes(prod.id),
        ),
      })
    } else {
      toast.error('No store selected')
    }
  }

  const handleSubmitcreditmodal = () => {
    if (isUserAManager(user)) {
      onManagerApprove()
    } else {
      openManagerApprovalModal(1)
    }
  }

  const onManagerApprove = () => {
    handleSubmit()

    // if (isStoreSelected(store)) {
    //   const _defaults = defaultValues
    //     ? { ...defaultValues }
    //     : {}
    //   onSubmit({
    //     ..._defaults,
    //     customer: selectedCustomer.id,
    //     invoice_to: selectedInvoice?.invoice_to,
    //     deliver_to: selectedInvoice?.deliver_to,
    //     extra_notes: extra_notes,
    //     sale_quote: [],
    //     customer_reference:
    //       selectedInvoice?.invoice_reference || '', //referenceValue
    //     quote_reference: '',
    //     delivery: 0,
    //     store: store?.id,
    //   })
    // } else {
    //   toast.error('No store selected')
    // }
  }

  const handleclosecreditmodal = () => {
    closeConfirmCreditSubmitModal()
    setInvoiceProducts([])
  }

  const {
    modalData: productReturnsData,
    openModal: openProductReturnsModal,
    closeModal: closeProductReturnsModal,
    isModalOpen: productReturnsModalStatus,
  } = useModal<any>()

  const {
    openModal: openPreviewInvoiceModal,
    closeModal: closePreviewInvoiceModal,
    isModalOpen: previewInvoiceModalStatus,
  } = useModal<any>()

  const [paymentData, setPaymentData] = useState<
    IPayInfo[]
  >([
    {
      id: PayTypes.Cash,
      title: 'Cash',
      amount: 0,
    },
  ])

  /**
   *
   * watch for change in invoice
   *
   */
  useEffect(() => {
    if (selectedInvoice) {
      const _paymentMethods =
        getPaymentMethods(selectedInvoice)
      setInvoicePaymentOptions(_paymentMethods)

      setInvoiceProducts(
        selectedInvoice.sold_on_invoice.map(prod => {
          const _unit_price = numTo2dp(prod.unit_price)
          const _vat = numTo2dp(prod.vat)

          const max_quantity = Math.max(
            (prod.quantity_sold || 0) -
              prod.products_returned,
            0,
          )

          return {
            id: prod.id,
            sku: prod.sku,
            alternate_sku: prod.alternate_sku,
            product_name: prod.product_name,
            product_note: prod.product_note,
            not_returnable:
              prod.products_returned === prod.quantity_sold,

            max_quantity,
            quantity: max_quantity,
            invoice_position: prod.invoice_position,
            return_date: formatDate(
              new Date().toString(),
              'yyyy-MM-dd',
            ),
            discount: 0, //not in ProductSoldOn
            return_price:
              _unit_price + calculateVAT(_unit_price),
            unit_price: _unit_price,
            vat: _vat,
            restocking_fee: 0,
            product: prod.product,
            faulty: false,
            floor: '',
            section: '',
            product_delivery_status:
              prod.product_delivery_status,
            delivery_mode: prod.delivery_mode,
            quantity_delivered: prod.quantity_delivered,
            quantity_pending:
              prod.quantity_sold -
              prod.quantity_delivered -
              prod.products_returned,
          }
        }),
      )

      setSelectedCustomer(selectedInvoice.customer)
    }
  }, [selectedInvoice])

  /**
   *
   * Calculate Credit Note Totals
   *
   *
   */
  const getRestockingTotal = () =>
    invoiceProducts.reduce(
      (_total, curr) => _total + curr.restocking_fee,
      0,
    )
  const calculateInvoiceTotal = (products?: any[]) => {
    const _products = invoiceProducts.filter(prod =>
      selectedProductIds.includes(prod.id),
    )

    return (products || _products)
      .map(
        prod =>
          (Number(prod.unit_price) + Number(prod.vat)) *
            Number(prod.quantity) -
          (Number(prod.discount) +
            (prod.restocking_fee || 0)),
      )
      .reduce((_total, curr) => _total + curr, 0)
  }

  const getRefundTotal = () => {
    if (selectedInvoice) {
      const _invoicePaidTotal =
        getInvoicePaidAmount(selectedInvoice)

      return (
        Math.min(
          calculateInvoiceTotal(),
          _invoicePaidTotal,
        ) - getRestockingTotal()
      )
    }
  }

  useEffect(() => {
    const restocking_feeTotal = invoiceProducts.reduce(
      (_total, curr) => _total + curr.restocking_fee,
      0,
    )
    if (selectedInvoice) {
      const _invoicePaidTotal =
        getInvoicePaidAmount(selectedInvoice)

      const _selectedProducts = invoiceProducts.filter(
        prod => selectedProductIds.includes(prod.id),
      )
      const _selectedProductsTotal = calculateInvoiceTotal(
        _selectedProducts,
      )

      const _netAmount = _selectedProductsTotal / 1.2

      setCreditNoteTotals({
        invoiceTotal: selectedInvoice.total,
        invoicePaidAmount: _invoicePaidTotal,
        restockingFee: restocking_feeTotal,
        netAmount: _netAmount,
        vatAmount: _selectedProductsTotal - _netAmount,
        total: _selectedProductsTotal,
        refundTotal: getRefundTotal() || 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceProducts, selectedInvoice, selectedProductIds])

  useEffect(() => {
    if (window) {
      const addReturnInfo =
        window.localStorage.getItem('addReturn')
      window.localStorage.removeItem('addReturn')

      if (addReturnInfo) {
        const addReturnInfoParsed =
          JSON.parse(addReturnInfo)
        if (addReturnInfoParsed) {
          setSearchTerm(addReturnInfoParsed.invoiceId)
          setSelectedInvoiceId(
            addReturnInfoParsed.invoiceId,
          )
          setSelectedInvoice(addReturnInfoParsed.invoice)
        }
      }
    }
  }, [])

  const [prevIds, setPrevIds] = useState([])
  const [updatedIds, setUpdatedIds] =
    useState<GridRowSelectionModel>([])

  const handleRowSelectionChange = (
    selectedIds: GridRowSelectionModel,
  ) => {
    const newUpdatedIds = selectedIds.includes(prevIds[0])
      ? selectedIds.filter((id: any) => id !== prevIds[0])
      : selectedIds

    setPrevIds(prevIds)
    setUpdatedIds(newUpdatedIds)
  }

  useEffect(() => {
    if (selectedProducts) {
      const selectedProductsData = updatedIds.map(id =>
        selectedProducts.find(
          product => product.id === Number(id),
        ),
      )
      setSelectedRows(selectedProductsData)
    }
  }, [selectedProducts, updatedIds, prevIds])

  useEffect(() => {
    if (invoiceProducts && invoiceProducts.length > 0) {
      const currentDate = new Date()
      const thirtyDaysAgo = new Date(currentDate)
      thirtyDaysAgo.setDate(currentDate.getDate() - 30)

      const holdDate = new Date(
        invoiceProducts[0].hold_date,
      )

      if (holdDate < thirtyDaysAgo) {
        openConfirmCreditSubmitModal(1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceProducts])

  useEffect(() => {
    if (!isChecked) {
      if (
        selectedRows !== undefined &&
        selectedRows.length > 0
      ) {
        const calculatedProductTotal = selectedRows.reduce(
          (accumulator, product) =>
            accumulator +
            parseFloat(product.vatInc) * product.quantity -
            product.restocking_fee,
          0,
        )
        if (
          selectedRows[0].payable < calculatedProductTotal
        ) {
          const payabledata = selectedRows[0].payable
          setTotal(payabledata)
        } else {
          setTotal(calculatedProductTotal.toFixed(2))
        }
      } else {
        // Handle the case when products is undefined or empty
        setTotal(0.0)
      }
    } else {
      setTotal(enteredValue)
    }
  }, [selectedRows, isChecked, enteredValue])

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Credit Note', to: '/credit-notes' },
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
              onClick={() => openPreviewInvoiceModal(1)}
            >
              Preview
            </Button>
            <Button
              variant='contained'
              onClick={() => openConfirmSubmitModal(1)}
            >
              Save Credit Note
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
          <Grid item md={4} sm={4} xs={12}>
            <Card>
              <CustomerDetailsCard
                selectedCustomer={selectedCustomer}
                invoiceNo={selectedInvoice?.invoice_number}
                showPriceBand={false}
                selectBtn={false}
                referenceValue={customerRef}
                setReferenceValue={setCustomerRef}
              />
            </Card>
          </Grid>

          <Grid
            item
            md={4}
            sm={4}
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
                    Invoice Payment Adjustment
                  </Typography>
                </Box>
                <Checkbox
                  color='primary'
                  size='small'
                  checked={isChecked}
                  onChange={(e: any) =>
                    setChecked(e.target.checked)
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  px: 5,
                  pt: 2,
                }}
              >
                <CustomTextField
                  multiline
                  minRows={6}
                  value={enteredReason}
                  fullWidth
                  disabled={!isChecked}
                  placeholder='Reason for Adjustment'
                  onChange={(e: any) =>
                    setEnteredReason(e.target.value)
                  }
                />

                <CustomTextField
                  placeholder='£2'
                  fullWidth
                  type='number'
                  disabled={!isChecked}
                  value={enteredValue}
                  onChange={(e: any) =>
                    setEnteredValue(Number(e.target.value))
                  }
                />
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            md={4}
            sm={4}
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
                  multiline
                  minRows={6}
                  fullWidth
                  value={extra_notes}
                  placeholder={'Extra notes'}
                  onChange={(e: any) =>
                    setExtra_notes(e.target.value)
                  }
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 6, px: 2, py: 3 }}>
          <InvoicesDropdown
            value={selectedInvoiceId}
            options={invoices?.results || []}
            onSelect={(_invoiceId, _invoice) => {
              setSelectedInvoice(_invoice)
              setSelectedInvoiceId(_invoiceId)
            }}
            onSearch={_searchTerm => {
              setSearchTerm(_searchTerm)
            }}
          />

          <AppTable
            columns={columns}
            rows={invoiceProducts}
            showToolbar={false}
            showSearch={false}
            pagination={false}
            autoHeight
            checkboxSelection={!isChecked}
            rowSelectionModel={selectedProductIds}
            onRowSelectionModelChange={ids => {
              const selectedProductsData = ids.map(id =>
                invoiceProducts.find(
                  product => product.id === Number(id),
                ),
              )

              const returnableProducts =
                selectedProductsData.filter(
                  prod => !prod.not_returnable,
                )

              if (
                returnableProducts.length <
                selectedProductsData.length
              ) {
                toast.error(
                  'Some products were already returned',
                )
              }

              setSelectedProductIds(
                returnableProducts.map(prod => prod.id),
              )

              setSelectedProducts(returnableProducts)
              handleRowSelectionChange(
                returnableProducts.map(prod => prod.id),
              )
            }}
          />
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
              customercredit={Number(
                selectedCustomer.currentCredit,
              )}
              total={creditNoteTotals.refundTotal}
              paymentData={paymentData}
              onChange={values => setPaymentData(values)}
              allowedOptions={[
                ...invoicePaymentOptions.map(opt => opt.id),
                PayTypes.Credit,
              ]}
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
            <CreditNoteInvoiceTotalCard
              title='Credit Note Total'
              products={selectedRows}
              selectedproducts={invoiceProducts}
              checked={isChecked}
              adjustmentamount={enteredValue}
              paymentMethods={
                getPaymentMethodsStr(
                  invoicePaymentOptions,
                ) || 'Credit'
              }
              creditNoteTotals={creditNoteTotals}
            />
          </Grid>
        </Grid>
      </PageContainer>

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={onManagerApprove}
      />

      <CreditModal
        open={confirmSubmitCreditModalStatus()}
        handleClose={closeConfirmCreditSubmitModal}
        maxWidth={400}
        title={`Invoice Over Return Period`}
        content={
          'The invoice is over the 30 day return period. Would you like to request manager approval and proceed with the transaction?'
        }
        confirmTitle={defaultValues ? 'Yes' : 'Yes'}
        onConfirm={handleSubmitcreditmodal}
        rejectTitle='No'
        onReject={handleclosecreditmodal}
      />

      <ConfirmationModal
        open={confirmSubmitModalStatus()}
        handleClose={closeConfirmSubmitModal}
        maxWidth={400}
        title={`${
          defaultValues ? 'Edit' : 'Create'
        } Credit Note`}
        content={`Are you sure you want to refund ${getConfirmationMessage(
          getInvoiceAmountDue(),
          paymentData,
          isCashCustomer(selectedCustomer),
        )} back to the customers account?`}
        confirmTitle={defaultValues ? 'Edit' : 'Create'}
        onConfirm={handleSubmit}
        rejectTitle='Cancel'
        onReject={closeConfirmSubmitModal}
      />
      <AppModal
        maxWidth={900}
        open={previewInvoiceModalStatus()}
        handleClose={closePreviewInvoiceModal}
        sx={{ p: 0 }}
      >
        <CreditNotePreviewCard
          title='Credit Note'
          invoiceInfo={{
            'Credit Note Date': dateToString(
              new Date(),
              'dd/MM/yyyy',
            ),
            'Customer No.': selectedCustomer.id.toString(),
            'Invoice No':
              selectedInvoice?.invoice_number || '',
            'Customer Ref': customerRef || '',
            'Raised By': getFullName(user),
          }}
          invoice={selectedInvoice || undefined}
          products={(invoiceProducts || [])
            .filter(prod =>
              selectedProductIds.includes(prod.id),
            )
            .map(prod => ({
              ...prod,
              restocking_fee: prod.restocking_fee || 0,

              total:
                (Number(prod.unit_price) -
                  (Number(prod.discount) || 0) +
                  Number(prod.vat)) *
                  Number(prod.quantity) -
                -(prod.restocking_fee || 0),
            }))}
          refundMethod={
            getPaymentMethodsStr(
              paymentData.filter(pay => pay.amount > 0),
            ) || 'To Pay'
          }
          paymentData={paymentData}
          notes={extra_notes}
        />
      </AppModal>

      <ProductReturnsModal
        products={productReturnsData || []}
        open={productReturnsModalStatus()}
        handleClose={closeProductReturnsModal}
        onSubmit={products => completeCreation(products)}
      />
    </>
  )
}

export default CreditNotesForm
