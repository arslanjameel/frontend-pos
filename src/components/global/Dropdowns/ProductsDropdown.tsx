import { Box, MenuItem, Typography } from '@mui/material'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useModal } from 'src/hooks/useModal'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { generateID } from 'src/utils/dataUtils'
import { useCreateProductMutation } from 'src/store/apis/productsSlice'
import AddTemporaryProductModal from '../Modals/AddTemporaryProductModal'
import ProductDropdownItem from '../ProductDropdownItem'
import { flattenSingleProduct } from 'src/utils/productUtils'

interface Props {
  searchInputRef?: any
  label?: string
  value?: any[]
  search?: string
  onSelect?: (product: any) => void
  options: any[]
  onSearch: (value: string) => void
  readOnly?: boolean
  refetchProducts?: () => void
}

const ProductsDropdown = ({
  searchInputRef,
  label,
  onSelect,
  options,
  search,
  onSearch,
  readOnly,
  refetchProducts,
}: Props) => {
  const { primaryFilled, primaryLight } = UseBgColor()

  const [createNewProduct] = useCreateProductMutation()

  const {
    openModal: openTemporaryProductModal,
    closeModal: closeTemporaryProductModal,
    isModalOpen: temporaryProductModalStatus,
  } = useModal<number>()

  return (
    <>
      <Box>
        <CustomAutocomplete
          readOnly={readOnly}
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
              ref={searchInputRef}
              label={label}
              value={search}
              fullWidth
              InputProps={{
                ...params.InputProps,
                readOnly,
              }}
              onChange={e => onSearch(e.target.value)}
            />
          )}
          getOptionLabel={option => option.searchable}
          renderOption={(props, option, state) => (
            <Box
              key={generateID() + 1}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {(state.index === 0 ||
                options.length === 0) && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: '#fff',
                    height: 40,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    px: 8,
                    borderRadius: 1,
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
                        fontWeight: 700,
                      }}
                    >
                      SKU
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        flex: 1,
                      }}
                    >
                      Product Name
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: 'left',
                        maxWidth: 80,
                        flex: 1,

                        fontWeight: 700,
                      }}
                    >
                      Price C
                    </Typography>

                    <Typography
                      sx={{
                        maxWidth: 100,
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      Store Stock
                    </Typography>

                    <Typography
                      sx={{
                        maxWidth: 80,
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      All Stock
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  flex: 1,
                  mt:
                    state.index === 0 ||
                    options.length === 0
                      ? 9
                      : 0,
                }}
              >
                {option.id && (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { searchable, ...rest } = option

                      onSelect &&
                        !readOnly &&
                        onSelect(rest)
                    }}
                  >
                    <ProductDropdownItem
                      product={option}
                      active={false}
                    />
                  </MenuItem>
                )}
                {(state.index + 1 === options.length ||
                  options.length === 0) &&
                  !readOnly && (
                    <Box
                      key={Date.now()}
                      onClick={() =>
                        openTemporaryProductModal(1)
                      }
                      sx={{
                        mx: 2,
                        py: 2,
                        px: 4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 1,
                        zIndex: 1,
                        gap: 3,
                        '&:hover': {
                          background:
                            primaryLight.backgroundColor,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 50,
                          height: 50,
                          background:
                            primaryFilled.backgroundColor,
                        }}
                        onClick={() =>
                          openTemporaryProductModal(1)
                        }
                      >
                        <Icon
                          icon='tabler:square-plus'
                          color='#fff'
                          style={{ fontSize: 28 }}
                        />
                      </Box>

                      <Typography>
                        Create a Temporary Product
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          )}
        />
      </Box>

      <AddTemporaryProductModal
        open={temporaryProductModalStatus()}
        handleClose={closeTemporaryProductModal}
        onSubmit={(values: any) => {
          createNewProduct(values)
            .unwrap()
            .then((res: any) => {
              refetchProducts && refetchProducts()
              onSelect &&
                onSelect(flattenSingleProduct(res))

              toast.success(
                'Temporary Product Created Successfully',
              )
            })
            .catch(() => {
              toast.error('An error occurred')
            })
          closeTemporaryProductModal()
        }}
      />
    </>
  )
}

export default ProductsDropdown
