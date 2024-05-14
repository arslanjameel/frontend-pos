/**
 *
 *
 * Quote PDF structure
 *
 *
 */

import autoTable from 'jspdf-autotable'
import {
  getCompanyNumbersSection,
  getCompanyTopInfoSection,
  getInvoiceInfoTable,
  getLeftAddressSection,
  getNotesSection,
  getPDFTitleSection,
  getProductsTableSection,
  getTotalsSection,
} from './pdfChunks'
import { PAGE_MARGIN } from '../globalConstants'
import jsPDF from 'jspdf'
import { formatCurrency } from '../formatCurrency'

export const generateQuotePDF = ({
  title,
  quoteTopData = {},
  quotationAddress,
  products,
  storeName,
  storeAddress,
  totals,
  notes,
}: {
  title?: string
  quoteTopData: { [key: string]: any }
  quotationAddress: string[] | any[]
  storeName?: string
  storeAddress: string[]
  products: any[]
  totals: { [key: string]: any }
  notes?: string
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, { title: title || '', storeName })

  getCompanyTopInfoSection(doc, storeAddress)

  autoTable(doc, {
    body: getInvoiceInfoTable(quoteTopData),
    styles: {
      halign: 'right',
      cellPadding: 0,
    },
    theme: 'plain',
    startY: 80,
    columnStyles: {
      0: { lineWidth: 0, cellWidth: 390 },
      1: { cellWidth: 70, cellPadding: 2 },
      2: { cellWidth: 70, cellPadding: 2 },
    },

    bodyStyles: { halign: 'right', fontSize: 9 },
    tableWidth: 'wrap',
    margin: PAGE_MARGIN,
  })

  getLeftAddressSection(doc, {
    addressTitle: 'Quotation Address',
    address: quotationAddress.every(
      val => String(val).trim() === '',
    )
      ? ['No address selected']
      : quotationAddress,
  })

  getProductsTableSection(
    doc,
    {
      headers: [
        'SKU',
        'NAME',
        'QTY',
        'UNIT PRICE',
        'DISCOUNT',
        'TOTAL',
      ],

      rows: products.map(prod => [
        prod.sku,
        prod.product_name,
        prod.quantity,
        formatCurrency(prod.unit_price),
        formatCurrency(prod.discount),
        formatCurrency(prod.total),
      ]),
    },
    {
      0: { cellWidth: 70 },
      1: { cellWidth: 235 },
      2: { cellWidth: 45 },
      3: { cellWidth: 60 },
      4: { cellWidth: 60 },
      5: { cellWidth: 70 },
    },
  )

  getTotalsSection(doc, { totals })

  autoTable(doc, {
    body: [
      [
        {
          content:
            '      *** QUOTATION ONLY ***' +
            '\n*** NO GOODS TO BE ISSUED ***',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
      ],
      [
        {
          content:
            'This quote may be subject to price changes',
          styles: { halign: 'left' },
        },
      ],
    ],
    styles: { fontSize: 9 },
    theme: 'plain',
    margin: PAGE_MARGIN,
  })

  getNotesSection(doc, notes)

  getCompanyNumbersSection(doc, {
    line1: 'Company Reg No 3955869',
    line2: 'VAT Reg No 754 451 526',
  })

  return doc
}
