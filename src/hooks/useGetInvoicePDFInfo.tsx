// import React from 'react'

import { ICustomer } from 'src/models/ICustomer'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { useAppSelector } from 'src/store/hooks'
import capitalize from 'src/utils/capitalize'

// import AddressName from 'src/components/global/ValueComponents/AddressName'
// import { IAddress } from 'src/models/IAddress'
// import { useGetCustomerAddressesQuery } from 'src/store/apis/customersSlice'
// import { getAddressInfo } from 'src/utils/addressUtils'
// import { isCashCustomer } from 'src/utils/customers.util'
import {
  excludeVAT,
  getFullName,
} from 'src/utils/dataUtils'
import { dateToString } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  calculateInvoiceTotals,
  calculateRowExVAT,
  getInvoicePaidAndBalance,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import useGetCityName from './useGetCityName'

interface Props {
  customerInfo?: ICustomer
  invoiceInfo?: ISaleInvoice
  invoicedProducts: any[]
}

const useGetInvoicePDFInfo = ({
  customerInfo,
  invoiceInfo,
  invoicedProducts,
}: Props) => {
  const { store } = useAppSelector(state => state.app)

  const { getCity } = useGetCityName()

  const getInvoiceTopInfo = () => {
    return {
      'Invoice Date': dateToString(
        new Date(),
        'dd/MM/yyyy',
      ),
      'Invoice Time': dateToString(new Date(), 'HH:mm'),
      'Customer No.': customerInfo
        ? customerInfo.id.toString()
        : '--',
      'Customer Ref': invoiceInfo
        ? invoiceInfo?.invoice_reference || '--'
        : '--',

      'Raised By': invoiceInfo
        ? getFullName(invoiceInfo.user)
        : '--',
    }
  }

  const getTotalsObj = (
    invoiceInfo: any,

    // invoicedProductsNew?: any[],
  ) => {
    const {
      productTotalExVAT,
      deliveryExVAT,
      netAmountExVAT,
      vatAmountExVAT,
      grossAmountExVAT,

      // amountDue,
    } = calculateInvoiceTotals(invoicedProducts || [], {
      delivery: Number(invoiceInfo?.total_delivery) || 0,
      paymentMade:
        Number(
          getInvoicePaidAndBalance(invoiceInfo).amountPaid,
        ) || 0,
    })

    const getTotals = () => {
      return {
        'Payment Method': invoiceInfo
          ? getPaymentMethodsStr(
              getPaymentMethods(invoiceInfo.transaction),
            ) || 'To Pay'
          : 'Credit',
        'Product Total': formatCurrency(
          productTotalExVAT || 0,
        ),
        Delivery: formatCurrency(deliveryExVAT || 0),
        'Net Amount': formatCurrency(netAmountExVAT || 0),

        'VAT Amount': formatCurrency(vatAmountExVAT || 0),
        'Gross Total': formatCurrency(
          grossAmountExVAT || 0,
        ),
        'Amount Due': formatCurrency(
          Math.min(
            grossAmountExVAT,
            invoiceInfo?.transaction.payable || 0,
          ),
        ),
      }
    }

    return {
      styledTotals: getTotals(),
      totals: {
        productTotal: productTotalExVAT,
        delivery: deliveryExVAT,
        netAmount: netAmountExVAT,
        vatAmount: vatAmountExVAT,
        grossAmount: grossAmountExVAT,
        amountDue: Math.min(
          grossAmountExVAT,
          invoiceInfo?.transaction.payable || 0,
        ),
      },
    }
  }

  const getInvoiceInfo = () => {
    const invoiceTo = invoiceInfo?.invoice_to || ''
    const deliverTo = invoiceInfo?.deliver_to || ''

    const { styledTotals, totals } = getTotalsObj(
      invoiceInfo,

      //   invoicedProducts,
    )

    const invoiceTopInfo = {
      'Invoice Date': dateToString(
        new Date(),
        'dd/MM/yyyy',
      ),
      'Invoice Time': dateToString(new Date(), 'HH:mm'),
      'Customer No.': customerInfo
        ? customerInfo.id.toString()
        : '--',
      'Customer Ref': invoiceInfo
        ? invoiceInfo?.invoice_reference || '--'
        : '--',

      'Raised By': invoiceInfo
        ? getFullName(invoiceInfo.user)
        : '--',
    }

    const invoiceDoc = {
      title: 'Invoice ' + invoiceInfo?.invoice_number,
      deliverTo: String(deliverTo).split('\n'),

      invoiceTo: String(invoiceTo).split('\n'),

      products: [
        ...((invoicedProducts || []).map(product => ({
          ...product,
          discount: excludeVAT(product.discount),
          total: calculateRowExVAT(product),
        })) || []),
      ],
      invoiceTopData: getInvoiceTopInfo(),
      totals: styledTotals,
      storeAddress: [
        capitalize(store.storeAddress),
        getCity(store.city),
        store.postalCode,
        '',
        `Tel No.   ${store.phone}`,
        `Email   ${store.email}`,
      ],
      storeName: store?.name,
      notes: invoiceInfo?.extra_notes,
    }

    return {
      invoiceDoc,
      invoiceTopInfo,
      styledTotals,
      totals,
    }
  }

  return {
    invoiceDoc: getInvoiceInfo().invoiceDoc,
    invoiceTopInfo: getInvoiceInfo().invoiceTopInfo,
    totals: getInvoiceInfo().totals,
    styledTotals: getInvoiceInfo().styledTotals,
    getInvoiceInfo,
  }
}

export default useGetInvoicePDFInfo
