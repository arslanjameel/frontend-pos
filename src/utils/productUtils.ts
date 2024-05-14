import { IPriceBand } from 'src/models/ICustomer'
import { IProductPrice } from 'src/models/IProductPrice'

export const getPriceBandPrice = (
  priceBand: string,
  prices: IProductPrice,
) => {
  switch (priceBand.toLowerCase()) {
    case 'band_a':
    case 'a':
      return prices.price_a
    case 'band_b':
    case 'b':
      return prices.price_b
    case 'band_c':
    case 'c':
      return prices.price_c

    default:
      return prices.price_c
  }
}

export const getSingleDigitPriceBand = (
  priceBand: IPriceBand,
) => {
  switch (priceBand) {
    case 'Band_A':
      return 'A'
    case 'Band_B':
      return 'B'
    case 'Band_C':
      return 'C'

    default:
      return 'C'
  }
}

/**
 * Used to convert single letter pricebands to IPriceBand e.g., A to Band_A
 *
 * @param priceBand
 * @returns IPriceBand
 */
export const convertPriceband = (
  priceBand: string,
): IPriceBand => {
  try {
    switch (priceBand.toLowerCase()) {
      case 'a':
        return 'Band_A'
      case 'b':
        return 'Band_B'
      case 'c':
        return 'Band_C'
      case 'match_price':
        return 'MATCH_PRICE'

      default:
        return 'Band_C'
    }
  } catch (e) {
    return 'Band_C'
  }
}

export const flattenSingleProduct = (product: any) => {
  const defaultProdPrices = {
    id: 0,
    product: 0,
    price_a: '0',
    price_b: '0',
    price_c: '0',
    unit_cost: '0',
    average_unit_cost: '0',
    is_active: false,
    end_date_at: null,
    updated_at: '2024-02-28T22:42:34.767938Z',
    created_at: '2024-02-28T22:42:34.767952Z',
  }

  const defaultProdStock = {
    id: 0,
    product: 0,
    supplier_stock: [],
    quantity: 0,
    quantity_to_be_ordered: 0,
    temp_product_quantity: 0,
    deleted: false,
    is_active: true,
    delivery_date: null,
    created_at: '2024-02-28T22:39:24.190426Z',
    updated_at: '2024-02-28T22:39:24.190443Z',
    store: 0,
  }

  const updatedProd = { ...product }
  updatedProd.price =
    updatedProd.product_price.length > 0
      ? { ...updatedProd.product_price[0] }
      : defaultProdPrices
  updatedProd.stock =
    updatedProd.product_stock.length > 0
      ? { ...updatedProd.product_stock[0] }
      : defaultProdStock

  return updatedProd
}

/**
 * Flattening the prices and stock data i.e., they originally come in an array so we add them as objects
 *
 * @param data list of products to flatten
 * @returns a list of flattened products
 */
export const flattenProductInfo = (data: any) => {
  try {
    if (data) {
      const updatedArray = (data || [])?.map(
        flattenSingleProduct,
      )

      return updatedArray
    }

    return []
  } catch (e) {
    return []
  }
}
