import {
  Box,
  Card,
  IconButton,
  Switch,
  Typography,
} from '@mui/material'
import React from 'react'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { IVariation } from 'src/@fake-db/products'

interface Props {
  productVariations: IVariation[]
  changeVariations: (vals: IVariation[]) => void
  cardId?: string
}

const ProductVariations = ({
  productVariations,
  changeVariations,
  cardId = 'productVariation',
}: Props) => {
  return (
    <Card
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 17 }}
        id={cardId}
      >
        Product Variations
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {productVariations.map(variation => (
          <Box
            sx={{
              display: 'flex',
              gap: 5,
              flexWrap: 'wrap',
            }}
            key={variation.id}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ mb: -1, fontWeight: 600 }}>
                Same Product
              </Typography>
              <Switch
                value={variation.isSameProduct}
                onChange={event => {
                  let currentValues = productVariations
                  currentValues = currentValues.map(v =>
                    variation.id === v.id
                      ? {
                          ...v,
                          isSameProduct:
                            event.target.value === 'on',
                        }
                      : v,
                  )
                  changeVariations(currentValues)
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <CustomTextField
                type='text'
                fullWidth
                label='Product SKU'
                value={variation.productSku}
                onChange={event => {
                  let currentValues = productVariations
                  currentValues = currentValues.map(v =>
                    variation.id === v.id
                      ? {
                          ...v,
                          productSku: event.target.value,
                        }
                      : v,
                  )
                  changeVariations(currentValues)
                }}
                placeholder='Enter Product SKU'
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomTextField
                type='text'
                fullWidth
                label='Description'
                value={variation.productDescription}
                onChange={event => {
                  let currentValues = productVariations
                  currentValues = currentValues.map(v =>
                    variation.id === v.id
                      ? {
                          ...v,
                          productDescription:
                            event.target.value,
                        }
                      : v,
                  )
                  changeVariations(currentValues)
                }}
                placeholder={'Product Description'}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Box>
        <IconButton
          color='primary'
          sx={{
            border: `1.5px solid #ddd`,
            borderRadius: '9px !important',
          }}
          onClick={() => {
            changeVariations([
              ...productVariations,
              {
                id: Date.now(),
                isSameProduct: false,
                productSku: '',
                productDescription: '',
              },
            ])
          }}
        >
          <Icon icon='tabler:plus' />
        </IconButton>
      </Box>
    </Card>
  )
}

export default ProductVariations
