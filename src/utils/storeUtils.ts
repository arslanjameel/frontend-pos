import { IStore } from 'src/models/IStore'

export const isStoreSelected = (store: any) =>
  store ? (store.id !== 0 ? true : false) : false

/**
 *
 * Get current store address as an array: to be used in PDFs
 */
export const getSelectedStoreAddressArr = (
  store: IStore,
  params: { cityName: string; contryName?: string },
) => {
  return [
    store.storeAddress,
    params.cityName,
    store.postalCode,
  ]
}

export const isStoreB2B = (store?: IStore) => {
  return store?.storeType?.toLowerCase() === 'b2b'
}

export const isStoreB2C = (store?: IStore) => {
  return store?.storeType?.toLowerCase() === 'b2c'
}
