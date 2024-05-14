import { Box, Typography } from '@mui/material'
import React from 'react'

import { IProduct } from 'src/models/IProduct'
import { formatCurrency } from 'src/utils/formatCurrency'

const ProductDropdownItem = ({
  product,
  active,
}: {
  product: IProduct
  active: boolean
}) => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
    }}
  >
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* <Box
          sx={{ position: 'relative', width: 50, height: 50 }}
        >
          <Image
            src={product.image || '/images/avocado.png'}
            alt='item-img'
            fill
          />
        </Box> */}

      <Typography
        sx={{
          maxWidth: 100,
          flex: 1,
          color: active ? '#fff' : 'inherit',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {product.sku}
      </Typography>
      <Typography
        sx={{ flex: 1, color: active ? '#fff' : 'inherit' }}
      >
        {product.product_name}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        flex: 1,
      }}
    >
      <Typography
        sx={{ textAlign: 'left', maxWidth: 80, flex: 1 }}
      >
        {formatCurrency(
          Number(product.price?.price_c).toFixed(2) || 0,
        )}
      </Typography>

      <Typography
        sx={{
          maxWidth: 120,
          flex: 1,
          textAlign: 'center',
        }}
      >
        {product?.product_stock.length > 0
          ? product?.product_stock[0]?.quantity
          : 0}
      </Typography>

      <Typography
        sx={{
          maxWidth: 50,
          flex: 1,
          textAlign: 'center',
        }}
      >
        {product?.quantity_left || 0}
      </Typography>
    </Box>
  </Box>
)

export default ProductDropdownItem
