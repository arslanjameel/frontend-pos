import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import {
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import CustomTag from 'src/components/global/CustomTag'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import useAddressUtils from 'src/hooks/useAddressUtils'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Can from 'src/layouts/components/acl/Can'
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useSearchCustomersQuery,
} from 'src/store/apis/customersSlice'
import { removeCashCustomer } from 'src/utils/customers.util'
import { getFullName } from 'src/utils/dataUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { buildUrl } from 'src/utils/routeUtils'
import { IData } from 'src/utils/types'

const CustomersPage = () => {
  const router = useRouter()
  const { data: customers, isLoading } =
    useGetCustomersQuery()

  const { getFormattedAddress } = useAddressUtils()

  const [searchTerm, setSearchTerm] = useState('')
  const { data: searchedCustomers } =
    useSearchCustomersQuery(searchTerm)

  const [deleteCustomer] = useDeleteCustomerMutation()

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

  const _deleteCustomer = () => {
    if (deleteModal) {
      deleteCustomer(deleteModal)
        .unwrap()
        .then(() => {
          toast.success('Customer deleted successfully')
        })
        .catch(() => toast.error('An error occurred'))
    }
  }

  const { isMobileSize, isWindowBelow } = useWindowSize()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      minWidth: 150,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) =>
        getFullName(params.row),
      renderCell: params => (
        <Typography color='primary' fontWeight={600}>
          <Link
            href={buildUrl('customers', {
              itemId: params.row.id,
            })}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'addresses',
      headerName: 'ADDRESS',
      type: 'string',
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params =>
        params.row.addresses.length > 0
          ? getFormattedAddress(params.row.addresses[0])
          : '',
      renderCell: params => (
        <Typography variant='subtitle2' fontWeight={400}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'primaryPhone',
      headerName: 'PHONE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'STATUS',
      align: 'center',
      type: 'number',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Box sx={{ mx: 'auto' }}>
          <CustomTag
            label={params.value ? 'Approved' : 'Pending'}
            color={params.value ? 'success' : 'warning'}
          />
        </Box>
      ),
    },
    {
      field: 'spendToDate',
      headerName: 'SPEND TO DATE',
      align: 'center',
      headerAlign: 'center',
      type: 'number',
      minWidth: 130,
      maxWidth: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'currentCredit',
      headerName: 'ACCOUNT BALANCE',
      align: 'center',
      type: 'number',
      headerAlign: 'center',
      minWidth: 130,
      maxWidth: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTag
          label={formatCurrency(Math.fround(params.value))}
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
            <Can I='update' a='customer'>
              <IconButton
                color='primary'
                onClick={() =>
                  router.push(
                    buildUrl('customers', {
                      itemId: params.row.id,
                      mode: 'edit',
                    }),
                  )
                }
              >
                <Icon icon='tabler:edit' />
              </IconButton>
            </Can>

            <Can I='delete' a='customer'>
              <IconButton
                color='error'
                onClick={() =>
                  openDeleteModal(params.row.id)
                }
              >
                <Icon icon='tabler:trash' />
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
          { label: 'Customers', to: buildUrl('customers') },
          { label: 'List', to: '#' },
        ]}
        actionBtns={
          <>
            <Can I='read' a='customer-monthly'>
              <Link href='/customers/monthly-outstanding'>
                <ResponsiveButton
                  icon='tabler:file-export'
                  label='Monthly Outstanding'
                  mini={isMobileSize}
                />
              </Link>
            </Can>
          </>
        }
      >
        <Card>
          {isLoading ? (
            <FallbackSpinner brief />
          ) : (
            <>
              <AppTable
                columns={columns}
                rows={
                  searchTerm.length > 0 && searchedCustomers
                    ? removeCashCustomer(
                        searchedCustomers.results,
                      )
                    : customers
                    ? removeCashCustomer(customers.results)
                    : []
                }
                miniColumns={['name']}
                showSearch={false}
                showPageSizes={false}
                openMiniModal={openTableDataModal}
                showToolbar
                actionBtns={
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Can I='create' a='customer'>
                      <Link
                        href={buildUrl('customers', {
                          mode: 'new',
                        })}
                      >
                        <ResponsiveButton
                          label='Add Customer'
                          icon='tabler:plus'
                          mini={isWindowBelow(750)}
                        />
                      </Link>
                    </Can>
                    <ResponsiveButton
                      label='Send Registration Form'
                      icon='tabler:mail'
                      mini={isWindowBelow(750)}
                    />
                  </Box>
                }
                secondaryActionBtns={
                  <TableSearchInput
                    value={searchTerm}
                    onChange={val => setSearchTerm(val)}
                  />
                }
              />
            </>
          )}
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.firstName} ${tableData.lastName}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Name:': ` ${tableData.firstName} ${tableData.lastName}`,
                'Address:': tableData.addresses[0]
                  ? tableData.addresses[0].addressLine1
                  : '--',
                'Phone:': tableData.primaryPhone,
                'Status:': (
                  <CustomTag
                    label={
                      tableData.status === 1
                        ? 'Approved'
                        : 'Pending'
                    }
                    color={
                      tableData.status === 1
                        ? 'success'
                        : 'warning'
                    }
                  />
                ),
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
          <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
            <Can I='update' a='customer'>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Icon icon='tabler:edit' />}
                onClick={() =>
                  router.push(
                    buildUrl('customers', {
                      mode: 'edit',
                      itemId: tableData && tableData.id,
                    }),
                  )
                }
              >
                Edit
              </Button>
            </Can>

            <Can I='delete' a='customer'>
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
        title='Delete Customer'
        content={
          'Are you sure you want to delete this customer?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteCustomer}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

CustomersPage.acl = {
  action: 'read',
  subject: 'customer',
}

export default CustomersPage
