import React, { useState } from 'react'
import ConfirmationModal from 'src/components/global/ConfirmationModal'

// type Props = {}

interface ModalProps {
  title: string
  content: string | React.ReactNode
  confirmTitle: string
  confirmColor?:
    | 'primary'
    | 'success'
    | 'error'
    | 'secondary'
  onConfirm: () => void
  rejectTitle: string
  rejectColor?:
    | 'primary'
    | 'success'
    | 'error'
    | 'secondary'
  onReject: () => void
}

const useConfirmationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<
    number | false
  >(false)
  const openModal = (id: number) => setIsModalOpen(id)
  const closeModal = () => setIsModalOpen(false)

  const Modal = ({
    title,
    content,
    confirmTitle,
    confirmColor = 'primary',
    onConfirm,
    rejectTitle,
    rejectColor = 'secondary',
    onReject,
  }: ModalProps) => (
    <ConfirmationModal
      open={typeof isModalOpen === 'number'}
      handleClose={closeModal}
      title={title}
      content={content}
      confirmTitle={confirmTitle}
      confirmColor={confirmColor}
      onConfirm={onConfirm}
      rejectTitle={rejectTitle}
      rejectColor={rejectColor}
      onReject={onReject}
    />
  )

  return { isModalOpen, openModal, closeModal, Modal }
}

export default useConfirmationModal
