export const CASH_CUSTOMER_ACC_TYPE = 'cash'

export const DEFAULT_PAGE_SIZE = 10

export const A4WIDTH = 595
export const A4HEIGHT = 1681.3

export const BUSINESS_ID = 3

export const COMPANY_NAME = 'Nexus Trade'
export const COMPANY_ADDRESS_LINE = '64 ST BARNABAS ROAD'
export const COMPANY_ADDRESS_CITY = 'LEICESTER'
export const COMPANY_ADDRESS_SORT_CODE = 'LE5 4BD'

export const COMPANY_NUMBER = 3955869
export const COMPANY_TEL_NUMBER = '0116 274 4057'
export const COMPANY_VAT_NUMBER = '754 451 526'
export const COMPANY_EMAIL = 'sales@nexus-home.com'
export const COMPANY_SORT_CODE = '20-00-00'
export const COMPANY_ACCOUNT_NAME = 'Sharjah Ltd'
export const COMPANY_ACCOUNT_NUMBER = '723673223'

export const EMAIL_INVOICE_BODY =
  'Please find attached your invoice'
export const EMAIL_QUOTE_BODY =
  'Please find attached your quote'
export const EMAIL_CREDIT_NOTE_BODY =
  'Please find attached your credit note'
export const EMAIL_ORDER_BODY =
  'Please find attached your order'
export const EMAIL_RECEIPT_BODY =
  'Please find attached your receipt'
export const EMAIL_DELIVERY_NOTE_BODY =
  'Please find attached your delivery note'
export const EMAIL_PICKING_NOTE_BODY =
  'Please find attached your picking note'

export const DEFAULT_STORE = {
  id: 0,
  storeType: '',
  name: '',
  store_initial: '',
  email: '',
  storeEmailPassword: '',
  storeAddress: '',
  country: 0,
  city: 0,
  postalCode: '',
  phone: '',
  isActive: true,
  storeLogo: '',
  updatedAt: '',
  createdAt: '',
  business: 0,
  bank_account: 0,
  users: [],
}

export const DEFAULT_CUSTOMER = {
  id: 0,
  addresses: [
    {
      id: 0,
      customer: 0,
      addressNickName: '',
      fullName: '',
      country: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postCode: '',
      deleted: false,
      billingAddress: false,
      shippingAddress: false,
      defaultBilling: false,
      defaultShipping: false,
      createdAt: '',
    },
    {
      id: 0,
      customer: 0,
      addressNickName: '',
      fullName: '',
      country: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postCode: '',
      deleted: false,
      billingAddress: false,
      shippingAddress: false,
      defaultBilling: false,
      defaultShipping: false,
      createdAt: '',
    },
    {
      id: 0,
      customer: 0,
      addressNickName: '',
      fullName: '',
      country: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postCode: '',
      deleted: false,
      billingAddress: false,
      shippingAddress: false,
      defaultBilling: true,
      defaultShipping: true,
      createdAt: '',
    },
  ],
  accountName: '',
  firstName: 'No Customer',
  lastName: 'Selected',
  accountType: 'cash',
  email: '',
  primaryPhone: '',
  secondPhone: '',
  priceBand: '',
  currentCredit: '',
  creditLimit: '',
  deleted: false,
  isActive: true,
  image: null,
  createdAt: '',
  createdBy: 0,
  business: 0,
}

export const PAGE_MARGIN = 30
