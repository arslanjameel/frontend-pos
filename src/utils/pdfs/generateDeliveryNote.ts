/**
 *
 *
 * Receipt PDF structure
 *
 *
 */

import autoTable from 'jspdf-autotable'
import {
  getCompanyTopInfoSection,
  getInvoiceInfoTable,
  getLeftAddressSection,
  getPDFTitleSection,
  getProductsTableSection,
} from './pdfChunks'
import { PAGE_MARGIN } from '../globalConstants'
import jsPDF from 'jspdf'

export const generateDeliveryNote = ({
  storeName,
  storeAddress,
  deliveryAddress,
  title,
  receiptTopData = {},
  products,
  isPickingNote,
}: {
  storeName?: string
  storeAddress: any[]
  deliveryAddress: string[]
  title?: string
  receiptTopData: { [key: string]: any }
  products: any[]
  isPickingNote?: boolean
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
      0: { lineWidth: 0, cellWidth: 390 },
      1: { cellWidth: 70, cellPadding: 2 },
      2: { cellWidth: 70, cellPadding: [2, 2, 6, 2] },
    },
    bodyStyles: {
      halign: 'right',
      fontSize: 9,
    },

    tableWidth: 'wrap',
    margin: PAGE_MARGIN,
  })

  getLeftAddressSection(doc, {
    addressTitle: 'Delivery Address',
    address: deliveryAddress.every(
      val => String(val).trim() === '',
    )
      ? ['No address selected']
      : deliveryAddress,
  })

  getProductsTableSection(
    doc,
    {
      headers: ['Item Code', 'Description', 'Qty'],

      rows: products.map(products => [
        products.sku,
        products.product_name,
        products.delivered_now,
      ]),
    },
    {
      0: { cellWidth: 80 },
      1: { cellWidth: 330 },
      2: { cellWidth: 120 },
    },
  )

  if (!isPickingNote) {
    autoTable(doc, {
      body: [
        {
          content:
            'Returns are only accepted for products that are unused, unopened, and in their original packaging. By signing the delivery note, you acknowledge that you have received the goods in satisfactory condition and that they are as described on the delivery note. Retuns must be initiated within 30 days.',
        },
      ],

      styles: {
        cellPadding: [6, 6],
      },
      columnStyles: {
        0: { cellWidth: 535 },
      },
      theme: 'plain',
      bodyStyles: {
        halign: 'center',
        fontSize: 9,
        lineWidth: 1,
      },
      tableWidth: 'wrap',
      margin: PAGE_MARGIN,
    })

    autoTable(doc, {
      body: [
        {
          content: 'DELIVERY BY',
        },
        {
          content:
            'SIGNATURE:.......................................',
        },
        {
          content:
            'PRINT NAME:........................................',
        },
        {
          content:
            'DATE:...............................................',
        },
      ],
      styles: { cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { fontStyle: 'normal' },
        2: { fontStyle: 'normal' },
        3: { fontStyle: 'normal' },
      },
      theme: 'plain',
      bodyStyles: {
        halign: 'left',
        fontSize: 9,
      },
      tableWidth: 'wrap',
      margin: PAGE_MARGIN,
    })

    autoTable(doc, {
      body: [
        {
          content: 'CUSTOMER',
        },
        {
          content:
            'SIGNATURE:.......................................',
        },
        {
          content:
            'PRINT NAME:........................................',
        },
        {
          content:
            'DATE:...............................................',
        },
      ],
      styles: { cellPadding: 3 },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          halign: 'left',
        },
        1: { fontStyle: 'normal' },
        2: { fontStyle: 'normal' },
        3: { fontStyle: 'normal' },
      },
      theme: 'plain',
      bodyStyles: {
        halign: 'right',
        fontSize: 9,
      },
      margin: PAGE_MARGIN,
    })
  }

  return doc
}
