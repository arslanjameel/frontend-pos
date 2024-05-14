import { useState } from 'react'

export function useModal<T>() {
  const [modalData, setModalData] = useState<T | false>(
    false,
  )

  const openModal = (data?: T) =>
    setModalData(data || (1 as T))
  const closeModal = () => setModalData(false)

  const isModalOpen = () => typeof modalData !== 'boolean'

  return { modalData, isModalOpen, openModal, closeModal }
}
