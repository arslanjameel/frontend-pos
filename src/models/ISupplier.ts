export interface ISupplierBankInfo {
  company_number: string
  vat_number: string
  bank_account_name: string
  account_number: string
  sort_code: string
}

export interface ISupplierNew extends ISupplierBankInfo {
  name: string
  email: string

  primary_phone: string
  second_phone: string

  current_credit: string
  credit_limit: string

  //TODO: Missing Open Days

  opening_hours: any
  closing_hours: any

  // Address Section
  //TODO: Missing Address Line 1, Address Line 2
  address: string
  post_code: string
  city: number | null
  country: number | null
}

export interface ISupplier extends ISupplierNew {
  created_at: string
  id: number
}

export type ISupplierUpdate = Partial<ISupplierNew>
