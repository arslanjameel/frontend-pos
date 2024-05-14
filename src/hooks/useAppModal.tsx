import React, { useState } from 'react'

import AppModal from 'src/components/global/AppModal'

interface ModalProps {
  open: boolean
  handleClose: () => void
  width?: number
  maxWidth?: number
  zIndex?: number
  maxHeight?: number | string
  children: React.ReactNode
}

const useAppModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const Modal = ({
    open,
    handleClose,
    width,
    maxWidth,
    zIndex,
    maxHeight,
    children,
  }: ModalProps) => (
    <AppModal
      open={open}
      handleClose={handleClose}
      width={width}
      maxWidth={maxWidth}
      zIndex={zIndex}
      maxHeight={maxHeight}
    >
      {children}
    </AppModal>
  )

  return { isModalOpen, openModal, closeModal, Modal }
}

export default useAppModal
