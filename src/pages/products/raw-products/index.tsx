import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import UseBgColor from 'src/@core/hooks/useBgColor'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import DateRangePicker from 'src/components/global/DateRangePicker'
import FilterMenu from 'src/components/global/FilterMenu'
import PageContainer from 'src/components/global/PageContainer'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import MergeProductsModal from 'src/components/products/MergeProductsModal'
import { useModal } from 'src/hooks/useModal'
import Can from 'src/layouts/components/acl/Can'
import {
  useGetProductsQuery,
  useMergeProductMutation,
} from 'src/store/apis/productsSlice'
import { formatDate } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'

const ProductsPage = () => {
  const { primaryFilled } = UseBgColor()
  const [transactionType, setTransactionType] = useState(11)
  const [dateRange, setDateRange] = useState<string[]>([
    new Date().toLocaleDateString(),
    new Date().toLocaleDateString(),
  ])

  const [query, setQuery] = useState({
    search: '',
    page: 1,
    status: '',
    temp: true,
  })
  const { data: products, isLoading } =
    useGetProductsQuery(query)
  const [mergeProduct] = useMergeProductMutation()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const {
    modalData: mergeModal,
    openModal: openMergeModal,
    closeModal: closeMergeModal,
    isModalOpen: mergeModalStatus,
  } = useModal<IData>()

  const _mergeProducts = (values: any) => {
    if (mergeModal) {
      const newValues = { ...values }
      newValues.id = mergeModal.id
      mergeProduct(newValues)
        .unwrap()
        .then(() => {
          closeMergeModal()
          toast.success('Product merged')
        })
        .catch(() => toast.error('An error occurred'))
    }
  }

  const _deleteRawProduct = () => {
    if (deleteModal) {
      toast.success('Product deleted')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'TEMP ID',
      width: 110,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 15 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      minWidth: 80,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'PRODUCT NAME',
      type: 'string',
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 15 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'brand',
      headerName: 'BRAND',
      headerAlign: 'center',
      align: 'center',
      width: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 15 }}>
          {params.value.name}
        </Typography>
      ),
    },
    {
      field: 'price',
      headerName: 'PRICE',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            params.row.product_price[0].price_a,
          )}
        </Typography>
      ),
    },
    {
      field: 'cost',
      headerName: 'COST',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            params.row.product_price[0].unit_cost,
          )}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'CREATED AT',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 15 }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'created_by',
      headerName: 'USER',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 15 }}>
          {params.value.first_name} {params.value.last_name}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      disableColumnMenu: true,
      width: 105,
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Can I='delete' a='product'>
              <IconButton
                color='error'
                onClick={() =>
                  openDeleteModal(params.row.id)
                }
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Can>

            <Can I='update' a='product'>
              <IconButton
                sx={{
                  ...primaryFilled,
                  borderRadius: '9px !important',
                  '&:hover': { ...primaryFilled },
                }}
                color='primary'
                onClick={() => openMergeModal(params.row)}
              >
                <Icon icon='tabler:git-merge' />
              </IconButton>
            </Can>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          {
            label: 'Raw Products',
            to: '/products/raw-products',
          },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          {isLoading ? (
            <FallbackSpinner brief />
          ) : (
            <AppTable
              columns={columns}
              rows={products ? products.results : []}
              miniColumns={['product_name']}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              showPageSizes={false}
              onPageChange={val => {
                const filter = { ...query }
                filter.page = val
                setQuery(filter)
              }}
              totalRows={products?.count}
              leftActionBtns={
                <Box sx={{ flex: 1, maxWidth: 400 }}>
                  <TableSearchInput
                    value={query.search}
                    onChange={val => {
                      const filter = { ...query }
                      filter.search = val
                      setQuery(filter)
                    }}
                    sx={{ minWidth: '200px' }}
                  />
                </Box>
              }
              secondaryActionBtns={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    width: '100%',
                    flex: 2,
                  }}
                >
                  <FilterMenu>
                    <DateRangePicker
                      value={dateRange}
                      onChange={val => setDateRange(val)}
                    />
                    <Box sx={{ height: 5 }}></Box>
                    <AppSelect
                      label=''
                      placeholder='Transaction Type'
                      value={transactionType}
                      handleChange={e =>
                        setTransactionType(e.target.value)
                      }
                      options={[
                        { label: 'Pending', value: 0 },
                        { label: 'Completed', value: 1 },
                      ]}
                    />
                  </FilterMenu>
                </Box>
              }
            />
          )}
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.productName}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Temp Id:': tableData.tempId,
                'SKU:': tableData.sku,
                'Product Name:': tableData.productName,
                'Brand:': tableData.brand,
                'Price:': formatCurrency(tableData.price),
                'Cost:': formatCurrency(tableData.cost),
                'Created At:': tableData.createdAt,
                'User:': tableData.user,
              }
            : {}
        }
        actionBtns={
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Can I='delete' a='product'>
              <Button
                startIcon={<Icon icon='tabler:trash' />}
                variant='tonal'
                color='error'
                onClick={() => {
                  openDeleteModal(tableData && tableData.id)
                  closeTableDataModal()
                }}
              >
                Delete
              </Button>
            </Can>

            <Can I='update' a='product'>
              <Button
                startIcon={<Icon icon='tabler:git-merge' />}
                variant='contained'
                onClick={() => {
                  openMergeModal(tableData || {})
                  closeTableDataModal()
                }}
              >
                Merge
              </Button>
            </Can>
          </Box>
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Product'
        content={
          'Are you sure you want to delete this product?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteRawProduct}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <MergeProductsModal
        open={mergeModalStatus()}
        handleClose={closeMergeModal}
        onSubmit={_mergeProducts}
        productData={mergeModal}
      />
    </>
  )
}

ProductsPage.acl = {
  action: 'read',
  subject: 'products-section',
}

export default ProductsPage
