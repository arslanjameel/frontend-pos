import jsPDF from 'jspdf'

import {
  getBankDetailsSection,
  getLeftAddressSection,
  getPDFTitleSection,
  getStripedTableSection,
  getTopSection,
} from './pdfChunks'

export const generateCustomerTransactionsPDF = ({
  transactions,
  tableItems,
  billingAddressTitle,
  billingAddress,
  storeName,
  storeAddress,
}: {
  transactions: any[]
  tableItems: { [key: string]: any }
  storeAddress?: string[]
  billingAddressTitle: string
  billingAddress: string[]
  storeName: string
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, {
    title: 'Transactions',
    storeName,
  })

  getTopSection(doc, { tableItems, storeAddress })

  getLeftAddressSection(doc, {
    addressTitle: billingAddressTitle,
    address: billingAddress,
  })

  getStripedTableSection(
    doc,
    {
      headers: [
        'DATE',
        'DOCUMENT',
        'TRANSACTION',
        'AMOUNT',
        'STATUS',
      ],

      rows: transactions.map(statement => [
        statement.date,
        statement.document,
        statement.transaction,
        statement.amount,
        statement.status,
      ]),
    },
    {
      0: { cellWidth: 90 },
      1: { cellWidth: 180 },
      2: { cellWidth: 120 },
      3: { cellWidth: 75 },
      5: { cellWidth: 75 },
    },
  )

  //   getTotalsSection(doc, { totals })

  getBankDetailsSection(doc, {
    bankDetailsTitle: 'OUR BANK DETAILS ARE:',
  })

  return doc
}
