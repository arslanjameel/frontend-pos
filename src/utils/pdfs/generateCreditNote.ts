/**
 *
 *
 * Credit Note PDF structure
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

export const generateCreditNotePDF = ({
  title,
  storeName,
  topData = {},
  storeAddress,
  products,
  totals,
  refundOptions,
}: {
  title?: string
  storeName?: string
  storeAddress?: string[]
  topData: { [key: string]: any }
  products: any[]
  totals: { [key: string]: any }
  refundOptions: { [key: string]: any }
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, {
    title: title || '',
    storeName: storeName || 'Nexus Trade',
  })

  getCompanyTopInfoSection(doc, storeAddress)

  autoTable(doc, {
    body: getInvoiceInfoTable(topData),
    styles: {
      halign: 'right',
      cellPadding: 0,
    },
    theme: 'plain',
    startY: 80,
    columnStyles: {
      0: { lineWidth: 0, cellWidth: 360 },
      1: { cellWidth: 110, cellPadding: 2 },
      2: { cellWidth: 70, cellPadding: 2 },
    },

    bodyStyles: { halign: 'right', fontSize: 9 },
    tableWidth: 'wrap',
    margin: PAGE_MARGIN,
  })

  getProductsTableSection(
    doc,
    {
      headers: [
        'SKU',
        'NAME',
        'QTY',
        'UNIT PRICE',
        'VAT INC',
        'TOTAL',
      ],

      rows: products.map(prod => [
        prod.sku,
        prod.product_name,
        prod.quantity,
        formatCurrency(prod.unit_price),
        formatCurrency(prod.vat_inc),
        formatCurrency(prod.total),
      ]),
    },
    {
      0: { cellWidth: 60 },
      1: { cellWidth: 215 },
      2: { cellWidth: 40 },
      3: { cellWidth: 80 },
      4: { cellWidth: 70 },
      5: { cellWidth: 70 },
    },
  )

  getTotalsSection(doc, { totals })

  getTotalsSection(doc, {
    totals: refundOptions,
    halign: 'left',
  })

  getCompanyNumbersSection(doc, {
    line1: 'Company Reg No 3955869',
    line2: 'VAT Reg No 754 451 526',
  })

  return doc
}
