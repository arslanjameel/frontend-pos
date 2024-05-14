import { IStore } from 'src/models/IStore'

const useGetStoreInfo = (stores: IStore[]) => {
  const getStoreName = (storeId: number) => {
    const store = stores.find(
      _store => _store.id === storeId,
    )

    return store ? store.name : 'Store'
  }

  return { getStoreName }
}

export default useGetStoreInfo
