import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

import Icon from 'src/@core/components/icon'
import AppModal from '../global/AppModal'
import { IData } from 'src/utils/types'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { formatCurrency } from 'src/utils/formatCurrency'
import { useGetMergeProductListingQuery } from 'src/store/apis/productsSlice'
import { useAppSelector } from 'src/store/hooks'
import ProductsDropdown from './ProductsDropdown'
import { useAuth } from 'src/hooks/useAuth'
import { flattenProductInfo } from 'src/utils/productUtils'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: any) => void
  productData: IData | false
}

const MergeProductsModal = ({
  open,
  handleClose,
  onSubmit,
  productData,
}: Props) => {
  const router = useRouter()
  const { user } = useAuth()
  const { primaryFilled } = UseBgColor()
  const { store } = useAppSelector(state => state.app)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState({
    id: 0,
    name: '',
    brand: '',
    description: '',
    price: 0,
    sku: '',
  })
  const { data: products } = useGetMergeProductListingQuery(
    { search: search, store: store?.id },
  )

  const createNewProduct = () => {
    window.localStorage.setItem(
      'newProductInfo',
      JSON.stringify(productData),
    )
    router.push('/products/new')
  }

  const ItemCon = ({
    icon,
    title,
    value,
    active = false,
  }: {
    icon: string
    title: string
    value: string
    active?: boolean
  }) => (
    <Box
      sx={{ display: 'flex', gap: 3, alignItems: 'center' }}
    >
      <Box
        sx={{
          background: active
            ? primaryFilled.backgroundColor
            : '#eaeaea',
          color: active ? '#fff' : '#808080',
          width: 42,
          height: 42,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon icon={icon} />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 13.5, opacity: 0.7 }}>
          {title}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={700}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 6,
          pt: 3,
        }}
      >
        <Typography
          variant='h4'
          fontWeight={600}
          textAlign='center'
        >
          Merge Products
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
          Select the products to merge
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', mb: 5, mx: 3 }}>
        <ProductsDropdown
          options={
            products ? flattenProductInfo(products) : []
          }
          onSelect={(data: any) => {
            setSelectedProduct({
              id: data.id,
              name: data.product_name,
              brand: data.brand.name,
              description: data.description,
              price: Number(data.product_price[0].price_c),
              sku: data.sku,
            })
          }}
          onSearch={(search: string) => setSearch(search)}
        />
      </Box>

      {productData && (
        <Box
          sx={{
            display: 'flex',

            // flexWrap: 'wrap',
            mx: 3,
            mb: 3,
            rowGap: 5,
          }}
        >
          <Box
            sx={{
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <ItemCon
              active
              icon='tabler:file-description'
              title='TEMP ID'
              value={productData.id}
            />
            <ItemCon
              icon='tabler:box'
              title='SKU'
              value={productData.sku}
            />
            <ItemCon
              icon='tabler:box'
              title='SKU'
              value={productData.brand.name}
            />
            <ItemCon
              icon='tabler:database'
              title='NAME'
              value={productData.product_name}
            />
            <ItemCon
              icon='tabler:credit-card'
              title='PRICE'
              value={formatCurrency(
                productData.product_price[0].price_a,
              )}
            />
            <ItemCon
              icon='tabler:check'
              title='COST'
              value={formatCurrency(
                productData.product_price[0].unit_cost,
              )}
            />
          </Box>

          {selectedProduct.id !== 0 ? (
            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                borderLeft: '1.5px solid #4a4a4a29',
                pl: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 200,
                  }}
                >
                  <Typography
                    sx={{
                      color: primaryFilled.backgroundColor,
                    }}
                  >
                    {selectedProduct.brand}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 18, fontWeight: 600 }}
                  >
                    {selectedProduct.name}
                  </Typography>
                  <Typography sx={{ opacity: 0.8 }}>
                    Product SKU: {selectedProduct.sku}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Typography
                      sx={{ fontSize: 25, fontWeight: 600 }}
                    >
                      {formatCurrency(
                        selectedProduct.price,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography sx={{ mt: 2 }}>
                {selectedProduct.description}
              </Typography>

              <Box
                sx={{
                  mt: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  alignItems: 'center',
                }}
              >
                <Button
                  variant='outlined'
                  onClick={createNewProduct}
                >
                  Create New Product
                </Button>
                <Button
                  variant='contained'
                  onClick={() =>
                    onSubmit({
                      actual_product_id: selectedProduct.id,
                      is_merged_product: true,
                      created_by: user?.id,
                      store: store?.id,
                    })
                  }
                >
                  Merge Product
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                px: 3,
                width: '100%',
                borderLeft: '1.5px solid #4a4a4a29',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px dashed #4a4a4a29',
                }}
              >
                <Typography>No Product Selected</Typography>
              </Box>
              <Button
                sx={{ width: '100%' }}
                variant='outlined'
                onClick={createNewProduct}
              >
                Create New Product
              </Button>
            </Box>
          )}
        </Box>
      )}
    </AppModal>
  )
}

export default MergeProductsModal
