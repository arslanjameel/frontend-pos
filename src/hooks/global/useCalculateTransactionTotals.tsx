import { calculateVAT } from 'src/utils/dataUtils'

interface Props {
  products: any[]
  deliveryCost?: number
  paymentMade?: number

  quantityKey?: string
  unitCostKey?: string
  discountKey?: string
}

interface TotalsObject {
  amountDue: number
  delivery: number
  grossAmount: number
  netAmount: number
  productTotal: number
  productTotalIncVAT: number
  vatAmount: number
  discountTotal: number
}

/**
 * Custom hook for calculating transaction totals based on product data: to ensure consistent transaction calculations.
 *
 * @param {Object} props - The hook props.
 * @param {Array} props.products - An array of product objects.
 * @param {number} [props.deliveryCost=0] - The delivery cost.
 * @param {number} [props.paymentMade=0] - The amount already paid - we can get sum of the paid_from_* or payment keys.
 * @param {string} [props.quantityKey='quantity'] - The key for accessing the quantity property in each product.
 * @param {string} [props.unitCostKey='base_price'] - The key for accessing the unit cost property in each product.
 * @param {string} [props.discountKey='discount'] - The key for accessing the discount property in each product.
 *
 * @returns {TotalsObject} - An object containing various calculated transaction totals.
 * @returns {number} return.productTotal - The total cost of all products.
 * @returns {number} return.productTotalIncVAT - The total cost of all products plus VAT.
 * @returns {number} return.delivery - The delivery cost (equal to props.deliveryCost).
 * @returns {number} return.netAmount - The net amount (product total + delivery cost).
 * @returns {number} return.vatAmount - The total VAT amount.
 * @returns {number} return.grossAmount - The gross amount (net amount + VAT).
 * @returns {number} return.amountDue - The amount due after deducting the payment made.
 * @returns {number} return.discountTotal - The total discount applied to products.
 */

const useCalculateTransactionTotals = ({
  products,
  deliveryCost = 0,
  paymentMade = 0,
  unitCostKey = 'base_price',
  quantityKey = 'quantity',
  discountKey = 'discount',
}: Props): TotalsObject => {
  const calculateTransactionTotals = () => {
    const productTotal = products.reduce(
      (total, product) =>
        total +
        Number(product[unitCostKey]) * product[quantityKey],
      0,
    )

    const productTotalIncVAT =
      productTotal + calculateVAT(productTotal)

    const discountTotal = products.reduce(
      (total, product) =>
        total +
        Number(product[discountKey]) *
          Number(product[quantityKey]),
      0,
    )

    const totalVATInc =
      productTotalIncVAT - discountTotal + deliveryCost

    const netAmount = totalVATInc / 1.2

    const vatAmount = calculateVAT(netAmount)

    const grossAmount = totalVATInc

    const amountDue = grossAmount - paymentMade

    return {
      productTotalIncVAT,
      productTotal,
      delivery: deliveryCost,
      netAmount,
      vatAmount,
      grossAmount,
      amountDue,
      discountTotal,
    }
  }

  return calculateTransactionTotals()
}

export default useCalculateTransactionTotals
