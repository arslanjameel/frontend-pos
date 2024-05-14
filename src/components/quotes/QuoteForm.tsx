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
import { useRouter } from 'next/router'
import { addDays } from 'date-fns'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import PageContainer from 'src/components/global/PageContainer'
import { useAppSelector } from 'src/store/hooks'
import { useModal } from 'src/hooks/useModal'
import {
  addVAT,
  excludeVAT,
  getFullName,
  includeVAT,
  numTo2dp,
} from 'src/utils/dataUtils'
import SelectInvoiceAddressModal from 'src/components/invoices/SelectInvoiceAddressModal'
import SelectDeliveryAddressModal from 'src/components/invoices/SelectDeliveryAddressModal'
import CustomerDetailsCard from 'src/components/global/CustomerDetailsCard'
import { IQuote } from 'src/models/IQuote'
import ConfirmationModal from '../global/ConfirmationModal'
import { IData } from 'src/utils/types'
import {
  useGetCustomersQuery,
  useGetSingleCustomerAddressesQuery,
} from 'src/store/apis/customersSlice'
import { ICustomer } from 'src/models/ICustomer'
import ProductsDropdownWrapper from '../global/Dropdowns/ProductsDropdownWrapper'
import AppModal from '../global/AppModal'
import { dateToString } from 'src/utils/dateUtils'
import InvoiceTotalCard from '../invoices/InvoiceTotalCard'
import ManagerApprovalModal from '../global/Modals/ManagerApprovalModal'
import { isCashCustomer } from 'src/utils/customers.util'
import { DEFAULT_CUSTOMER } from 'src/utils/globalConstants'
import { IAddress } from 'src/models/IAddress'
import { isUserAManager } from 'src/utils/rolesUtils'
import { useAuth } from 'src/hooks/useAuth'
import useGetDefaultCustomerAddresses from 'src/hooks/useGetDefaultCustomerAddresses'
import QuotesPreviewCard from './QuotesPreviewCard'
import useGetCustomerAddressInfo from 'src/hooks/useGetCustomerAddressInfo'
import AddressEditCard from '../global/Sales/AddressEditCard'
import useCalculateTransactionTotals from 'src/hooks/global/useCalculateTransactionTotals'
import { getOrderToQuote } from 'src/utils/invoicesUtils'

interface Props {
  defaultValues?: IQuote
  onSubmit: (values: IData) => void
}

const QuoteForm = ({ defaultValues, onSubmit }: Props) => {
  const { user } = useAuth()
  const router = useRouter()
  const { store } = useAppSelector(state => state.app)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [referenceValue, setReferenceValue] =
    useState<string>('')
  const [selectedCustomer, setSelectedCustomer] =
    useState<any>(DEFAULT_CUSTOMER)

  const { getDefaultBilling, getDefaultShipping } =
    useGetDefaultCustomerAddresses({
      addresses: selectedCustomer?.addresses || [],
    })

  const [
    cashCustomerInvoiceAddress,
    setCashCustomerInvoiceAddress,
  ] = useState('')
  const [
    cashCustomerDeliveryAddress,
    setCashCustomerDeliveryAddress,
  ] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [selectedAddress, setSelectedAddress] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<
    any[]
  >([])

  const quoteTotals = useCalculateTransactionTotals({
    products: selectedProducts,
  })

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const {
    openModal: openInvoiceAddressModal,
    closeModal: closeInvoiceAddressModal,
    isModalOpen: invoiceAddressModalStatus,
  } = useModal<number>()

  const {
    openModal: openDeliveryAddressModal,
    closeModal: closeDeliveryAddressModal,
    isModalOpen: deliveryAddressModalStatus,
  } = useModal<number>()

  const {
    closeModal: closePreviewQuoteModal,
    openModal: openPreviewQuoteModal,
    isModalOpen: previewQuoteModalStatus,
  } = useModal<any>()

  const {
    openModal: openConfirmSubmitModal,
    closeModal: closeConfirmSubmitModal,
    isModalOpen: confirmSubmitModalStatus,
  } = useModal<number>()

  const { data: customers } = useGetCustomersQuery()
  const { data: addresses } =
    useGetSingleCustomerAddressesQuery(selectedCustomer.id)

  const { getAddressStr } = useGetCustomerAddressInfo(
    addresses?.results || [],
  )

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

  const calculateTotal = (data: any) => {
    return (
      (Number(data.base_price) + addVAT(data.base_price)) *
        data.quantity -
      data.discount * data.quantity
    ).toFixed(2)
  }

  const confirmCreation = () => {
    if (selectedCustomer.id === 0)
      return toast.error('Please select a customer')
    if (selectedProducts.length === 0)
      return toast.error('Please select some products')

    const products = selectedProducts.map((prod: any) => {
      return {
        ...prod,
        total: calculateTotal(prod),
        quote_price: (
          Number(prod.base_price) + addVAT(prod.base_price)
        ).toFixed(2),
        quote_position: prod.position,
        quote_price_band: prod.price_band,
        inc_vat:
          Number(prod.base_price) + addVAT(prod.base_price),
      }
    })
    const _defaults = defaultValues
      ? { ...defaultValues }
      : {}
    onSubmit({
      ..._defaults,
      customer: selectedCustomer.id,
      invoice_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : getAddressStr(selectedAddress),
      deliver_to: isCashCustomer(selectedCustomer)
        ? cashCustomerInvoiceAddress
        : getAddressStr(deliveryAddress),
      extra_notes: customerNotes,
      sale_quote: products,
      customer_reference: referenceValue, //referenceValue
      quote_reference: '',
      delivery: 0,
      store: store.id,
    })
  }

  const onManagerApproval = () => {
    confirmCreation()
  }

  const handleSubmit = () => {
    if (
      selectedProducts.some(
        item => item.price_band === 'Band_A',
      )
    ) {
      if (isUserAManager(user)) {
        onManagerApproval()
      } else {
        openManagerApprovalModal(1)
      }
    } else {
      confirmCreation()
    }
  }

  const quoteToInvoice = () => {
    const products = selectedProducts.map((prod: any) => {
      return {
        ...prod,
        total: calculateTotal(prod),
        quote_price: (
          Number(prod.base_price) + addVAT(prod.base_price)
        ).toFixed(2),
        quote_position: prod.position,
        quote_price_band: prod.price_band,
        inc_vat:
          Number(prod.base_price) + addVAT(prod.base_price),
      }
    })
    const data = {
      customer: selectedCustomer,
      invoice_to: selectedAddress,
      deliver_to: deliveryAddress,
      extra_notes: customerNotes,
      sale_quote: products,
      customer_reference: Number(referenceValue), //referenceValue
      delivery: deliveryCost,
      from: 'quote',
    }

    localStorage.setItem(
      'itemToInvoice',
      JSON.stringify(data),
    )
    router.push('/invoices/new')
  }

  const quoteToOrder = () => {
    const products = selectedProducts.map((prod: any) => {
      return {
        ...prod,
        total: calculateTotal(prod),
        quote_price: (
          Number(prod.base_price) + addVAT(prod.base_price)
        ).toFixed(2),
        quote_position: prod.position,
        quote_price_band: prod.price_band,
        inc_vat:
          Number(prod.base_price) + addVAT(prod.base_price),
      }
    })
    const data = {
      customer: selectedCustomer,
      invoice_to: selectedAddress,
      deliver_to: deliveryAddress,
      extra_notes: customerNotes,
      products: products,
      customer_reference: Number(referenceValue), //referenceValue
      delivery: deliveryCost,
    }

    localStorage.setItem(
      'quoteToOrder',
      JSON.stringify(data),
    )
    router.push('/orders/new')
  }

  const getAddressInfo = (addressId: number): IAddress => {
    const res = (addresses ? addresses.results : []).find(
      val => val.id === addressId,
    )

    return res
      ? res
      : {
          id: 0,
          createdAt: new Date().toISOString(),
          customer: 1,
          country: 1,
          city: 1,
          addressNickName: '',
          fullName: '',
          addressType: 'billingAddress',
          addressLine1: '',
          addressLine2: '',
          postCode: '',
          deleted: false,
          isActive: false,
        }
  }

  useEffect(() => {
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
        const _invoiceAddress = getAddressInfo(
          Number(defaultValues.invoice_to),
        )
        setDeliveryAddress(_invoiceAddress.id)

        //deliveryAddress
        const _deliveryAddress = getAddressInfo(
          Number(defaultValues.deliver_to),
        )
        setDeliveryAddress(_deliveryAddress.id)
      }
    } else {
      // set cash customer as default
      if ((store as any)?.storeType !== 'B2B') {
        const cashCustomer = (
          customers ? customers.results : []
        ).find(customer => isCashCustomer(customer))
        if (cashCustomer) {
          switchCustomer(cashCustomer)
        }
      } else setSelectedCustomer(DEFAULT_CUSTOMER)

      // check for  invoice to quote
      const invoiceToQuote = localStorage.getItem(
        'invoiceToQuote',
      )
      if (invoiceToQuote) {
        localStorage.removeItem('invoiceToQuote')
        const parsedInvoice = JSON.parse(invoiceToQuote)

        if (parsedInvoice) {
          if (parsedInvoice?.customer)
            switchCustomer(parsedInvoice?.customer)

          setCustomerNotes(parsedInvoice?.extra_notes || '')
          setSelectedProducts(parsedInvoice?.products || [])
          setReferenceValue(
            parsedInvoice?.customer_reference || '',
          )
          setDeliveryCost(parsedInvoice?.delivery || 0)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, defaultValues, switchCustomer, store])

  useEffect(() => {
    getOrderToQuote(quoteInfo => {
      if (quoteInfo?.customer) {
        switchCustomer(quoteInfo.customer)

        // if (isCashCustomer(quoteInfo.customer)) {
        //   setCashCustomerInvoiceAddress(
        //     quoteInfo.invoice_to,
        //   )
        //   setCashCustomerDeliveryAddress(
        //     quoteInfo.deliver_to,
        //   )
        // } else {
        //   setSelectedAddress(Number(quoteInfo.invoice_to))
        //   setDeliveryAddress(Number(quoteInfo.deliver_to))
        // }
      }

      setCustomerNotes(quoteInfo?.extra_notes || '')
      setSelectedProducts(quoteInfo?.products || [])
      setReferenceValue(quoteInfo?.customer_reference || '')
      setDeliveryCost(quoteInfo?.delivery || 0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers])

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Sales Quote', to: '/quotes' },
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
              onClick={() => {
                if (
                  !selectedCustomer ||
                  selectedCustomer.id <= 0
                ) {
                  toast.error(
                    'Select a customer to preview',
                  )
                } else {
                  openPreviewQuoteModal(1)
                }
              }}
            >
              Preview
            </Button>
            {(store as any)?.storeType == 'B2B' ? (
              <Button
                variant='contained'
                onClick={quoteToOrder}
              >
                Convert to Order
              </Button>
            ) : (
              <Button
                variant='contained'
                onClick={quoteToInvoice}
              >
                Convert to Invoice
              </Button>
            )}
            <Button
              variant='contained'
              onClick={() => openConfirmSubmitModal(1)}
            >
              Save Quote
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
              cashCustomers={
                (store as any)?.storeType == 'B2B'
                  ? true
                  : false
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
              title='Invoice To'
              icon='tabler:user'
              buttonIcon='tabler:map'
              openSelectModal={() =>
                openInvoiceAddressModal(1)
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
              openSelectModal={() =>
                openDeliveryAddressModal(1)
              }
              addressId={deliveryAddress}
              cashCustomerValue={
                cashCustomerDeliveryAddress
              }
              onCashCustomerValueChange={val =>
                setCashCustomerDeliveryAddress(val)
              }
            />
          </Grid>
        </Grid>

        <ProductsDropdownWrapper
          defaultProducts={selectedProducts}
          selectedCustomer={selectedCustomer}
          toOrder={false}
          status={false}
          setProduct={data => setSelectedProducts(data)}
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
                  minRows={3}
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
              title='Quote Total'
              products={selectedProducts}
              delivery={deliveryCost}
              hasDeliverySection={false}
            />
          </Grid>
        </Grid>
      </PageContainer>

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={onManagerApproval}
      />

      <SelectInvoiceAddressModal
        selectedAddress={selectedAddress}
        open={invoiceAddressModalStatus()}
        handleClose={closeInvoiceAddressModal}
        customerInfo={{
          'Customer Name': `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
          'Customer ID':
            selectedCustomer.id === 0
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
        hideDeliverySection
      />

      <ConfirmationModal
        open={confirmSubmitModalStatus()}
        handleClose={closeConfirmSubmitModal}
        maxWidth={400}
        title={`${defaultValues ? 'Edit' : 'Create'} Quote`}
        content={`Are you sure you want to ${
          defaultValues ? 'edit' : 'create'
        }  this quote?`}
        confirmTitle={defaultValues ? 'Edit' : 'Create'}
        onConfirm={handleSubmit}
        rejectTitle='Cancel'
        onReject={closeConfirmSubmitModal}
      />

      <AppModal
        maxWidth={900}
        open={previewQuoteModalStatus()}
        handleClose={closePreviewQuoteModal}
        sx={{ p: 0 }}
      >
        <QuotesPreviewCard
          title='Quote'
          quoteInfo={{
            'Quotation Date': dateToString(
              new Date(),
              'dd/MM/yyyy',
            ),
            'Customer Ref': referenceValue,
            'Customer No.': selectedCustomer?.id,
            'Expiry Date': dateToString(
              addDays(new Date(), 1),
              'dd/MM/yyyy',
            ),
            'Raised By': getFullName(user),
          }}
          products={(selectedProducts || []).map(
            product => ({
              ...product,
              total: excludeVAT(
                numTo2dp(
                  includeVAT(Number(product.base_price)) *
                    product.quantity -
                    product.discount * product.quantity,
                ),
              ),

              // total:
              //   prod.base_price * prod.quantity * 1.2 -
              //   prod.discountExVAT,
            }),
          )}
          quotationAddress={
            isCashCustomer(selectedCustomer)
              ? cashCustomerInvoiceAddress
              : getAddressStr(selectedAddress)
          }
          quoteTotals={{
            netTotal: quoteTotals.netAmount,
            vatAmount: quoteTotals.vatAmount,
            grossAmount: quoteTotals.grossAmount,
          }}
          customerInfo={selectedCustomer}
          notes={customerNotes}
          closeAction={closePreviewQuoteModal}
        />
      </AppModal>
    </>
  )
}

export default QuoteForm
