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

import CustomTextField from 'src/@core/components/mui/text-field'
import PageContainer from 'src/components/global/PageContainer'
import { useAppSelector } from 'src/store/hooks'
import { useModal } from 'src/hooks/useModal'
import {
  calculateVAT,
  excludeVAT,
  getFullName,
  getInvoiceTotalDiscount,
  numTo2dp,
} from 'src/utils/dataUtils'
import SelectInvoiceAddressModal from 'src/components/invoices/SelectInvoiceAddressModal'
import SelectDeliveryAddressModal from 'src/components/invoices/SelectDeliveryAddressModal'
import InvoiceTotalCard from 'src/components/invoices/InvoiceTotalCard'
import ConfirmationModal from '../global/ConfirmationModal'
import {
  ISaleInvoice,
  ISaleInvoiceNew,
  ISaleInvoiceUpdate,
  ProductDeliveryMode,
} from 'src/models/ISaleInvoice'
import { useGetCustomersQuery } from 'src/store/apis/customersSlice'
import { ICustomer } from 'src/models/ICustomer'
import { useAuth } from 'src/hooks/useAuth'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'

import AddPaymentCard from './AddPaymentCard'
import { buildUrl } from 'src/utils/routeUtils'
import { ISaleProduct } from 'src/models/IProduct'
import { isCashCustomer } from 'src/utils/customers.util'
import ManagerApprovalModal from '../global/Modals/ManagerApprovalModal'
import FallbackSpinner from 'src/@core/components/spinner'
import AppModal from '../global/AppModal'
import PreviewCard from '../global/PreviewCard'
import { dateToString } from 'src/utils/dateUtils'
import ProductsDropdownWrapper from '../global/Dropdowns/ProductsDropdownWrapper'
import CustomerDetailsCard from '../global/CustomerDetailsCard'
import {
  getItemToInvoice,
  getPaymentMethods,
  getPaymentMethodsStr,
  getQuoteToInvoiceFromView,
  getQuoteToInvoiceInfo,
} from 'src/utils/invoicesUtils'
import {
  isStoreB2B,
  isStoreB2C,
  isStoreSelected,
} from 'src/utils/storeUtils'
import { convertPriceband } from 'src/utils/productUtils'
import useCalculateTransactionTotals from 'src/hooks/global/useCalculateTransactionTotals'
import AddressEditCard from '../global/Sales/AddressEditCard'
import useGetDefaultCustomerAddresses from 'src/hooks/useGetDefaultCustomerAddresses'
import { isUserAManager } from 'src/utils/rolesUtils'
import useGetCustomerAddressInfo from 'src/hooks/useGetCustomerAddressInfo'
import { useRouter } from 'next/router'

interface Props {
  defaultValues?: ISaleInvoice
  onSubmit: (values: ISaleInvoiceNew) => void

  submitting?: boolean
}

const InvoiceForm = ({
  defaultValues,
  onSubmit,
  submitting,
}: Props) => {
  const isEditMode = () => Boolean(defaultValues)
  const [invoiceAddressUpdated, setInvoiceAddressUpdated] =
    useState(false)
  const [
    deliveryAddressUpdated,
    setDeliveryAddressUpdated,
  ] = useState(false)

  const { user } = useAuth()
  const { data: customers, isLoading: isCustomersLoading } =
    useGetCustomersQuery()

  const { store } = useAppSelector(state => state.app)

  const router = useRouter()

  /**
   *
   * Customer Info
   *
   */
  const [selectedCustomer, setSelectedCustomer] = useState<
    any | ICustomer
  >({
    id: 0,
    firstName: 'Cash',
    lastName: 'Customer',
  })

  const { getDefaultBilling, getDefaultShipping } =
    useGetDefaultCustomerAddresses({
      addresses: selectedCustomer?.addresses || [],
    })
  const { getAddressStr } = useGetCustomerAddressInfo(
    selectedCustomer?.addresses || [],
  )

  const [
    cashCustomerInvoiceAddress,
    setCashCustomerInvoiceAddress,
  ] = useState('')
  const [
    cashCustomerDeliveryAddress,
    setCashCustomerDeliveryAddress,
  ] = useState('')
  const [referenceValue, setReferenceValue] = useState('')

  /**
   *
   * Invoice Address
   *
   */
  const [selectedAddress, setSelectedAddress] = useState(0)
  const {
    openModal: openInvoiceAddressModal,
    closeModal: closeInvoiceAddressModal,
    isModalOpen: invoiceAddressModalStatus,
  } = useModal<number>()

  /**
   *
   * Delivery Address Info
   *
   */
  const [deliveryAddress, setDeliveryAddress] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)

  const {
    openModal: openDeliveryAddressModal,
    closeModal: closeDeliveryAddressModal,
    isModalOpen: deliveryAddressModalStatus,
  } = useModal<number>()

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const [customerNotes, setCustomerNotes] = useState('')

  const [selectedProducts, setSelectedProducts] = useState<
    any[]
  >([])
  const [invoiceProducts, setInvoiceProducts] = useState<
    any[]
  >([])

  const getDiscount = (products: ISaleProduct[]) =>
    getInvoiceTotalDiscount(products || [])

  const [paymentData, setPaymentData] = useState<
    IPayInfo[]
  >([
    {
      id: PayTypes.Cash,
      title: 'Cash',
      amount: 0,
    },
  ])

  const [isProductPickerLocked, setIsProductPickerLocked] =
    useState(false)

  const [saleOrderId, setSaleOrderId] = useState<
    number | null
  >(null)

  const switchCustomer = useCallback(
    (customer: ICustomer) => {
      setSelectedAddress(
        getDefaultBilling(customer.addresses)?.id,
      )
      setDeliveryAddress(
        getDefaultShipping(customer.addresses)?.id,
      )

      setSelectedCustomer(customer)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const {
    openModal: openPreviewInvoiceModal,
    closeModal: closePreviewInvoiceModal,
    isModalOpen: previewInvoiceModalStatus,
  } = useModal<any>()

  const {
    openModal: openConfirmSubmitModal,
    closeModal: closeConfirmSubmitModal,
    isModalOpen: confirmSubmitModalStatus,
  } = useModal<number>()

  const initiateSubmit = () => {
    if (selectedProducts.length === 0) {
      toast.error('Select a product')

      return
    }

    //check if any product has price band "A" or "Band_A"
    const priceBandAExists = invoiceProducts
      .map((prod: any) => {
        return {
          ...prod,
          sold_price:
            Number(prod.base_price) +
            calculateVAT(prod.base_price),
          invoice_position: prod.position,
          quantity_sold: prod.quantity,
          sold_price_band: prod.price_band,
          vat: calculateVAT(prod.base_price),
          sold_date: dateToString(new Date(), 'yyyy-MM-dd'),
          to_be_ordered: prod.ordered,
          total:
            (Number(prod.base_price) +
              calculateVAT(prod.base_price)) *
              prod.quantity -
            prod.discount * prod.quantity,
          _stock: prod._stock,
        }
      })
      .findIndex(
        product =>
          product.sold_price_band.toLowerCase() === 'a' ||
          product.sold_price_band.toLowerCase() ===
            'band_a',
      )

    if (user) {
      if (priceBandAExists !== -1 && isUserAManager(user)) {
        openManagerApprovalModal(1)
      } else {
        handleSubmit(invoiceProducts)
      }
    } else {
      toast.error('User not selected.')
    }
  }

  const getPaymentOptions = () => {
    const paid_from_cash =
      paymentData.find(pay => pay.id === PayTypes.Cash)
        ?.amount || 0
    const paid_from_card =
      paymentData.find(pay => pay.id === PayTypes.Card)
        ?.amount || 0
    const paid_from_bacs =
      paymentData.find(pay => pay.id === PayTypes.BACS)
        ?.amount || 0
    const paid_from_credit =
      paymentData.find(pay => pay.id === PayTypes.Credit)
        ?.amount || 0

    return {
      paid_from_cash,
      paid_from_card,
      paid_from_bacs,
      paid_from_credit,
    }
  }

  const getPaidAmount = (paymentOptions: any) => {
    return (
      paymentOptions.paid_from_cash +
      paymentOptions.paid_from_card +
      paymentOptions.paid_from_bacs +
      paymentOptions.paid_from_credit
    )
  }

  const invoiceTotals = useCalculateTransactionTotals({
    products: invoiceProducts,
    deliveryCost,
    paymentMade: getPaidAmount(getPaymentOptions()),
  })

  const calculateTotal = (
    products: any[],
    deliveryCost: number,
  ) => {
    return products.reduce(
      (sum, product) => sum + (product?.total || 0),
      deliveryCost,
    )
  }

  const convertProductsList = (products: any) => {
    const _invoiceProducts = products.map((prod: any) => {
      return {
        ...prod,
        sold_price:
          Number(prod.base_price) +
          calculateVAT(prod.base_price),
        invoice_position: prod.position,
        quantity_sold: prod.quantity,
        sold_price_band: convertPriceband(prod.price_band),
        vat: calculateVAT(prod.base_price),
        sold_date: dateToString(new Date(), 'yyyy-MM-dd'),
        to_be_ordered: prod.ordered,

        // transfer_stock: prod.transfer_stock,
        total:
          (Number(prod.base_price) +
            calculateVAT(prod.base_price)) *
            prod.quantity -
          prod.discount * prod.quantity,
        _stock: prod._stock,
      }
    })

    setSelectedProducts(products)
    setInvoiceProducts(_invoiceProducts)
  }

  const getProductDeliveryStatus = (prod: any) => {
    if (
      prod.delivery_mode ===
        ProductDeliveryMode.COLLECTED ||
      prod.delivery_mode ===
        ProductDeliveryMode.SUPPLIERDELIVERY
    ) {
      return 'completed'
    }

    return 'pending'
  }

  const convertToQuote = () => {
    const data = {
      customer: selectedCustomer,
      invoice_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : selectedAddress,
      deliver_to: isCashCustomer(selectedCustomer)
        ? cashCustomerDeliveryAddress
        : deliveryAddress,
      extra_notes: customerNotes,
      customer_reference: referenceValue, //referenceValue
      delivery: deliveryCost,
      products: selectedProducts,
      from: 'invoice',
    }

    localStorage.setItem(
      'invoiceToQuote',
      JSON.stringify(data),
    )

    router.push('/quotes/new')
  }

  const handleSubmit = (products: any[] = []) => {
    const total_vat = products.reduce(
      (sum, _product) =>
        sum + calculateVAT(_product.unit_price),
      0,
    )

    const invoiceTotal = numTo2dp(
      calculateTotal(products, deliveryCost),
    )

    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity_sold,
      0,
    )

    const total_discount = products.reduce(
      (sum, product) =>
        sum + product.quantity_sold * product.discount,
      0,
    )

    const payment = getPaidAmount(getPaymentOptions())

    const {
      paid_from_bacs,
      paid_from_card,
      paid_from_cash,
      paid_from_credit,
    } = getPaymentOptions()

    // payable - amount remaining
    const payable = numTo2dp(invoiceTotal - payment)

    //check new customer credit
    if (
      selectedCustomer.currentCredit - paid_from_credit <
      0
    ) {
      toast.error(
        'Credit amount used exceeds remaining credit',
      )

      return
    }

    if (isCashCustomer(selectedCustomer) && payable != 0) {
      toast.error(
        'The invoice has not been fully paid, due amount still outstanding',
      )

      return
    }

    //check "invoice_to" address for an acc customer
    if (!Boolean(selectedAddress)) {
      toast.error(
        'Invoice address is required to create the invoice',
      )

      return
    }

    if (!isStoreSelected(store)) {
      toast.error('Store is not selected')

      return
    } else {
      const _products = products.map(
        ({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          price,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          price_band,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _stock,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          quantity,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          base_price,
          ...rest
        }) => rest,
      )

      if (user) {
        if (!isEditMode()) {
          onSubmit({
            payment,
            total: invoiceTotal,
            quantity: totalQuantity,
            extra_notes: customerNotes,
            deleted: false,

            payment_type: 1,
            transaction_type: 'invoice',
            user: user.id,
            customer: selectedCustomer.id,
            invoice_to: isCashCustomer(selectedCustomer)
              ? cashCustomerInvoiceAddress
              : getAddressStr(selectedAddress),
            deliver_to: isCashCustomer(selectedCustomer)
              ? cashCustomerInvoiceAddress
              : getAddressStr(deliveryAddress),

            is_direct_delivery: false, //????

            // delivery_status: 'pending', //????
            invoice_status:
              payable === 0
                ? 'paid'
                : payable < invoiceTotal
                ? 'partial'
                : 'pending', //????

            paid_from_cash,
            paid_from_card,
            paid_from_bacs,
            paid_from_credit,

            total_discount,
            total_delivery: deliveryCost,
            total_vat,

            invoice_reference: referenceValue,
            payable,
            cash: paid_from_cash,
            card: paid_from_card,
            store: store.id,

            products: _products.map(prod => ({
              ...prod,
              to_be_ordered: prod?.to_be_ordered || false,
              product_delivery_status:
                getProductDeliveryStatus(prod),
            })),

            sale_order: saleOrderId,
          })
        } else {
          if (defaultValues) {
            const originalPayment = getPaymentMethods(
              defaultValues,
            ).reduce(
              (total, curr) => total + curr.amount,
              0,
            )

            if (payment !== originalPayment) {
              toast.error(
                'The total paid amount should be the same',
              )
            } else {
              onSubmit({
                paid_from_cash,
                paid_from_card,
                paid_from_bacs,
                paid_from_credit,

                invoice_to: isCashCustomer(selectedCustomer)
                  ? cashCustomerInvoiceAddress
                  : getAddressStr(selectedAddress),
                deliver_to: isCashCustomer(selectedCustomer)
                  ? cashCustomerInvoiceAddress
                  : getAddressStr(deliveryAddress),
              } as ISaleInvoiceUpdate)
            }
          }
        }
      }
    }
  }

  const prefillData = useCallback(
    (newCustomerId?: number) => {
      if (defaultValues) {
        switchCustomer(defaultValues.customer)
        if (isCashCustomer(defaultValues.customer)) {
          setCashCustomerInvoiceAddress(
            defaultValues.invoice_to?.toString() || '',
          )
          setCashCustomerDeliveryAddress(
            defaultValues.deliver_to?.toString() || '',
          )
        } else {
          //invoiceAddress
          setSelectedAddress(
            Number(defaultValues.invoice_to),
          )

          //deliveryAddress
          setDeliveryAddress(
            Number(defaultValues.deliver_to),
          )
        }

        //payment_options
        const _paymentData =
          getPaymentMethods(defaultValues)

        if (_paymentData.length > 0)
          setPaymentData(_paymentData)

        //products
        setSelectedProducts(
          defaultValues.sold_on_invoice.map(product => ({
            id: product.id,
            sku: product.sku,
            alternate_sku: product.alternate_sku,
            product_name: product.product_name,
            product_note: '',
            percentage_margin: 0,
            sold_price_band: product.sold_price_band,
            discount: Number(product.discount),
            profit_margin: 0,
            quantity_sold: product.quantity_sold,
            quantity_delivered: 0,
            invoice_position: product.invoice_position,

            price_band: product.sold_price_band,
            position: product.invoice_position,
            base_price: Number(product.unit_price),
            quantity: product.quantity_sold,

            sold_price: Number(product.unit_price),
            unit_price: Number(product.unit_price),
            average_unit_price: Number(product.unit_price),
            vat: Number(product.vat),
            total:
              product.quantity_sold *
              Number(product.unit_price),
            product_price: [], // TODO: Update this to actual values
            product_stock: [], // TODO: Update this to actual values
            to_be_ordered: product.to_be_ordered || false,
            sold_date: product.sold_date,
          })),
        )

        setCustomerNotes(defaultValues?.extra_notes || '')
        setReferenceValue(
          defaultValues?.invoice_reference || '',
        )
      } else {
        if (
          Number(newCustomerId) === 0 &&
          !isStoreB2B(store)
        ) {
          const cashCustomer = (
            customers ? customers.results : []
          ).find(customer => isCashCustomer(customer))

          if (cashCustomer) {
            switchCustomer(cashCustomer)
          } else {
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers, defaultValues],
  )

  useEffect(() => {
    getQuoteToInvoiceFromView(
      quoteInfo => {
        if (quoteInfo?.customer) {
          switchCustomer(quoteInfo.customer)
        }

        setCustomerNotes(quoteInfo?.extra_notes || '')
        setSelectedProducts(quoteInfo?.products || [])
        setReferenceValue(
          quoteInfo?.customer_reference || '',
        )
        setDeliveryCost(quoteInfo?.delivery || 0)
      },
      () => prefillData(selectedCustomer?.id),
    )

    // Check for quoteToInvoice data
    getQuoteToInvoiceInfo(
      quoteInfo => {
        if (quoteInfo?.customer) {
          switchCustomer(quoteInfo.customer)
        }

        setCustomerNotes(quoteInfo?.extra_notes || '')
        setSelectedProducts(quoteInfo?.products || [])
        setReferenceValue(quoteInfo?.quote_reference || '')
        setDeliveryCost(quoteInfo?.delivery || 0)
      },
      () => prefillData(selectedCustomer?.id),
    )

    getItemToInvoice(
      itemInfo => {
        if (itemInfo?.customer) {
          switchCustomer(itemInfo.customer)
        }
        if (itemInfo?.from === 'order') {
          setIsProductPickerLocked(true)
          setSaleOrderId(itemInfo?.orderId || null)
        }

        setCustomerNotes(itemInfo?.extra_notes || '')
        setSelectedProducts(itemInfo?.products || [])
        setReferenceValue(
          itemInfo?.customer_reference || '',
        )
        setDeliveryCost(itemInfo?.delivery || 0)
      },
      () => prefillData(selectedCustomer?.id),
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers])

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Sales Invoice',
            to: buildUrl('invoices'),
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
              onClick={() => openPreviewInvoiceModal(1)}
            >
              Preview
            </Button>

            {isStoreB2C(store) && (
              <Button
                variant='contained'
                onClick={convertToQuote}
              >
                Convert To Quote
              </Button>
            )}

            <Button
              variant='contained'
              disabled={submitting}
              onClick={() => openConfirmSubmitModal(1)}
            >
              Save Invoice
            </Button>
          </Box>
        }
      >
        {isCustomersLoading ? (
          <FallbackSpinner brief />
        ) : (
          <>
            <Grid container columns={12} spacing={6}>
              <Grid item md={4} sm={6} xs={12}>
                <CustomerDetailsCard
                  selectBtn={!isEditMode() && !saleOrderId}
                  readOnly={isEditMode()}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={(newCustomer: any) =>
                    switchCustomer(newCustomer)
                  }
                  referenceValue={referenceValue}
                  setReferenceValue={setReferenceValue}
                />
              </Grid>

              <Grid
                item
                md={4}
                sm={6}
                xs={12}
                sx={{ display: 'flex' }}
              >
                <AddressEditCard
                  customer={selectedCustomer}
                  title='Invoice To'
                  icon='tabler:user'
                  buttonIcon='tabler:map'
                  openSelectModal={() => {
                    openInvoiceAddressModal(1)
                    setInvoiceAddressUpdated(true)
                  }}
                  overrideAddressStr={
                    defaultValues
                      ? invoiceAddressUpdated
                        ? undefined
                        : String(defaultValues?.invoice_to)
                      : undefined
                  }
                  addressId={selectedAddress}
                  cashCustomerValue={
                    cashCustomerInvoiceAddress
                  }
                  onCashCustomerValueChange={val =>
                    setCashCustomerInvoiceAddress(val)
                  }
                />
              </Grid>

              <Grid
                item
                md={4}
                sm={6}
                xs={12}
                sx={{ display: 'flex' }}
              >
                <AddressEditCard
                  customer={selectedCustomer}
                  title='Deliver To'
                  icon='tabler:user'
                  buttonIcon='tabler:truck-delivery'
                  openSelectModal={() => {
                    openDeliveryAddressModal(1)
                    setDeliveryAddressUpdated(true)
                  }}
                  addressId={deliveryAddress}
                  cashCustomerValue={
                    cashCustomerDeliveryAddress
                  }
                  overrideAddressStr={
                    defaultValues
                      ? deliveryAddressUpdated
                        ? undefined
                        : String(defaultValues?.deliver_to)
                      : undefined
                  }
                  onCashCustomerValueChange={val =>
                    setCashCustomerDeliveryAddress(val)
                  }
                  isDelivery
                  deliveryCost={deliveryCost}
                  updateDeliveryCost={setDeliveryCost}
                />
              </Grid>
            </Grid>

            <ProductsDropdownWrapper
              readOnly={
                isEditMode() || isProductPickerLocked
              }
              defaultProducts={selectedProducts}
              selectedCustomer={selectedCustomer}
              setProduct={(newProducts: any[]) =>
                convertProductsList(newProducts)
              }
              status
              toOrder
              toTransfer
              default_delivery_mode='collected'
            />

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
                  overrideAmountDue={
                    invoiceTotals.amountDue
                  }
                  total={invoiceTotals.amountDue}
                  customercredit={
                    selectedCustomer.currentCredit
                  }
                  paymentData={paymentData}
                  onChange={values =>
                    setPaymentData(values)
                  }
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
                <InvoiceTotalCard
                  title='Invoice Total'
                  products={selectedProducts}
                  discount={getDiscount(selectedProducts)}
                  delivery={deliveryCost}
                />
              </Grid>
            </Grid>
            <Card
              sx={{
                mt: 6,
                p: 4,
                px: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: 1,
              }}
            >
              <Typography variant='h5' fontWeight={600}>
                Customer Notes
              </Typography>

              <Box>
                <CustomTextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder='Customer notes'
                  InputProps={{ readOnly: isEditMode() }}
                  value={customerNotes}
                  onChange={e =>
                    setCustomerNotes(e.target.value)
                  }
                />
              </Box>
            </Card>
          </>
        )}
      </PageContainer>

      <SelectInvoiceAddressModal
        selectedAddress={selectedAddress}
        open={invoiceAddressModalStatus()}
        handleClose={closeInvoiceAddressModal}
        customerInfo={{
          'Customer Name': getFullName(selectedCustomer),
          'Customer ID': isCashCustomer(selectedCustomer)
            ? 'N/A'
            : selectedCustomer.id,
        }}
        onSubmit={id => setSelectedAddress(id)}
      />

      <SelectDeliveryAddressModal
        selectedAddress={deliveryAddress}
        open={deliveryAddressModalStatus()}
        handleClose={closeDeliveryAddressModal}
        customerInfo={{
          'Customer Name': getFullName(selectedCustomer),
          'Customer ID': isCashCustomer(selectedCustomer)
            ? 'N/A'
            : selectedCustomer.id,
        }}
        onSubmit={({ id, deliveryCost: dCost }) => {
          setDeliveryAddress(id)
          setDeliveryCost(dCost)
        }}
        delivery={deliveryCost}
      />

      <ConfirmationModal
        open={confirmSubmitModalStatus()}
        handleClose={closeConfirmSubmitModal}
        maxWidth={400}
        title={`${
          defaultValues ? 'Edit' : 'Create'
        } Invoice`}
        content={`Are you sure you want to ${
          defaultValues ? 'edit' : 'create'
        }  this invoice?`}
        confirmTitle={defaultValues ? 'Edit' : 'Create'}
        onConfirm={initiateSubmit}
        rejectTitle='Cancel'
        onReject={closeConfirmSubmitModal}
      />

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={() => handleSubmit(invoiceProducts)}
      />

      <AppModal
        maxWidth={900}
        open={previewInvoiceModalStatus()}
        handleClose={closePreviewInvoiceModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          title={
            'Invoice ' +
            (defaultValues
              ? defaultValues?.invoice_number
              : '')
          }
          invoiceInfo={{
            'Invoice Date': dateToString(
              new Date(),
              'dd/MM/yyyy',
            ),
            'Invoice Time': dateToString(
              new Date(),
              'HH:mm',
            ),
            'Customer No.': selectedCustomer.id,
            'Customer Ref': referenceValue,
            'Raised By': getFullName(user),
          }}
          delivery={deliveryCost}
          discount={getInvoiceTotalDiscount(
            selectedProducts,
          )}
          paymentInfo={
            getPaymentMethodsStr(
              paymentData.filter(pay => pay.amount > 0),
            ) || 'To Pay'
          }
          customerInfo={selectedCustomer}
          invoiceAddress={
            isCashCustomer(selectedCustomer)
              ? cashCustomerInvoiceAddress
              : getAddressStr(selectedAddress)
          }
          deliveryAddress={
            isCashCustomer(selectedCustomer)
              ? cashCustomerDeliveryAddress
              : getAddressStr(deliveryAddress)
          }
          products={selectedProducts.map(p => ({
            ...p,
            quantity_sold: p.quantity,
            total: excludeVAT(
              numTo2dp(
                (Number(p.base_price) +
                  calculateVAT(p.base_price)) *
                  p.quantity -
                  p.discount * p.quantity,
              ),
            ),
          }))}
          invoiceTotals={{
            ...invoiceTotals,
            netTotal: invoiceTotals.netAmount,
          }}
          notes={customerNotes}
        />
      </AppModal>
    </>
  )
}

export default InvoiceForm
