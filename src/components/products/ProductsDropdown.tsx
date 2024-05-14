import { Box, MenuItem, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { formatCurrency } from 'src/utils/formatCurrency'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { generateID } from 'src/utils/dataUtils'
import { IProduct } from 'src/models/IProduct'

interface Props {
  label?: string
  value?: any[]
  onSelect?: (id: number) => void
  options: any[]
  onSearch: (value: string) => void
  readOnly?: boolean
}

const ProductItem = ({
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
      <Typography
        sx={{
          minWidth: 100,
          color: active ? '#fff' : 'inherit',
        }}
      >
        {product.sku}
      </Typography>
      <Typography
        sx={{
          flex: 1,
          color: active ? '#fff' : 'inherit',
          maxWidth: 360,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {product.product_name}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
      <Typography sx={{ textAlign: 'left', flex: 1 }}>
        {formatCurrency(
          Number(product.price?.price_c).toFixed(2) || 0,
        )}
      </Typography>
    </Box>
  </Box>
)

const ProductsDropdown = ({
  label,
  onSelect,
  options,
  onSearch,
}: Props) => {
  return (
    <>
      <Box>
        <CustomAutocomplete
          onInputChange={event => {
            const e = event.target as HTMLInputElement
            onSearch(e.value)
          }}
          fullWidth
          options={
            options.length === 0
              ? []
              : options.map(option => ({
                  ...option,
                  searchable:
                    option.product_name + ',' + option.sku,
                }))
          }
          renderInput={params => (
            <CustomTextField
              {...params}
              label={label}
              fullWidth
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
          getOptionLabel={option => option.searchable}
          renderOption={(props, option) => (
            <Box key={generateID() + 1}>
              {option.id && (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  onClick={() =>
                    onSelect && onSelect(option)
                  }
                >
                  <ProductItem
                    product={option}
                    active={false}
                  />
                </MenuItem>
              )}
            </Box>
          )}
        />
      </Box>
    </>
  )
}

export default ProductsDropdown
