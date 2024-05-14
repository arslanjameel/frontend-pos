import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'
import { formatCurrency } from './formatCurrency'
import { sendEmailWithAttachment } from 'src/services/email.service'
import { PAGE_MARGIN } from './globalConstants'
import {
  bottomBankDetails,
  getAddressSection,
  getBankDetailsSection,
  getCompanyNumbersSection,
  getCompanyTopInfoSection,
  getNotesSection,
  getPDFTitleSection,
  getProductsTableSection,
  getTotalsSection,
} from './pdfs/pdfChunks'
import { generateCustomerStatement } from './pdfs/generateCustomerStatement'

const invHeadTableRow = (
  title: string,
  value: string | number,
) => {
  const row: RowInput = [
    {
      content: '',
      styles: {
        halign: 'right',
      },
    },
    {
      content: title,
      styles: {
        halign: 'left',
        fontSize: 9,
        fontStyle: 'bold',
      },
    },
    {
      content: value,
      styles: {
        halign: 'right',
        fontSize: 9,
      },
    },
  ]

  return row
}

const getInvoiceInfoTable = (invoiceTopData: {
  [key: string]: any
}) => {
  return Object.entries(invoiceTopData || {}).map(
    invoiceItem =>
      invHeadTableRow(invoiceItem[0], invoiceItem[1]),
  )
}

interface DocParams {
  storeName?: string
  storeAddress?: string[]
  title?: string
  invoiceTopData: { [key: string]: any }
  quoteTopData?: { [key: string]: any }
  invoiceTo: string[] | any[]
  deliverTo: string[] | any[]
  products: any[]
  totals: { [key: string]: any }
  notes?: string
  isOrder?: boolean
}

export const generateInvoicePDF = ({
  storeName,
  storeAddress,
  title,
  invoiceTopData,
  deliverTo,
  invoiceTo,
  products,
  totals,
  notes,
  isOrder,
}: DocParams) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, { title: title || '', storeName })

  getCompanyTopInfoSection(doc, storeAddress)

  autoTable(doc, {
    body: getInvoiceInfoTable(invoiceTopData),
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

  getAddressSection(doc, {
    deliverTo,
    invoiceTo,
  })

  getProductsTableSection(doc, {
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
      prod.quantity_sold || prod.quantity,
      formatCurrency(prod.unit_price),
      formatCurrency(prod.discount),
      formatCurrency(prod.total),
    ]),
  })

  getTotalsSection(doc, { totals })

  autoTable(doc, {
    body: [
      [
        {
          content:
            'All goods belong to Sharjah Ltd until paid in full. Returns ' +
            '\naccepted up to 30 days form invoice date if unused and' +
            '\nin the original unopened packaging. Special order ' +
            '\nitems cannot be returned.',
          styles: {
            halign: 'left',
          },
        },
      ],
    ],
    styles: { fontSize: 9 },
    theme: 'plain',
    margin: PAGE_MARGIN,
  })

  if (!isOrder) {
    autoTable(doc, {
      margin: PAGE_MARGIN,
      body: [
        bottomBankDetails('Payment Terms:', '30 Days EOM'),
      ],
      theme: 'plain',
      columnStyles: {
        0: {
          halign: 'left',
          fontSize: 9,
          cellWidth: 80,
          cellPadding: [-10, 3.5],
        },
        1: {
          halign: 'left',
          fontSize: 9,
          fontStyle: 'bold',
          cellPadding: [-10, 3.5],
        },
      },
    })

    getBankDetailsSection(doc)
  }

  getNotesSection(doc, notes)

  getCompanyNumbersSection(doc)

  return doc
}

/**
 *
 *
 * Doc download options
 *
 * */

export const downloadPDF = (
  params: DocParams,
  fileName = 'invoice',
) => {
  const pdf = generateInvoicePDF(params)
  pdf.save(fileName)
}

export const emailPDF = async (
  params: DocParams,
  emailParams: {
    email: string
    email_title: string
    email_body: string
    store_id: number
  },
  fileName = 'invoice',
) => {
  const pdf = generateInvoicePDF(params)
  const pdfBlob = pdf.output('blob')

  const res = await sendEmailWithAttachment({
    ...emailParams,
    store_id: emailParams.store_id.toString(),
    file: new File([pdfBlob], fileName, {
      type: pdfBlob.type,
    }),
  })

  return res
}

export const downloadStatementsPDF = (
  params: {
    statements: any[]
    tableItems: { [key: string]: any }
    totals: { [key: string]: any }
    billingAddressTitle: string
    billingAddress: string[]
    storeName: string
    storeAddress?: string[]
  },
  fileName = 'statements',
) => {
  const pdf = generateCustomerStatement(params)
  pdf.save(fileName)
}

// export const emailPDF = async (
//   params: DocParams,
//   emailParams: {
//     email: string
//     email_title: string
//     email_body: string
//   },
//   fileName = 'invoice',
// ) => {
//   const pdf = generateInvoicePDF(params)
//   const pdfBlob = pdf.output('blob')

//   const res = await sendEmailWithAttachment({
//     ...emailParams,
//     file: new File([pdfBlob], fileName, {
//       type: pdfBlob.type,
//     }),
//   })

//   return res
// }

/**
 *
 *
 *
 * General actions
 *
 */

export const downloadPDFAction = (
  pdf: jsPDF,
  fileName = 'invoice',
) => {
  pdf.save(fileName)
}

export const emailPDFAction = async (
  pdf: jsPDF,
  emailParams: {
    email: string
    email_title: string
    email_body: string
    store_id: number
  },
  fileName = 'invoice',
) => {
  const pdfBlob = pdf.output('blob')

  const res = await sendEmailWithAttachment({
    ...emailParams,
    store_id: emailParams.store_id.toString(),
    file: new File([pdfBlob], fileName, {
      type: pdfBlob.type,
    }),
  })

  return res
}
