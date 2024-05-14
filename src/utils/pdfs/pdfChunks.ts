import jsPDF from 'jspdf'
import autoTable, { RowInput } from 'jspdf-autotable'
import {
  COMPANY_ACCOUNT_NAME,
  COMPANY_ACCOUNT_NUMBER,
  COMPANY_NUMBER,
  COMPANY_SORT_CODE,
  COMPANY_VAT_NUMBER,
  PAGE_MARGIN,
} from '../globalConstants'

export const getStripedTableSection = (
  doc: jsPDF,
  tableInfo: { headers: string[]; rows: RowInput[] },
  columnStyles?: { [key: string]: any },
) => {
  autoTable(doc, {
    head: [tableInfo.headers],
    body: [...tableInfo.rows],
    theme: 'striped',
    headStyles: {
      fillColor: '#e3e3e3',
      textColor: '#000',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5 },
    columnStyles,

    margin: PAGE_MARGIN,
  })
}

export const getProductsTableSection = (
  doc: jsPDF,
  tableInfo: { headers: string[]; rows: RowInput[] },
  columnStyles: { [key: string]: any } = {
    0: { cellWidth: 70 },
    1: { cellWidth: 235 },
    2: { cellWidth: 45 },
    3: { cellWidth: 60 },
    4: { cellWidth: 60 },
    5: { cellWidth: 70 },
  },
) => {
  autoTable(doc, {
    head: [tableInfo.headers],
    body: [...tableInfo.rows],
    theme: 'striped',
    headStyles: {
      fillColor: '#e3e3e3',
      textColor: '#000',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5 },
    columnStyles,

    margin: PAGE_MARGIN,
  })
}

export const getSpace = (
  doc: jsPDF,
  params: { minCellHeight: number } = { minCellHeight: 1 },
) => {
  autoTable(doc, {
    body: [{ content: '' }],
    styles: {
      fontSize: 1,
      minCellHeight: params.minCellHeight,
    },
    theme: 'plain',
    margin: [0, PAGE_MARGIN],
  })
}

export const getAddressSection = (
  doc: jsPDF,
  addressInfo: {
    invoiceTo: string[]
    deliverTo: string[]
  },
) => {
  autoTable(doc, {
    body: [
      [
        {
          content: 'Invoice Address',
          styles: {
            cellWidth: 200,
            fontStyle: 'bold',
            fontSize: 9,
          },
        },
        {
          content: '',
          styles: { cellWidth: 190, fontSize: 9 },
        },
        {
          content: 'Delivery Address',
          styles: {
            cellWidth: 200,
            fontStyle: 'bold',
            fontSize: 9,
          },
        },
      ],
      [
        {
          content: addressInfo.invoiceTo.join('\n'),
          styles: { halign: 'left', fontSize: 9 },
        },
        { content: '' },
        {
          content: addressInfo.deliverTo.join('\n'),
          styles: { halign: 'left', fontSize: 9 },
        },
      ],
    ],
    theme: 'plain',
    margin: PAGE_MARGIN,
  })
}

export const getLeftAddressSection = (
  doc: jsPDF,
  addressInfo: {
    addressTitle: string
    address: string[]
  },
) => {
  autoTable(doc, {
    body: [
      [
        {
          content: addressInfo.addressTitle,
          styles: {
            cellWidth: 200,
            fontStyle: 'bold',
            fontSize: 9,
          },
        },
      ],
      [
        {
          content: addressInfo.address.join('\n'),
          styles: {
            halign: 'left',
            fontSize: 9,
            cellPadding: [-1, 0, 0, 0],
          },
        },
      ],
    ],
    styles: { cellPadding: [5, 0] },

    theme: 'plain',
    margin: PAGE_MARGIN,
  })
}

export const getCompanyNumbersSection = (
  doc: jsPDF,
  params: { line1: string; line2: string } = {
    line1: `Sharjah Ltd Company Number: ${COMPANY_NUMBER}`,
    line2: `VAT Number: ${COMPANY_VAT_NUMBER}`,
  },
) => {
  autoTable(doc, {
    body: [
      [
        {
          content: params.line1,
          styles: { halign: 'left', fontSize: 9 },
        },
      ],
      [
        {
          content: params.line2,
          styles: { halign: 'left', fontSize: 9 },
        },
      ],
    ],
    theme: 'plain',
    margin: PAGE_MARGIN,
    bodyStyles: {
      valign: 'middle',

      cellPadding: [2, 3.5],
    },
  })
}

export const bottomBankDetails = (
  title: string,
  value: string | number,
) => {
  const row: RowInput = [
    { content: title },
    { content: value },
  ]

  return row
}

export const getBankDetailsSection = (
  doc: jsPDF,
  options: { bankDetailsTitle: string } = {
    bankDetailsTitle: 'Bank Details',
  },
) => {
  autoTable(doc, {
    body: [
      [
        {
          content: options.bankDetailsTitle,
          styles: {
            halign: 'left',
            fontSize: 9,
            fontStyle: 'bold',
            cellPadding: [-10, 3.5, -20],
          },
        },
      ],
    ],
    theme: 'plain',
    margin: PAGE_MARGIN,
    bodyStyles: { valign: 'middle' },
  })

  autoTable(doc, {
    margin: PAGE_MARGIN,
    body: [
      bottomBankDetails(
        'Account Name:',
        COMPANY_ACCOUNT_NAME,
      ),
      bottomBankDetails('Sort Code:', COMPANY_SORT_CODE),
      bottomBankDetails(
        'Account Number:',
        COMPANY_ACCOUNT_NUMBER,
      ),
    ],
    theme: 'plain',
    bodyStyles: {
      halign: 'left',
      fontSize: 9,
      cellWidth: 80,
      cellPadding: [2, 3.5],
    },
  })
}

export const getCompanyTopInfoSection = (
  doc: jsPDF,
  addressInfo: string[] = [
    '64 ST BARNABAS ROAD',
    'LEICESTER',
    'LE5 4BD',
    '',
    'Tel No.: 0116 274 4057',
    'Email: sales@nexus-home.com',
  ],
) => {
  autoTable(doc, {
    margin: PAGE_MARGIN,
    body: [
      [
        {
          content: addressInfo.join('\n'),
          styles: { halign: 'left', fontSize: 9 },
        },
      ],
    ],
    bodyStyles: { cellPadding: [0, 0, 0, -0.5] },
    theme: 'plain',
  })
}

export const getPDFTitleSection = (
  doc: jsPDF,
  options: { title: string; storeName?: string },
) => {
  autoTable(doc, {
    body: [
      [
        {
          content: options?.storeName || 'Sharjah LTD',
          styles: {
            halign: 'left',
            fontSize: 20,
            fontStyle: 'bold',
          },
        },
        {
          content: options.title,
          styles: {
            halign: 'right',
            fontSize: 20,
            fontStyle: 'bold',
          },
        },
      ],
    ],
    bodyStyles: { cellPadding: [0, -0.5, 0, -0.5] },
    theme: 'plain',
    margin: PAGE_MARGIN,
  })
}

/**
 *
 *
 * Generate totals section
 *
 */

export const generateTotalsList = (
  totals: {
    [key: string]: any
  },
  halign: 'left' | 'right' = 'right',
) => {
  const totalsRows: RowInput[] = Object.entries(totals).map(
    total => {
      const padObj = {
        content: '',
        styles: {
          halign,
          cellWidth: 370,
        },
      }

      const arr = [
        {
          content: total[0],
          styles: {
            halign,
            cellWidth: 100,
          },
        },
        {
          content: total[1],
          styles: {
            halign,
            cellWidth: 60,
            fontStyle: 'bold',
          },
        },
      ]

      if (halign === 'right') {
        arr.unshift(padObj)
      } else {
        arr.push(padObj)
      }

      return arr as RowInput
    },
  )

  return totalsRows
}
export const getTotalsSection = (
  doc: jsPDF,
  params: {
    totals: {
      [key: string]: any
    }
    halign?: 'left' | 'right'
  },
) => {
  autoTable(doc, {
    body: [
      ...generateTotalsList(
        {
          ...params.totals,
        },
        params?.halign || 'right',
      ),
    ],
    theme: 'plain',
    styles: {
      cellPadding:
        params?.halign === 'left' ? [0, 0, 0, -5] : 2,
      fontSize: 9,
    },
  })
}

/**
 *
 *
 * Section with company address and table on the right (below title)
 *
 */

const invHeadTableRow = (
  title: string,
  value: string | number,
) => {
  const row: RowInput = [
    {
      content: '',
      styles: { halign: 'right' },
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
      styles: { halign: 'right', fontSize: 9 },
    },
  ]

  return row
}

export const getInvoiceInfoTable = (invoiceTopData: {
  [key: string]: any
}) => {
  return Object.entries(invoiceTopData || {}).map(
    invoiceItem =>
      invHeadTableRow(invoiceItem[0], invoiceItem[1]),
  )
}

export const getTopSection = (
  doc: jsPDF,
  {
    tableItems,
    storeAddress,
  }: {
    tableItems: { [key: string]: any }
    storeAddress?: string[]
  },
) => {
  getCompanyTopInfoSection(doc, storeAddress)

  autoTable(doc, {
    body: getInvoiceInfoTable(tableItems),
    styles: {
      halign: 'right',
      cellPadding: 0,
    },
    theme: 'plain',
    startY: 80,
    columnStyles: {
      0: { lineWidth: 0, cellWidth: 375 },
      1: { cellWidth: 80, cellPadding: 2 },
      2: { cellWidth: 80, cellPadding: 2 },
    },

    bodyStyles: { halign: 'right' },
    tableWidth: 'wrap',
    margin: PAGE_MARGIN,
  })
}

export const getNotesSection = (doc: jsPDF, notes = '') => {
  autoTable(doc, {
    margin: PAGE_MARGIN,
    body: [
      [{ content: 'Notes:' }, { content: notes || '' }],
    ],
    columnStyles: {
      0: {
        halign: 'left',

        fontStyle: 'bold',
        fontSize: 9,
        cellWidth: 50,
      },
      1: {
        halign: 'left',
        fontSize: 9,
        cellWidth: 300,
      },
    },
    theme: 'plain',
    bodyStyles: {
      halign: 'left',

      fontSize: 9,
      cellWidth: 70,
    },
  })
}
