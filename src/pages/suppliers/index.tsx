import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import toast from 'react-hot-toast'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import CustomTag from 'src/components/global/CustomTag'
import Icon from 'src/@core/components/icon'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { IData } from 'src/utils/types'
import { GridColDef } from '@mui/x-data-grid'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from 'src/store/apis/suppliersSlice'
import TableSearchInput from 'src/components/global/TableSearchInput'
import useAddressUtils from 'src/hooks/useAddressUtils'
import Can, {
  AbilityContext,
} from 'src/layouts/components/acl/Can'

const SuppliersPage = () => {
  const { isMobileSize } = useWindowSize()

  const ability = useContext(AbilityContext)

  const { getFormattedAddressManual } = useAddressUtils()

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: suppliers, isLoading } =
    useGetSuppliersQuery({
      page,
    })

  const [deleteSupplier] = useDeleteSupplierMutation()

  const router = useRouter()

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

  const _deleteSupplier = () => {
    if (deleteModal) {
      deleteSupplier(deleteModal)
        .unwrap()
        .then(() => {
          toast.success('Supplier deleted successfully')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      minWidth: 130,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Link href={`/suppliers/${params.row.id}`}>
          <Typography
            color='primary'
            fontSize={15}
            fontWeight={600}
          >
            {params.value}
          </Typography>
        </Link>
      ),
    },
    {
      field: 'address',
      headerName: 'ADDRESS',
      type: 'string',
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography variant='subtitle2' fontWeight={400}>
          {getFormattedAddressManual({
            addressLine1: params.value,
            cityId: params.row.city,
            countryId: params.row.country,
            postCode: params.row.post_code,
          })}
        </Typography>
      ),
    },
    {
      field: 'primary_phone',
      headerName: 'PHONE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'current_credit',
      headerName: 'SPEND TO DATE',
      align: 'center',
      type: 'number',
      width: 160,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'credit_limit',
      headerName: 'ACCOUNT BALANCE',
      align: 'center',
      type: 'number',
      width: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTag
          label={formatCurrency(params.value)}
          color={
            params.row.balanceStatus === 0
              ? 'error'
              : params.row.balanceStatus === 1
              ? 'warning'
              : 'success'
          }
        />
      ),
    },
  ]

  // only admins can delete
  if (ability.can('delete', 'supplier')) {
    columns.push({
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
            <IconButton
              color='error'
              onClick={e => {
                e.stopPropagation()
                openDeleteModal(params.row.id)
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    })
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Suppliers', to: '/suppliers' },
          { label: 'List', to: '#' },
        ]}
        actionBtns={
          <ResponsiveButton
            icon='tabler:file-export'
            label='Monthly Outstanding'
            mini={isMobileSize}
            onClick={() =>
              router.push('/suppliers/monthly-outstanding')
            }
          />
        }
      >
        <Card>
          <AppTable
            columns={columns}
            rows={suppliers?.results || []}
            totalRows={suppliers?.count || 10}
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar
            isLoading={isLoading}
            showSearch={false}
            showPageSizes={false}
            searchPlaceholder='Search Suppliers'
            onPageChange={newPage => setPage(newPage)}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href='/suppliers/new'>
                  <ResponsiveButton
                    label='Add Supplier'
                    icon='tabler:plus'
                    mini={isMobileSize}
                  />
                </Link>
              </Box>
            }
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  value={searchTerm}
                  onChange={val => setSearchTerm(val)}
                />
              </Box>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.name}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.name,
                'Phone:': tableData.primary_phone,
                'Address:':
                  tableData.address ||
                  tableData.addressLine1,
                'Spend To Date:': formatCurrency(
                  tableData.spendToDate,
                ),
                'Account Balance:': (
                  <CustomTag
                    label={formatCurrency(
                      tableData.accBalance,
                    )}
                    color={
                      tableData.balanceStatus === 0
                        ? 'error'
                        : tableData.balanceStatus === 1
                        ? 'warning'
                        : 'success'
                    }
                  />
                ),
              }
            : {}
        }
        actionBtns={
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <Can I='delete' a='supplier'>
              <Button
                variant='contained'
                color='error'
                startIcon={<Icon icon='tabler:trash' />}
                onClick={() => {
                  closeTableDataModal()
                  openDeleteModal(tableData && tableData.id)
                }}
              >
                Delete
              </Button>
            </Can>
          </Box>
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Supplier'
        content={
          'Are you sure you want to delete this supplier?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteSupplier}
        rejectTitle='Cancel'
        onReject={() => console.log('reject')}
      />
    </>
  )
}

SuppliersPage.acl = {
  action: 'read',
  subject: 'supplier',
}

export default SuppliersPage
