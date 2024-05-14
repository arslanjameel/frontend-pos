export default interface IStockInfo {
  deliveryStore: string
  supplierName: string
  quantity: number
  unitCost: number
  expectedDeliveryDate: string
  floor: string
  section: string
  sameAsCurrentStock: boolean
}
