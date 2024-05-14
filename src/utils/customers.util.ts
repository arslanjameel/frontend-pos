import { ICustomer } from 'src/models/ICustomer'
import { CASH_CUSTOMER_ACC_TYPE } from './globalConstants'
import { IData } from './types'

export const isCustomerSelected = (
  customer: ICustomer | any,
) => {
  try {
    return customer?.id !== 0
  } catch (e) {
    return false
  }
}

export const isCashCustomer = (
  customer: ICustomer | IData,
) => {
  return customer?.accountType === 'cash'
}

export const isCashCustomerNew = (
  customer: ICustomer | any,
) => {
  return customer?.accountType === CASH_CUSTOMER_ACC_TYPE
}

export const removeCashCustomer = (customer: any) => {
  return customer.filter(
    (c: any) => c.accountType !== CASH_CUSTOMER_ACC_TYPE,
  )
}

export const bringCashCustomerToFront = (
  customersList: ICustomer[],
) => {
  let _customers = customersList

  const cashCustomerIndex = _customers.findIndex(customer =>
    isCashCustomerNew(customer),
  )

  if (cashCustomerIndex !== -1) {
    const cashCustomer = _customers[cashCustomerIndex]

    _customers = _customers.filter(
      (_, i) => i !== cashCustomerIndex,
    )

    _customers.unshift(cashCustomer)
  }

  return _customers
}

export const getCustomerAvailableBalance = (
  customer: ICustomer,
) => {
  const currentNum = parseFloat(customer?.currentCredit)
  const limitNum = parseFloat(customer?.creditLimit)
  const availableNum = limitNum - currentNum

  return availableNum || 0
}
