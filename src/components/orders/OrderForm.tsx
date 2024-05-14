// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useRouter } from 'next/router'
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
import {
  addVAT,
  excludeVAT,
  includeVAT,
  numTo2dp,
} from 'src/utils/dataUtils'
import { isCashCustomer } from 'src/utils/customers.util'
import { IPayInfo, PayTypes } from 'src/types/IPayInfo'
import CustomTextField from 'src/@core/components/mui/text-field'
import PageContainer from 'src/components/global/PageContainer'
import ProductsDropdownWrapper from '../global/Dropdowns/ProductsDropdownWrapper'
import { useAppSelector } from 'src/store/hooks'
import { useModal } from 'src/hooks/useModal'
import { dateToString } from 'src/utils/dateUtils'
import { getFullName } from 'src/utils/dataUtils'
import SelectInvoiceAddressModal from 'src/components/invoices/SelectInvoiceAddressModal'
import SelectDeliveryAddressModal from 'src/components/invoices/SelectDeliveryAddressModal'
import CustomerDetailsCard from '../global/CustomerDetailsCard'
import InvoiceTotalCard from 'src/components/invoices/InvoiceTotalCard'
import ConfirmationModal from '../global/ConfirmationModal'
import { IOrder } from 'src/@fake-db/orders'
import { IData } from 'src/utils/types'
import { isIdValid } from 'src/utils/routerUtils'
import { useGetCustomersQuery } from 'src/store/apis/customersSlice'
import { getQuoteToOrderInfo } from 'src/utils/ordersUtils'
import { getPaymentMethods } from 'src/utils/invoicesUtils'
import AddressEditCard from '../global/Sales/AddressEditCard'
import useGetDefaultCustomerAddresses from 'src/hooks/useGetDefaultCustomerAddresses'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import PreviewCard from '../global/PreviewCard'
import AppModal from '../global/AppModal'
import useCalculateTransactionTotals from 'src/hooks/global/useCalculateTransactionTotals'
import useGetCustomerAddressInfo from 'src/hooks/useGetCustomerAddressInfo'
import { ProductDeliveryMode } from 'src/models/ISaleInvoice'

interface Props {
  defaultValues?: IOrder
  onSubmit: (values: IData) => void
}

const OrderForm = ({ defaultValues, onSubmit }: Props) => {
  const [invoiceAddressUpdated, setInvoiceAddressUpdated] =
    useState(false)
  const [
    deliveryAddressUpdated,
    setDeliveryAddressUpdated,
  ] = useState(false)

  const router = useRouter()
  const id = isIdValid(router.query.id)

  const { user } = useAuth()
  const { store } = useAppSelector(state => state.app)

  const [customerNotes, setCustomerNotes] = useState('')
  const [selectedAddress, setSelectedAddress] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invoiceTotal, setInvoiceTotal] = useState(0)
  const [referenceValue, setReferenceValue] =
    useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<
    any[]
  >([])
  const [invoiceProducts, setInvoiceProducts] = useState<
    any[]
  >([])
  const [selectedCustomer, setSelectedCustomer] =
    useState<any>({
      id: 0,
      firstName: 'No Customer',
      lastName: 'Selected',
      accountType: 'cash',
      addresses: [
        {
          id: 0,
          customer: 0,
          fullName: '',
          country: '',
          city: '',
          addressType: 'billingAddress',
          addressLine1: '',
          addressLine2: '',
          postCode: '',
          deleted: false,
          isActive: true,
        },
        {
          id: 0,
          customer: 0,
          fullName: '',
          country: '',
          city: '',
          addressType: 'shippingAddress',
          addressLine1: '',
          addressLine2: '',
          postCode: '',
          deleted: false,
          isActive: true,
        },
      ],
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
  const [paymentData, setPaymentData] = useState<
    IPayInfo[]
  >([
    {
      id: PayTypes.Cash,
      title: 'Cash',
      amount: 0,
    },
  ])

  const {
    // modalData: selectCustomer,
    openModal: openInvoiceAddressModal,
    closeModal: closeInvoiceAddressModal,
    isModalOpen: invoiceAddressModalStatus,
  } = useModal<number>()
  const {
    // modalData: selectCustomer,
    openModal: openDeliveryAddressModal,
    closeModal: closeDeliveryAddressModal,
    isModalOpen: deliveryAddressModalStatus,
  } = useModal<number>()
  const {
    openModal: openPreviewOrderModal,
    closeModal: closePreviewOrderModal,
    isModalOpen: previewOrderModalStatus,
  } = useModal<any>()

  const {
    openModal: openConfirmSubmitModal,
    closeModal: closeConfirmSubmitModal,
    isModalOpen: confirmSubmitModalStatus,
  } = useModal<number>()

  const { data: customers } = useGetCustomersQuery()

  const { appDiscount } = useAppSelector(
    state => state.products,
  )

  // const totalsData = calculateGross(selectedProducts, {
  //   delivery: deliveryCost,
  //   discount: appDiscount,
  // })

  const orderTotals = useCalculateTransactionTotals({
    products: invoiceProducts,
    deliveryCost,
    paymentMade: 0,
  })

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

  const handleSubmit = () => {
    if (isCashCustomer(selectedCustomer)) {
      toast.error(
        'Orders can only be created for account customers, select a customer account',
      )

      return
    }

    const calculatedTotal = paymentData.reduce(
      (acc, payment) => acc + payment.amount,
      0,
    )

    const products = selectedProducts.map((prod: any) => {
      return {
        sku: prod.sku,
        alternate_sku: prod.alternate_sku,
        product_name: prod.product_name,
        product_note: prod.product_note,
        ordered_price_band: prod.price_band,
        hold_price_band: prod.price_band,
        quantity_hold: prod.quantity,
        hold_price: (prod.unit_price * 1.2).toFixed(2),
        delivery_mode: prod.delivery_mode,
        is_direct_delivery: false,
        product_delivery_status:
          getProductDeliveryStatus(prod),
        discount: prod.discount,
        product: prod.product,
        id: prod.id,
        vat: (prod.unit_price * 0.2).toFixed(2),

        // transfer_stock: prod.transfer_stock,
        to_be_ordered: prod.ordered,
        unit_price: prod.unit_price,
        hold_date: dateToString(new Date(), 'yyyy-MM-dd'),
      }
    })
    const totalProducts = products.map((prod: any) => {
      return {
        hold_price:
          prod.unit_price * prod.quantity_hold * 1.2,
        total_quantity: prod.quantity_hold,
        total_vat: prod.quantity_hold * prod.unit_price,
        discount: prod.discount * prod.quantity_hold,
      }
    })
    const totalHoldPrice = totalProducts.reduce(
      (total, product) => total + product.hold_price,
      0,
    )
    const totalQuantity = totalProducts.reduce(
      (total, product) => total + product.total_quantity,
      0,
    )

    const totalDiscount = totalProducts.reduce(
      (total, product) =>
        total + product.discount * product.total_quantity,
      0,
    )

    const totalVAT = totalProducts.reduce(
      (total, product) => total + product.total_vat,
      0,
    )
    const _defaults = defaultValues
      ? { ...defaultValues }
      : {}

    const total =
      totalHoldPrice + deliveryCost - totalDiscount
    const obj = {
      ..._defaults,
      store: defaultValues
        ? defaultValues?.store.id
        : store?.id,
      advance_payment: calculatedTotal,
      total: total.toFixed(2),
      total_quantity: totalQuantity,
      payable: (total - calculatedTotal).toFixed(2),

      paid_from_cash: 0,
      paid_from_card: 0,
      paid_from_bacs: 0,
      paid_from_credit: 0,
      total_discount: totalDiscount,
      total_delivery: deliveryCost,
      total_vat: (totalVAT * 0.2).toFixed(2),
      customer: selectedCustomer.id,
      invoice_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : getAddressStr(selectedAddress),
      deliver_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : getAddressStr(deliveryAddress),
      extra_notes: customerNotes,
      products: products,
      sale_order_track: products,
      order_reference: referenceValue,
      order_status: 'pending',

      // delivery_status: 'pending',
      is_direct_delivery: false,
      user: user?.id,
    }

    onSubmit(obj)
  }

  const itemToQuote = () => {
    const data = {
      customer: selectedCustomer,
      invoice_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : selectedAddress,
      deliver_to: isCashCustomer(selectedCustomer)
        ? cashCustomerDeliveryAddress
        : deliveryAddress,
      extra_notes: customerNotes,
      customer_reference: Number(referenceValue), //referenceValue
      delivery: deliveryCost,
      products: selectedProducts,
      from: 'order',
    }

    localStorage.setItem(
      'orderToQuote',
      JSON.stringify(data),
    )

    router.push('/quotes/new')
  }

  const prefillData = useCallback(() => {
    if (defaultValues) {
      //prefill data for edit
      setReferenceValue(
        defaultValues?.order_reference || '',
      )
      setDeliveryCost(Number(defaultValues.total_delivery))
      setCustomerNotes(defaultValues?.extra_notes)
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
        setSelectedAddress(defaultValues.invoice_to)

        //deliveryAddress
        setDeliveryAddress(defaultValues.deliver_to)
      }

      //payment_options
      const _paymentData = getPaymentMethods(defaultValues)

      if (_paymentData.length > 0)
        setPaymentData(_paymentData)

      // products
      setSelectedProducts(
        defaultValues.sale_order_track?.map(product => ({
          ...product,
          status: product.delivery_mode,
          ordered_price_band: product.ordered_price_band,
          discount: Number(product.discount),
          price_band: product.ordered_price_band,
          position: product.invoice_position,
          base_price: Number(product.unit_price),
          quantity: product.quantity_hold,
          quantity_hold: product.quantity_hold,

          hold_price: Number(product.unit_price),
          unit_price: Number(product.unit_price),
          average_unit_price: Number(product.unit_price),
          vat: Number(product.vat),
          total:
            product.quantity_hold *
            Number(product.unit_price),
          product_price: [], // TODO: Update this to actual values
          product_stock: [], // TODO: Update this to actual values
          ordered: product.to_be_ordered,
          hold_date: product.hold_date,
        })),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  useEffect(() => {
    getQuoteToOrderInfo(
      quoteInfo => {
        switchCustomer(quoteInfo.customer)

        setCustomerNotes(quoteInfo.extra_notes)
        setSelectedProducts(
          quoteInfo.products.map(prod => ({
            ...prod,
            product_delivery_status:
              prod.product_delivery_status || 'pending',
            delivery_mode: prod.delivery_mode || 'pick_up',
          })),
        )
        setReferenceValue(quoteInfo.customer_reference)
        setDeliveryCost(quoteInfo.delivery)
      },
      () => prefillData(),
    )
  }, [
    customers,
    defaultValues,
    prefillData,
    switchCustomer,
  ])

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
          Number(prod.base_price) + addVAT(prod.base_price),
        invoice_position: prod.position,
        quantity_sold: prod.quantity,
        sold_price_band: prod.price_band,
        product_delivery_status:
          prod.product_delivery_status || 'pending',
        delivery_mode: 'pick_up',
        vat: addVAT(prod.base_price),
        sold_date: dateToString(new Date(), 'yyyy-MM-dd'),
        to_be_ordered: prod.ordered,
        total:
          (Number(prod.base_price) +
            addVAT(prod.base_price)) *
            prod.quantity -
          prod.discount * prod.quantity,
      }
    })

    setSelectedProducts(products)
    setInvoiceProducts(_invoiceProducts)
  }

  useEffect(() => {
    setInvoiceTotal(
      calculateTotal(invoiceProducts, deliveryCost),
    )
  }, [invoiceProducts, deliveryCost])

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Sales Order', to: '/orders' },
          {
            label: id && id > 0 ? 'Edit' : 'Add',
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
              onClick={() => openPreviewOrderModal(1)}
            >
              Preview
            </Button>
            {!router.pathname.includes('/edit') && (
              <Button
                variant='contained'
                onClick={itemToQuote}
              >
                Convert to Quote
              </Button>
            )}
            <Button
              variant='contained'
              onClick={() => openConfirmSubmitModal(1)}
            >
              {id && id > 0 ? 'Update ' : 'Save '}
              Order
            </Button>
          </Box>
        }
      >
        <Grid container columns={12} spacing={6}>
          <Grid item md={4} sm={6} xs={12}>
            <CustomerDetailsCard
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={newCustomer =>
                switchCustomer(newCustomer)
              }
              setReferenceValue={(val: string) =>
                setReferenceValue(val)
              }
              cashCustomers={false}
              referenceValue={referenceValue}
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
              cashCustomerValue={cashCustomerInvoiceAddress}
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
          defaultProducts={selectedProducts}
          selectedCustomer={selectedCustomer}
          toOrder
          status
          toTransfer
          setProduct={newProducts =>
            convertProductsList(newProducts)
          }
          default_delivery_mode='delivery'
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
                Customer Notes
              </Typography>

              <Box>
                <CustomTextField
                  fullWidth
                  multiline
                  minRows={7}
                  placeholder='Customer notes'
                  value={customerNotes}
                  onChange={e =>
                    setCustomerNotes(e.target.value)
                  }
                />
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            md={6}
            sm={6}
            xs={12}
            sx={{ display: 'flex' }}
          >
            <InvoiceTotalCard
              products={selectedProducts}
              discount={appDiscount}
              delivery={deliveryCost}
            />
          </Grid>
        </Grid>
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
        delivery={deliveryCost}
        open={deliveryAddressModalStatus()}
        handleClose={closeDeliveryAddressModal}
        customerInfo={{
          'Customer Name': getFullName(selectedCustomer),
          'Customer ID':
            selectedCustomer.id === 0
              ? 'N/A'
              : selectedCustomer.id,
        }}
        onSubmit={({ id, deliveryCost: dCost }) => {
          setDeliveryAddress(id)
          setDeliveryCost(dCost)
        }}
      />

      <ConfirmationModal
        open={confirmSubmitModalStatus()}
        handleClose={closeConfirmSubmitModal}
        maxWidth={400}
        title={`${defaultValues ? 'Edit' : 'Create'} Order`}
        content={`Are you sure you want to ${
          defaultValues ? 'edit' : 'create'
        }  this order?`}
        confirmTitle={defaultValues ? 'Edit' : 'Create'}
        onConfirm={handleSubmit}
        rejectTitle='Cancel'
        onReject={closeConfirmSubmitModal}
      />

      <AppModal
        maxWidth={900}
        open={previewOrderModalStatus()}
        handleClose={closePreviewOrderModal}
        sx={{ p: 0 }}
      >
        <PreviewCard
          title={
            'Order ' +
            (defaultValues
              ? defaultValues?.order_number
              : '')
          }
          invoiceInfo={{
            'Order Date': dateToString(
              defaultValues
                ? new Date(defaultValues?.created_at)
                : new Date(),
              'dd/MM/yyyy',
            ),
            'Order Time': dateToString(
              defaultValues
                ? new Date(defaultValues?.created_at)
                : new Date(),
              'HH:mm',
            ),
            'Customer No.': selectedCustomer.id,
            'Customer Ref': referenceValue,
            'Raised By': getFullName(user),
          }}
          delivery={deliveryCost}
          discount={0}
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
                includeVAT(Number(p.base_price)) *
                  p.quantity -
                  p.discount * p.quantity,
              ),
            ),
          }))}
          invoiceTotals={{
            ...orderTotals,
            netTotal: orderTotals.netAmount,
          }}
          notes={customerNotes}
          hideAmountDue
        />
      </AppModal>
    </>
  )
}

export default OrderForm
