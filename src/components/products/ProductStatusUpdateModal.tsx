import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import AppModal from '../global/AppModal'
import PublishStatusCard from '../global/PublishStatusCard'
import { useUpdateProductStatusMutation } from 'src/store/apis/productsSlice'
import toast from 'react-hot-toast'

interface Props {
  title: string
  subTitle: string
  open: boolean
  handleClose: () => void
  data: any
}

const ProductStatusUpdateModal = ({
  title,
  subTitle,
  open,
  handleClose,
  data,
}: Props) => {
  const [updateStatus] = useUpdateProductStatusMutation()
  const checkStatusTypeNumber = (status: string) => {
    switch (status) {
      case 'pending':
        return 0
      case 'published':
        return 1
      case 'discontinued':
        return 2
      default:
        return 0
    }
  }

  const checkStatusTypeString = (status: number) => {
    switch (status) {
      case 0:
        return 'pending'
      case 1:
        return 'published'
      case 2:
        return 'discontinued'
      default:
        return 'discontinued'
    }
  }

  const [status, setStatus] = useState(
    checkStatusTypeNumber(data.product_status),
  )

  const handleSubmit = () => {
    const obj = {
      product_status: checkStatusTypeString(status),
    }
    updateStatus({ id: data.id, body: obj })
      .unwrap()
      .then(() => {
        handleClose()
      })
      .catch(() => toast.error('An error occurred'))
  }

  useEffect(() => {
    setStatus(checkStatusTypeNumber(data.product_status))
  }, [data.product_status])

  return (
    <AppModal
      open={open}
      handleClose={() => {
        handleClose()
        checkStatusTypeNumber(data.product_status)
      }}
      title={title}
      subTitle={subTitle}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <PublishStatusCard
          value={status}
          name=''
          changeValues={val => setStatus(val)}
        />
        <Button onClick={handleSubmit} variant='contained'>
          Update
        </Button>
      </Box>
    </AppModal>
  )
}

export default ProductStatusUpdateModal
