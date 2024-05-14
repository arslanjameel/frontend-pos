import { ICustomer } from 'src/models/ICustomer'
import capitalize from 'src/utils/capitalize'
import {
  excludeVAT,
  getFullName,
} from 'src/utils/dataUtils'
import { dateToString } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import useGetCityName from './useGetCityName'
import { useAppSelector } from 'src/store/hooks'

// import useCalculateTransactionTotals from './global/useCalculateTransactionTotals'
// import { getPaidFromAmountsTotal } from 'src/utils/transactionUtils'
import {
  calculateInvoiceTotals,
  calculateRowExVAT,
} from 'src/utils/invoicesUtils'

interface Props {
  customerInfo?: ICustomer
  invoiceInfo?: any
  orderInfo?: any
  invoicedProducts: any[]
}

const useGetOrderPDFInfo = ({
  customerInfo,
  invoiceInfo,
  orderInfo,
  invoicedProducts,
}: Props) => {
  const { store } = useAppSelector(state => state.app)
  const { getCity } = useGetCityName()

  const getInvoiceTopInfo = () => {
    return {
      'Order Date': dateToString(
        new Date(orderInfo?.created_at),
        'dd/MM/yyyy',
      ),
      'Order Time': dateToString(
        new Date(orderInfo?.created_at),
        'HH:mm',
      ),
      'Customer No.': customerInfo
        ? customerInfo?.id?.toString()
        : '--',
      'Customer Ref': orderInfo
        ? orderInfo?.order_reference || '--'
        : '--',

      'Raised By': orderInfo
        ? getFullName(orderInfo?.user)
        : '--',
    }
  }

  // const {
  //   grossAmount,
  //   netAmount,
  //   productTotal,
  //   vatAmount,
  //   delivery,
  // } = useCalculateTransactionTotals({
  //   products: invoicedProducts || [],
  //   deliveryCost: Number(orderInfo?.total_delivery) || 0,
  //   paymentMade: orderInfo
  //     ? getPaidFromAmountsTotal(orderInfo)
  //     : 0,
  //   quantityKey: 'quantity_hold',
  //   unitCostKey: 'unit_price',
  // })

  const {
    productTotalExVAT,
    deliveryExVAT,
    netAmountExVAT,
    vatAmountExVAT,
    grossAmountExVAT,
  } = calculateInvoiceTotals(invoicedProducts || [], {
    delivery: Number(orderInfo?.total_delivery) || 0,
    paymentMade: 0,
    quantityKey: 'quantity_hold',
    unitPriceKey: 'unit_price',
  })

  const getTotalsObj = () => {
    const getTotals = () => {
      return {
        'Product Total': formatCurrency(
          productTotalExVAT || 0,
        ),
        Delivery: formatCurrency(deliveryExVAT || 0),
        'Net Amount': formatCurrency(netAmountExVAT || 0),
        'VAT Amount': formatCurrency(vatAmountExVAT || 0),
        'Gross Total': formatCurrency(
          grossAmountExVAT || 0,
        ),

        // 'Amount Due': formatCurrency(grossAmount || 0),
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
        amountDue: grossAmountExVAT,
      },
    }
  }

  const getOrderInfo = () => {
    const invoiceTo = orderInfo?.invoice_to || ''
    const deliverTo = orderInfo?.deliver_to || ''

    const { styledTotals, totals } = getTotalsObj()

    const invoiceTopInfo = {
      'Invoice Date': dateToString(
        new Date(orderInfo?.created_at),
        'dd/MM/yyyy',
      ),
      'Invoice Time': dateToString(
        new Date(orderInfo?.created_at),
        'HH:mm',
      ),
      'Customer No.': customerInfo
        ? customerInfo?.id?.toString()
        : '--',
      'Customer Ref': invoiceInfo
        ? invoiceInfo?.invoice_reference || '--'
        : '--',

      'Raised By': invoiceInfo
        ? getFullName(invoiceInfo?.user)
        : '--',
    }

    const invoiceDoc = {
      title: 'Order ' + orderInfo?.order_number,
      deliverTo: deliverTo.split('\n'),

      invoiceTo: invoiceTo.split('\n'),

      products: [
        ...((invoicedProducts || []).map(product => ({
          ...product,
          quantity: product.quantity_hold,
          discount: excludeVAT(product.discount),
          total: calculateRowExVAT(product, {
            quantityKey: 'quantity_hold',
          }),
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
    }

    return {
      invoiceDoc,
      invoiceTopInfo,
      styledTotals,
      totals,
    }
  }

  return {
    invoiceDoc: getOrderInfo().invoiceDoc,
    invoiceTopInfo: getOrderInfo().invoiceTopInfo,
    totals: getOrderInfo().totals,
    styledTotals: getOrderInfo().styledTotals,
    getOrderInfo,
  }
}

export default useGetOrderPDFInfo
