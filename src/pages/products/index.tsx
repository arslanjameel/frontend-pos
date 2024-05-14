import { Icon } from '@iconify/react'
import { Box, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import UseBgColor from 'src/@core/hooks/useBgColor'
import AppSelect from 'src/components/global/AppSelect'

import AppTable from 'src/components/global/AppTable'
import DateRangePicker from 'src/components/global/DateRangePicker'
import FilterMenu from 'src/components/global/FilterMenu'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import ProductStatus from 'src/components/products/ProductStatus'
import ProductStatusUpdateModal from 'src/components/products/ProductStatusUpdateModal'
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Can, {
  AbilityContext,
} from 'src/layouts/components/acl/Can'
import {
  useGetProductsQuery,
  useUploadProductMutation,
} from 'src/store/apis/productsSlice'
import { useAppSelector } from 'src/store/hooks'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'

const ProductsPage = () => {
  const ability = useContext(AbilityContext)

  const [query, setQuery] = useState({
    search: '',
    page: 1,
    status: '',
    temp: false,
  })
  const { user } = useAuth()
  const { store } = useAppSelector(state => state.app)
  const { data: products, isLoading } =
    useGetProductsQuery(query)
  const [uploadProduct] = useUploadProductMutation()

  const { primaryFilled } = UseBgColor()
  const [transactionType, setTransactionType] = useState(11)
  const [dateRange, setDateRange] = useState<string[]>([
    new Date().toLocaleDateString(),
    new Date().toLocaleDateString(),
  ])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: productStatusData,
    openModal: openProductStatusModal,
    closeModal: closeProductStatusModal,
    isModalOpen: ProductStatusModalStatus,
  } = useModal<any>()

  const { isMobileSize } = useWindowSize()

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0]

    const formData = new FormData()
    formData.append('user', user?.id as any)
    formData.append('store', store?.id as any)
    formData.append('file', file as any)

    uploadProduct(formData)
      .unwrap()
      .then(() =>
        toast.success('Product uploaded successfully'),
      )
      .catch(() => toast.error('An error occurred'))
  }

  const columns: GridColDef[] = [
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
      minWidth: 130,
      flex: 2,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary' fontWeight={600}>
          <Link href={`/products/${params.row.id}`}>
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'priceA',
      headerName: 'PRICE A',
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
      field: 'priceB',
      headerName: 'PRICE B',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            params.row.product_price[0].price_b,
          )}
        </Typography>
      ),
    },
    {
      field: 'priceC',
      headerName: 'PRICE C',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(
            params.row.product_price[0].price_c,
          )}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'STOCK',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'pending',
      headerName: 'PENDING',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_status',
      headerName: 'STATUS',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Box
          onClick={() =>
            ability.can('update', 'product')
              ? openProductStatusModal(params.row)
              : null
          }
        >
          <ProductStatus
            status={params.value}
            isClickable={ability.can('update', 'product')}
          />
        </Box>
      ),
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Products', to: '/products' },
          { label: 'List', to: '#' },
        ]}
        actionBtns={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ResponsiveButton
              icon='tabler:file-export'
              label='Export Products'
              mini={isMobileSize}
            />
            <input
              accept='.csv, .xlsx'
              style={{ display: 'none' }}
              id='export-products'
              type='file'
              onChange={handleFileChange}
            />
            <label
              htmlFor='export-products'
              style={{
                display: 'flex',
                backgroundColor: 'primary',
              }}
            >
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 2,
                  px: 4,
                  backgroundColor: { ...primaryFilled },
                }}
              >
                <Icon
                  fontSize={18}
                  icon='tabler:file-import'
                />
                <Typography sx={{ color: 'white' }}>
                  Import Products
                </Typography>
              </Card>
            </label>
          </Box>
        }
      >
        <Card>
          {isLoading ? (
            <FallbackSpinner brief />
          ) : (
            <AppTable
              columns={columns}
              rows={products ? products.results : []}
              miniColumns={['productName']}
              openMiniModal={openTableDataModal}
              showToolbar
              showSearch={false}
              onPageChange={val => {
                const filter = { ...query }
                filter.page = val
                setQuery(filter)
              }}
              totalRows={products?.count}
              actionBtns={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    width: '100%',
                    flex: 2,
                  }}
                >
                  <Can I='create' a='product'>
                    <Link href='/products/new'>
                      <ResponsiveButton
                        label='Create Product'
                        icon='tabler:plus'
                        mini={isMobileSize}
                      />
                    </Link>
                  </Can>
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
                </Box>
              }
              secondaryActionBtns={
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
              }
            />
          )}
        </Card>
      </PageContainer>

      <ProductStatusUpdateModal
        title='Product Status'
        subTitle={`Update Status of ${
          productStatusData
            ? productStatusData.product_name
            : ''
        }`}
        open={ProductStatusModalStatus()}
        handleClose={closeProductStatusModal}
        data={productStatusData}
      />

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
                'SKU:': tableData.sku,
                'Name:': tableData.product_name,
                'Price A:': formatCurrency(
                  tableData.priceA,
                ),
                'Price B:': formatCurrency(
                  tableData.priceB,
                ),
                'Price C:': formatCurrency(
                  tableData.priceC,
                ),
                'Stock:': tableData.quantity,
                'Pending:': tableData.pending,
              }
            : {}
        }
      />
    </>
  )
}

ProductsPage.acl = {
  action: 'read',
  subject: 'product',
}

export default ProductsPage
