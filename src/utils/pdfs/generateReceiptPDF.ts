/**
 *
 *
 * Receipt PDF structure
 *
 *
 */

import autoTable from 'jspdf-autotable'
import {
  getCompanyNumbersSection,
  getCompanyTopInfoSection,
  getInvoiceInfoTable,
  getPDFTitleSection,
  getProductsTableSection,
  getTotalsSection,
} from './pdfChunks'
import { PAGE_MARGIN } from '../globalConstants'
import jsPDF from 'jspdf'
import { formatCurrency } from '../formatCurrency'

export const generateReceiptPDF = ({
  storeName,
  storeAddress,
  title,
  receiptTopData = {},
  payments,
  totals,
}: {
  storeName?: string
  storeAddress?: string[]
  title?: string
  receiptTopData: { [key: string]: any }
  payments: any[]
  totals: { [key: string]: any }
  notes?: string
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, {
    title: title || '',
    storeName: storeName || 'Sharjah LTD',
  })

  getCompanyTopInfoSection(doc, storeAddress)

  autoTable(doc, {
    body: getInvoiceInfoTable(receiptTopData),
    styles: {
      halign: 'right',
      cellPadding: 0,
    },
    theme: 'plain',
    startY: 80,
    columnStyles: {
      0: { lineWidth: 0, cellWidth: 360 },
      1: { cellWidth: 70, cellPadding: 2 },
      2: { cellWidth: 100, cellPadding: 2 },
    },

    bodyStyles: { halign: 'right', fontSize: 9 },
    tableWidth: 'wrap',
    margin: PAGE_MARGIN,
  })

  getProductsTableSection(
    doc,
    {
      headers: ['Invoice No.', 'Amount Cleared'],

      rows: payments.map(payment => [
        payment.invoice_number,
        formatCurrency(payment.amount_cleared),
      ]),
    },
    {
      0: { cellWidth: 418 },
      1: { cellWidth: 120 },
    },
  )

  getTotalsSection(doc, { totals })

  getCompanyNumbersSection(doc, {
    line1: 'Company Reg No 3955869',
    line2: 'VAT Reg No 754 451 526',
  })

  return doc
}
