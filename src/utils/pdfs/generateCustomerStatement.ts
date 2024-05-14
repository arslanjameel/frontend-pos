import jsPDF from 'jspdf'

import {
  getBankDetailsSection,
  getLeftAddressSection,
  getPDFTitleSection,
  getStripedTableSection,
  getTopSection,
  getTotalsSection,
} from './pdfChunks'

export const generateCustomerStatement = ({
  statements,
  tableItems,
  totals,
  billingAddressTitle,
  billingAddress,
  storeName,
  storeAddress,
}: {
  statements: any[]
  tableItems: { [key: string]: any }
  totals: { [key: string]: any }
  storeAddress?: string[]
  billingAddressTitle: string
  billingAddress: string[]
  storeName: string
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')

  getPDFTitleSection(doc, { title: 'Statement', storeName })

  getTopSection(doc, { tableItems, storeAddress })

  getLeftAddressSection(doc, {
    addressTitle: billingAddressTitle,
    address: billingAddress,
  })

  getStripedTableSection(doc, {
    headers: [
      'DATE',
      'DOCUMENT',
      'TRANSACTION',
      'DEBIT',
      'CREDIT',
      'BALANCE',
    ],

    rows: statements.map(statement => [
      statement.date,
      statement.document,
      statement.transaction,
      statement.debit,
      statement.credit,
      statement.available,
    ]),
  })

  getTotalsSection(doc, { totals })

  getBankDetailsSection(doc, {
    bankDetailsTitle: 'OUR BANK DETAILS ARE:',
  })

  return doc
}
