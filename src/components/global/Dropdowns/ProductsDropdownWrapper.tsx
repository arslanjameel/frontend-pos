import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import CustomTextField from 'src/@core/components/mui/text-field'
import { addVAT } from 'src/utils/dataUtils'
import { useModal } from 'src/hooks/useModal'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  convertPriceband,
  flattenProductInfo,
  getPriceBandPrice,
} from 'src/utils/productUtils'
import {
  useCheckPriceMatchMutation,
  useGetStoreProductsSearchQuery,
} from 'src/store/apis/productsSlice'
import { useProductsDropdown } from 'src/hooks/product/useProductsDropdown'
import Icon from 'src/@core/components/icon'
import AppTable from '../AppTable'
import AppSelect from '../AppSelect'
import InternalNotesModal from '../InternalNotesModal'
import NotesBtnWithPopover from '../NotesBtnWithPopover'
import ManagerApprovalModal from '../Modals/ManagerApprovalModal'
import PriceMatchModal from 'src/components/invoices/PriceMatchModal'
import {
  IProductDeliveryMode,
  IProductDeliveryStatus,
  IProductStatus,
} from 'src/models/ISaleInvoice'
import ProductDeliveryModePicker from './ProductDeliveryModePicker'
import { inputAllows } from 'src/utils/inputUtils'
import { useAuth } from 'src/hooks/useAuth'
import { isUserAManager } from 'src/utils/rolesUtils'
import { useAppSelector } from 'src/store/hooks'
import ProductsDropdown from './ProductsDropdown'

interface Props {
  defaultProducts?: any[]
  selectedCustomer?: any
  toOrder: boolean
  toTransfer?: boolean
  status: boolean
  setProduct: (data: any[]) => void
  readOnly?: boolean
  default_delivery_mode?: IProductDeliveryMode
}

const ProductsDropdownWrapper = ({
  defaultProducts,
  selectedCustomer,
  toOrder,
  toTransfer,
  status,
  setProduct,
  readOnly,
  default_delivery_mode,
}: Props) => {
  const { user } = useAuth()
  const { store } = useAppSelector(state => state.app)

  const [priceMatch, setPriceMatch] = useState({
    competitor_link: '',
    competitor_price: 0,
    new_price: 0,
    notes: '',
    product: 0,
  })

  const searchInputRef = useRef(null)
  const [search, setSearch] = useState('')

  const { data: products, refetch: refetchProducts } =
    useGetStoreProductsSearchQuery({
      query: search,
      storeId: store?.id,
    })
  const [checkPriceMatch] = useCheckPriceMatchMutation()

  const {
    openModal: openManagerApprovalModal,
    closeModal: closeManagerApprovalModal,
    isModalOpen: managerApprovalModalStatus,
  } = useModal<any>()

  const {
    modalData: productNotesInfo,
    openModal: openNotesModal,
    closeModal: closeNotesModal,
    isModalOpen: notesModalStatus,
  } = useModal<any>()

  const {
    modalData: priceMatchInfo,
    openModal: openPriceMatchModal,
    closeModal: closePriceMatchModal,
    isModalOpen: priceMatchModalStatus,
  } = useModal<any>()

  const calculateTotal = (data: any) => {
    return (
      (Number(data.base_price) + addVAT(data.base_price)) *
        data.quantity -
      data.discount * data.quantity
    ).toFixed(2)
  }

  const {
    overallStatus,
    selectedProducts,
    getProductOptions,
    setSelectedProducts,
    updateOverallStatus,
    updateSelectedProduct,

    // handleOnSelectProduct,
    handleProductSelect,
    removeSelectedProduct,
  } = useProductsDropdown(
    products ? flattenProductInfo(products) : [],
    search,
    setSearch,
    {
      priceBand: selectedCustomer?.priceBand,
      defaultProducts,
      readOnly,
      default_delivery_mode,
    },
    selectedCustomer?.priceBand,
  )

  useEffect(() => {
    setProduct(selectedProducts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])

  const getProductDeliveryStatus = (
    deliveryMode: IProductStatus,
  ): IProductDeliveryStatus => {
    if (
      deliveryMode === 'collected' ||
      deliveryMode === 'supplier_delivery'
    )
      return 'completed'

    return 'pending'
  }

  const priceBand = {
    Band_A: 'A',
    Band_B: 'B',
    Band_C: 'C',
  }

  const specialPriceBand = {
    Band_A: 'A',
    Band_B: 'B',
    Band_C: 'C',
    MATCH_PRICE: 'SP',
  }

  const columns: GridColDef[] = [
    {
      field: 'delivery_mode',
      headerName: 'STATUS',
      width: 110,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <ProductDeliveryModePicker
          status={overallStatus as any}
          onChange={newStatus => {
            !readOnly &&
              updateOverallStatus(newStatus as any)
          }}
        />
      ),
      renderCell: params => (
        <ProductDeliveryModePicker
          status={params.value}
          onChange={newDeliveryMode => {
            if (!readOnly) {
              let tempProducts = [...selectedProducts]
              tempProducts = tempProducts.map(prod =>
                prod.id === params.row.id
                  ? {
                      ...prod,
                      delivery_mode: newDeliveryMode,
                      product_delivery_status:
                        getProductDeliveryStatus(
                          newDeliveryMode,
                        ),
                      quantity_delivered:
                        getProductDeliveryStatus(
                          newDeliveryMode,
                        ) === 'completed'
                          ? prod.quantity
                          : 0,
                    }
                  : prod,
              )
              setSelectedProducts(tempProducts)
            }
          }}
        />
      ),
    },
    {
      field: 'product_name',
      headerName: 'PRODUCT NAME',
      type: 'string',
      minWidth: 180,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight={500} fontSize={16}>
            {params.value}
          </Typography>
          <Typography variant='body2'>
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'price_band',
      headerName: 'BAND',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      disableColumnMenu: true,
      renderCell: params => {
        return (
          <AppSelect
            maxWidth={60}
            readOnly={readOnly}
            value={
              params?.value?.toLowerCase().includes('band')
                ? params.value
                : convertPriceband(params.value)
            }
            options={Object.entries(
              params.value == 'MATCH_PRICE'
                ? specialPriceBand
                : priceBand,
            ).map(val => ({
              label: val[1],
              value: val[0],
            }))}
            handleChange={e => {
              const newPriceBand = e.target.value
              const newUnitPrice = getPriceBandPrice(
                newPriceBand,
                params.row.price,
              )

              let tempProducts = [...selectedProducts]
              tempProducts = tempProducts.map(prod =>
                prod.id === params.row.id
                  ? {
                      ...prod,
                      unit_price: newUnitPrice,
                      base_price: newUnitPrice.toString(),
                      total: newUnitPrice * prod.quantity,
                      price_band: newPriceBand,
                      discount: 0,
                    }
                  : prod,
              )
              setSelectedProducts(tempProducts)
            }}
          />
        )
      },
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          placeholder='QTY'
          type='number'
          value={params.value}
          InputProps={{ readOnly }}
          onChange={e => {
            const quantityVal = Number(
              inputAllows(e.target.value, ['numbers']),
            )

            if (quantityVal > 0) {
              let tempProducts = [...selectedProducts]
              tempProducts = tempProducts.map(prod =>
                prod.id === params.row.id
                  ? {
                      ...prod,
                      quantity: quantityVal,
                      total:
                        quantityVal * params.row.unit_price,
                    }
                  : prod,
              )
              setSelectedProducts(tempProducts)
            }
          }}
        />
      ),
    },
    {
      field: 'base_price',
      headerName: 'UNIT PRICE',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value).toFixed(2))}
        </Typography>
      ),
    },
    {
      field: 'alternate_sku',
      headerName: 'VAT INC',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            (
              Number(params.row.base_price) +
              addVAT(params.row.base_price)
            ).toFixed(2),
          )}
        </Typography>
      ),
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            Number(
              params.row.discount * params.row.quantity,
            ).toFixed(2),
          )}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(calculateTotal(params.row))}
        </Typography>
      ),
    },

    // {
    //   field: 'transfer_stock',
    //   headerName: 'TRANSFER STOCK',
    //   type: 'string',
    //   headerAlign: 'center',
    //   align: 'center',
    //   minWidth: 130,
    //   flex: 1,
    //   maxWidth: 150,
    //   disableColumnMenu: true,
    //   renderCell: params => (
    //     <Checkbox
    //       checked={Boolean(params.value)}
    //       onChange={(_, checked) =>
    //         !readOnly &&
    //         updateSelectedProduct(
    //           params.row.id,
    //           'transfer_stock',
    //           checked,
    //         )
    //       }
    //     />
    //   ),
    // },
    {
      field: 'ordered',
      headerName: 'TO ORDER',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      minWidth: 130,
      flex: 1,
      maxWidth: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Checkbox
          checked={Boolean(params.value)}
          onChange={(_, checked) =>
            !readOnly &&
            updateSelectedProduct(
              params.row.id,
              'ordered',
              checked,
            )
          }
        />
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 130,
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <NotesBtnWithPopover
              product_note={params.row.product_note}
              onClick={() =>
                readOnly
                  ? null
                  : openNotesModal({
                      product_note: params.row.product_note,
                      id: params.row.id,
                    })
              }
            />
            <IconButton
              color='primary'
              onClick={() =>
                !readOnly && openPriceMatchModal(params.row)
              }
            >
              <Icon icon='tabler:currency-pound' />
            </IconButton>
            <IconButton
              color='error'
              onClick={() =>
                !readOnly &&
                removeSelectedProduct(params.row.id)
              }
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const items = (
    array: GridColDef[],
    status: boolean,
    toOrder: boolean,
    toTransfer: boolean,
  ) => {
    let filteredColumns: any[] = array

    if (!status)
      filteredColumns = filteredColumns.filter(
        obj => obj.field !== 'status',
      )

    if (!toOrder)
      filteredColumns = filteredColumns.filter(
        obj => obj.field !== 'ordered',
      )

    if (!toTransfer)
      filteredColumns = filteredColumns.filter(
        obj => obj.field !== 'transfer_stock',
      )

    return filteredColumns
  }

  const onManagerApproval = (_priceMatch?: any) => {
    checkPriceMatch(_priceMatch || priceMatch).then(() => {
      const updatedProducts = selectedProducts.map(
        product => {
          if (
            product.id ===
            (_priceMatch || priceMatch).product
          ) {
            return {
              ...product,
              price_band: 'MATCH_PRICE',
              discount: Math.abs(
                product.base_price * 1.2 -
                  (_priceMatch || priceMatch).new_price,
              ).toFixed(2),
            }
          }

          return product
        },
      )

      setSelectedProducts(updatedProducts)

      closePriceMatchModal()
    })
  }

  return (
    <>
      <Card sx={{ p: 4, px: 5, mt: 6 }}>
        <ProductsDropdown
          searchInputRef={searchInputRef}
          readOnly={readOnly}
          search={search}
          onSearch={setSearch}
          options={getProductOptions()}
          onSelect={product => {
            handleProductSelect(product)
            setSearch('')

            // @ts-ignore
            searchInputRef?.current?.blur()
            refetchProducts()
          }}

          // refetchProducts={refetchProducts}
        />
        <AppTable
          columns={items(
            columns,
            status,
            toOrder,
            toTransfer || false,
          )}
          rows={selectedProducts}
          showToolbar={false}
          showSearch={false}
          pagination={false}
          autoHeight
        />
      </Card>

      <PriceMatchModal
        open={priceMatchModalStatus()}
        handleClose={closePriceMatchModal}
        priceMatchInfo={priceMatchInfo}
        onSubmit={values => {
          setPriceMatch(values)

          if (isUserAManager(user)) {
            onManagerApproval(values)
          } else {
            openManagerApprovalModal(1)
          }
        }}
      />

      <ManagerApprovalModal
        open={managerApprovalModalStatus()}
        handleClose={closeManagerApprovalModal}
        onApprove={onManagerApproval}
      />

      <InternalNotesModal
        defaultValues={productNotesInfo}
        open={notesModalStatus()}
        onSubmit={({ product_note }) => {
          updateSelectedProduct(
            productNotesInfo.id,
            'product_note',
            product_note,
          )
          closeNotesModal()
        }}
        handleClose={closeNotesModal}
      />
    </>
  )
}

export default ProductsDropdownWrapper
