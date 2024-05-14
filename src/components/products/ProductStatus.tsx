import React from 'react'
import CustomTag from '../global/CustomTag'

interface Props {
  status: 'pending' | 'published' | 'discontinued'
  isClickable?: boolean
}

const ProductStatus = ({ status, isClickable }: Props) => {
  switch (status) {
    case 'pending':
      return (
        <CustomTag
          sx={{ cursor: isClickable ? 'pointer' : 'auto' }}
          size='small'
          label='Pending'
          color='warning'
        />
      )
    case 'published':
      return (
        <CustomTag
          sx={{ cursor: isClickable ? 'pointer' : 'auto' }}
          size='small'
          label='Published'
          color='success'
        />
      )
    case 'discontinued':
      return (
        <CustomTag
          sx={{ cursor: isClickable ? 'pointer' : 'auto' }}
          size='small'
          label='Discontinued'
          color='secondary'
        />
      )

    default:
      return (
        <CustomTag
          size='small'
          label='Discontinued'
          color='default'
        />
      )
  }
}

export default ProductStatus
