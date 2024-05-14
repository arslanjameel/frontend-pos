import { ISaleInvoice } from 'src/models/ISaleInvoice'
import useGetCityName from './useGetCityName'
import { dateToString } from 'src/utils/dateUtils'
import {
  calculateInvoiceTotals,
  calculateRowExVAT,
  getInvoicePaidAmount,
  getInvoicePaidAndBalance,
  getPaymentMethods,
  getPaymentMethodsStr,
} from 'src/utils/invoicesUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  excludeVAT,
  getFullName,
  includeVAT,
} from 'src/utils/dataUtils'
import capitalize from 'src/utils/capitalize'
import { generateReceiptPDF } from 'src/utils/pdfs/generateReceiptPDF'
import { IReceipt } from 'src/models/IReceipts'
import { generateCreditNotePDF } from 'src/utils/pdfs/generateCreditNote'
import { ISaleReturn } from 'src/models/ISaleReturn'
import { calculateCRTotals } from 'src/utils/creditNotesUtils'
import { generateInvoicePDF } from 'src/utils/pdfUtils'

const useGeneratePDFDoc = () => {
  const { getCity } = useGetCityName()

  const generateInvoiceDoc = (
    invoiceInfo: ISaleInvoice,
  ) => {
    const getInvoiceTopInfo = () => {
      return {
        'Invoice Date': dateToString(
          new Date(),
          'dd/MM/yyyy',
        ),
        'Invoice Time': dateToString(new Date(), 'HH:mm'),
        'Customer No.': invoiceInfo.customer
          ? invoiceInfo.customer.id.toString()
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

      // invoiceInfo.sold_on_invoiceNew?: any[],
    ) => {
      const {
        productTotalExVAT,
        deliveryExVAT,
        netAmountExVAT,
        vatAmountExVAT,
        grossAmountExVAT,

        // amountDue,
      } = calculateInvoiceTotals(
        invoiceInfo.sold_on_invoice || [],
        {
          delivery:
            Number(invoiceInfo?.total_delivery) || 0,
          paymentMade:
            Number(
              getInvoicePaidAndBalance(invoiceInfo)
                .amountPaid,
            ) || 0,
        },
      )

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

        //   invoiceInfo.sold_on_invoice,
      )

      const invoiceTopInfo = {
        'Invoice Date': dateToString(
          new Date(),
          'dd/MM/yyyy',
        ),
        'Invoice Time': dateToString(new Date(), 'HH:mm'),
        'Customer No.': invoiceInfo.customer
          ? invoiceInfo.customer.id.toString()
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
          ...((invoiceInfo.sold_on_invoice || []).map(
            product => ({
              ...product,
              discount: excludeVAT(
                Number(product.discount),
              ),
              total: calculateRowExVAT(product),
            }),
          ) || []),
        ],
        invoiceTopData: getInvoiceTopInfo(),
        totals: styledTotals,
        storeAddress: [
          capitalize(invoiceInfo.store.storeAddress),
          getCity(invoiceInfo.store.city),
          invoiceInfo.store.postalCode,
          '',
          `Tel No.   ${invoiceInfo.store.phone}`,
          `Email   ${invoiceInfo.store.email}`,
        ],
        storeName: invoiceInfo.store?.name,
        notes: invoiceInfo?.extra_notes,
      }

      return {
        invoiceDoc,
        invoiceTopInfo,
        styledTotals,
        totals,
      }
    }

    return generateInvoicePDF(getInvoiceInfo().invoiceDoc)
  }

  const generateReceiptDoc = (receiptData: IReceipt) => {
    const paymentMethods = getPaymentMethods(
      receiptData,
    ).reduce((acc, opt) => {
      // @ts-ignore
      acc[opt.title] = formatCurrency(opt.amount)

      return acc
    }, {})

    const receiptPDF = generateReceiptPDF({
      title: receiptData.receipt_number,
      storeName: receiptData.store?.name,
      payments: (receiptData?.receipt_track || []).map(
        (receipt: any) => ({
          amount_cleared: receipt.amount_cleared,
          invoice_number:
            receipt?.sale_invoice?.invoice_number,
        }),
      ),
      receiptTopData: {
        'Receipt Date': dateToString(
          new Date(receiptData?.created_at || ''),
          'dd/MM/yyyy',
        ),
        'Receipt Time': dateToString(
          new Date(receiptData?.created_at || ''),
          'HH:mm',
        ),
        'Customer No.': receiptData?.customer?.id || '',
        'Customer Ref.': receiptData?.customer_ref || '',
        'Raised By': getFullName(receiptData?.user) || '',
      },
      totals: {
        'Payment Method': getPaymentMethodsStr(
          getPaymentMethods(receiptData),
        ),
        'Net Amount': formatCurrency(
          Number(receiptData?.payment) / 1.2,
        ),
        'VAT Amount': formatCurrency(
          Number(receiptData?.payment) -
            Number(receiptData?.payment) / 1.2,
        ),
        'Gross Amount': formatCurrency(
          receiptData?.payment,
        ),
        ' ': '',
        'Paid Amount': formatCurrency(
          Number(receiptData?.payment) || 0,
        ),
        ...paymentMethods,
      },
      storeAddress: [
        capitalize(receiptData.store.storeAddress),
        getCity(receiptData.store.city),
        receiptData.store.postalCode,
        '',
        `Tel No.   ${receiptData.store.phone}`,
        `Email   ${receiptData.store.email}`,
      ],
    })

    return receiptPDF
  }

  const generateReturnDoc = (
    creditNoteData: ISaleReturn,
    invoiceInfo: ISaleInvoice,
  ) => {
    const totals = calculateCRTotals(
      creditNoteData,
      invoiceInfo ? getInvoicePaidAmount(invoiceInfo) : 0,
    )

    const paymentMethods = getPaymentMethods(
      creditNoteData,
    ).reduce((acc, opt) => {
      // @ts-ignore
      acc[opt.title] = formatCurrency(opt.amount)

      return acc
    }, {})

    const creditNoteDoc = generateCreditNotePDF({
      title: 'Return ' + creditNoteData?.return_number,
      products: (creditNoteData?.return_on || []).map(
        (prod: any) => ({
          sku: prod.sku,
          product_name: prod.product_name,
          quantity: prod.quantity_returned,
          unit_price: prod.unit_price,
          vat_inc: includeVAT(prod.unit_price),
          restocking_fee: prod.restocking_fee,
          total:
            Number(prod.return_price) *
            Number(prod.quantity_returned),
        }),
      ),
      topData: {
        'Credit Note Date': dateToString(
          new Date(creditNoteData?.created_at),
          'dd/MM/yyyy',
        ),
        'Customer No.': invoiceInfo?.id || '',
        'Customer Ref.':
          creditNoteData?.customer_reference || '',
        'Invoice No.': invoiceInfo?.invoice_number || '',
        'Raised By': invoiceInfo
          ? getFullName(invoiceInfo.user)
          : '',
      },
      totals: {
        'Refund Method': getPaymentMethodsStr(
          getPaymentMethods(creditNoteData),
        ),
        'Net Amount': formatCurrency(totals.net),
        'VAT Amount': formatCurrency(totals.vat),
        'Subtotal ': formatCurrency(totals.subtotal),
        'Restocking Fee':
          '-' +
          formatCurrency(
            creditNoteData?.total_restocking_fee,
          ),
        'Invoice Amount Paid': formatCurrency(
          invoiceInfo
            ? getInvoicePaidAmount(invoiceInfo)
            : 0,
        ),
        'Gross Amount': formatCurrency(totals.gross),
      },
      storeName: creditNoteData.store.name,
      storeAddress: [
        capitalize(creditNoteData.store.storeAddress),
        getCity(creditNoteData.store.city),
        creditNoteData.store.postalCode,
        '',
        `Tel No.   ${creditNoteData.store.phone}`,
        `Email   ${creditNoteData.store.email}`,
      ],
      refundOptions: {
        'Refund Amount': formatCurrency(
          creditNoteData?.payment_to_customer || 0,
        ),
        ...paymentMethods,
      },
    })

    return creditNoteDoc
  }

  return {
    generateInvoiceDoc,
    generateReceiptDoc,
    generateReturnDoc,
  }
}

export default useGeneratePDFDoc
