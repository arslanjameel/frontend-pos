import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from 'react'

import { IProduct } from 'src/models/IProduct'
import { IProductDeliveryMode } from 'src/models/ISaleInvoice'
import { IPriceBand } from 'src/types/IPriceBand'
import {
  getPriceBandPrice,
  getSingleDigitPriceBand,
} from 'src/utils/productUtils'

type Options = {
  priceBand: IPriceBand
  discount?: number
  defaultProducts?: any[]
  readOnly?: boolean
  default_delivery_mode?: IProductDeliveryMode
}

export function useProductsDropdown(
  productOptions: IProduct[],
  search: string,
  setSearch: Dispatch<SetStateAction<string>>,
  options: Options = {
    priceBand: 'C',
    discount: 0,
    defaultProducts: [],
    default_delivery_mode: 'collected',
  },
  priceBand?: string,
) {
  const [selectedProducts, setSelectedProducts] = useState<
    any[]
  >(options.defaultProducts || [])

  const [useOverallStatus, setUseOverallStatus] =
    useState(false)
  const [overallStatus, setOverallStatus] =
    useState<IProductDeliveryMode>(
      options?.default_delivery_mode || 'collected',
    )

  const getProductOptions = () => {
    return productOptions
      .filter(
        v =>
          !selectedProducts
            .map(sel => sel.id)
            .includes(v.id),
      )
      .slice(0, 10)
  }

  //TODO: Update fucntion name to updateDeliveryMode
  const updateOverallStatus = (
    status: IProductDeliveryMode,
  ) => {
    setUseOverallStatus(true)
    setOverallStatus(status)

    let tempProducts = [...selectedProducts]
    tempProducts = tempProducts.map(prod => ({
      ...prod,
      delivery_mode: status,
    }))
    setSelectedProducts(tempProducts)
  }

  //TODO: Update fucntion name to updateDeliveryMode
  const updateProductStatus = (
    productId: number,
    status: IProductDeliveryMode,
  ) => {
    setSelectedProducts(
      selectedProducts.map(prod =>
        prod.id === productId
          ? { ...prod, delivery_mode: status }
          : prod,
      ),
    )
  }

  const updateOverallPriceBands = useCallback(
    (newPriceBand: any) => {
      let tempProducts = [...selectedProducts]
      tempProducts = tempProducts.map(prod => ({
        ...prod,
        price_band: newPriceBand,
      }))
      setSelectedProducts(tempProducts)
    },
    [selectedProducts],
  )

  /**
   * Pass the complete product object for the selected product to avoid searching for it again (redundant)
   *
   * @param productInfo this is the complete product object
   */
  const handleProductSelect = (productInfo: any) => {
    const tempProducts = [...selectedProducts]

    const newPriceBand = getSingleDigitPriceBand(
      options.priceBand as any,
    )

    if (productInfo) {
      const initialQuantity = 1
      const initialCost = Number(
        getPriceBandPrice(newPriceBand, productInfo.price),
      )

      tempProducts.push({
        id: productInfo.id,
        sku: productInfo.sku,
        alternate_sku: productInfo.alternate_sku || '',
        product_name: productInfo.product_name,
        product_note: '',
        price_band: newPriceBand,
        discount: 0,
        quantity: initialQuantity,
        position: 1,
        unit_price: initialCost,
        average_unit_price:
          productInfo.price.average_unit_cost,
        base_price: initialCost.toString(),
        product: productInfo.id,
        price: productInfo.price,
        total: initialQuantity * initialCost,
        ordered: false,
        delivery_mode: useOverallStatus
          ? overallStatus
          : options?.default_delivery_mode || 'collected',
        product_delivery_status: 'pending',
        quantity_delivered: 0,

        _stock: productInfo.stock?.quantity || 0,
      })
    }
    setSelectedProducts(tempProducts)
  }

  const handleOnSelectProduct = (
    selectedProductId: number,
  ) => {
    const newProduct = productOptions.find(
      v => v.id === selectedProductId,
    )
    const tempProducts = [...selectedProducts]

    const newPriceBand = getSingleDigitPriceBand(
      options.priceBand as any,
    )

    if (newProduct) {
      const initialQuantity = 1
      const initialCost = Number(
        getPriceBandPrice(newPriceBand, newProduct.price),
      )

      tempProducts.push({
        id: newProduct.id,
        sku: newProduct.sku,
        alternate_sku: newProduct.alternate_sku || '',
        product_name: newProduct.product_name,
        product_note: '',
        price_band: newPriceBand,
        discount: 0,
        quantity: initialQuantity,
        position: 1,
        unit_price: initialCost,
        average_unit_price:
          newProduct.price.average_unit_cost,
        base_price: initialCost.toString(),
        product: newProduct.id,
        price: newProduct.price,
        total: initialQuantity * initialCost,
        ordered: false,
        delivery_mode: useOverallStatus
          ? overallStatus
          : options?.default_delivery_mode || 'collected',
        product_delivery_status: 'pending',
        quantity_delivered: 0,

        _stock: newProduct.stock?.quantity || 0,
      })
    }
    setSelectedProducts(tempProducts)
  }

  const updateSelectedProduct = (
    productId: number,
    key: string,
    value: any,
  ) => {
    setSelectedProducts(
      selectedProducts.map(prod =>
        prod.id === productId
          ? { ...prod, [key]: value }
          : prod,
      ),
    )
  }

  const removeSelectedProduct = (id: number) => {
    setSelectedProducts(
      selectedProducts.filter(prod => prod.id !== id),
    )
  }

  useEffect(() => {
    if (options.defaultProducts) {
      setSelectedProducts(options.defaultProducts)
    }
  }, [options.defaultProducts])

  useEffect(() => {
    if (priceBand) {
      updateOverallPriceBands(priceBand)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceBand])

  return {
    selectedProducts,
    overallStatus,
    getProductOptions,
    setSelectedProducts,
    updateOverallPriceBands,
    updateOverallStatus,
    updateProductStatus,
    updateSelectedProduct,
    handleProductSelect,
    handleOnSelectProduct,
    removeSelectedProduct,
  }
}
