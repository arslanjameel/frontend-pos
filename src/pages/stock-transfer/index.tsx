import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'

import AppTable from 'src/components/global/AppTable'
import PageContainer from 'src/components/global/PageContainer'
import Icon from 'src/@core/components/icon'
import { useGetStoreProductsSearchQuery } from 'src/store/apis/productsSlice'
import { useAppSelector } from 'src/store/hooks'
import { hasErrorKey } from 'src/utils/apiUtils'
import { useModal } from 'src/hooks/useModal'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import toast from 'react-hot-toast'

// Create a new page to show all products that need stock to be transferred,
// will show product SKU, Product Name, Quantity and Store to Transfer, and add a
// delete button too

// 28.02.24_ZC Add a side menu to be able to access this page under Product
//  Management 'Stock Transfer'

const StockTransferPage = () => {
  const { store } = useAppSelector(state => state.app)
  const [search, setSearch] = useState('')

  const { data: products } = useGetStoreProductsSearchQuery(
    {
      query: search,
      storeId: store?.id,
    },
  )

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const _deleteEntry = () => {
    if (deleteModal) {
      toast.success('TODO: delete this')
    }
  }

  const columns: GridColDef[] = [
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
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value || 0}</Typography>
      ),
    },
    {
      field: 'base_price',
      headerName: 'STORE TO TRANSFER',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      disableColumnMenu: true,
      renderCell: () => <Typography>Store Name</Typography>,
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
            <IconButton
              color='error'
              onClick={() => openDeleteModal(params.row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <PageContainer title='Stock Transfer'>
        <Card>
          <AppTable
            columns={columns}
            rows={
              products
                ? !hasErrorKey(products as any)
                  ? (products || []).filter(
                      prod =>
                        prod.product_stock.length === 0,
                    )
                  : []
                : []
            }
            showSearch
            search={search}
            onSearchChange={setSearch}
            pagination={false}
            openMiniModal={() => null}
          />
        </Card>
      </PageContainer>

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Entry'
        content={
          'Are you sure you want to delete this entry?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteEntry}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

StockTransferPage.acl = {
  action: 'read',
  subject: 'stock-transfer',
}

export default StockTransferPage
