import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material'
import React, { useState } from 'react'
import {
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import CustomTag from 'src/components/global/CustomTag'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import PageContainer from 'src/components/global/PageContainer'
import TableDataModal from 'src/components/global/TableDataModal'
import { IData } from 'src/utils/types'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import { useModal } from 'src/hooks/useModal'
import AppTableUserCard from 'src/components/global/AppTableUserCard'
import {
  useDeleteUserMutation,
  useGetCitiesQuery,
  useGetUserTypesQuery,
  useGetUsersQuery,
} from 'src/store/apis/accountSlice'

// import { filterSuperAdmins } from 'src/utils/dataUtils'
import { buildUrl } from 'src/utils/routeUtils'
import UserStatusTag from 'src/components/userAccounts/UserStatusTag'
import capitalize from 'src/utils/capitalize'
import useGetCityName from 'src/hooks/useGetCityName'

const UserList = () => {
  const [page, setPage] = useState(1)
  const handlePageChange = (newPage: number) =>
    setPage(newPage)

  const [search, setSearch] = useState('')
  const handleSearchChange = (_search: string) =>
    setSearch(_search)

  const { isLoading, data: userList } = useGetUsersQuery({
    page,
  })
  const { data: roles } = useGetUserTypesQuery()
  const { data: cities } = useGetCitiesQuery()
  const { getCity } = useGetCityName(cities ? cities : [])

  const [deleteUser] = useDeleteUserMutation()

  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataStatus,
  } = useModal<IData>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const _deleteUser = () => {
    if (deleteModal) {
      deleteUser(deleteModal)
        .unwrap()
        .then(() => {
          toast.success('User deleted successfully')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      minWidth: 200,
      flex: 1,
      maxWidth: 250,
      type: 'string',
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.first_name || ''} ${
          params.row.last_name || ''
        }`,
      renderCell: params => {
        return (
          <AppTableUserCard
            img={params.row.image}
            name={capitalize(params.value) || 'No Name'}
            email={
              roles
                ? capitalize(
                    roles.results.find(
                      (r: any) =>
                        r.id === params.row.user_type,
                    )?.type || '--',
                  )
                : '--'
            }
            nameLink={buildUrl('userAccounts', {
              itemId: params.row.id,
            })}
          />
        )
      },
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      type: 'string',
      minWidth: 160,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'address',
      headerName: 'ADDRESS',
      type: 'string',
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params =>
        `${params.row.address}, ${getCity(
          params.row.city,
        )}, ${params.row.postalCode}`,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'mobile',
      headerName: 'PHONE',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      width: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Box sx={{ mx: 'auto' }}>
          <UserStatusTag status={params.value} />
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      disableColumnMenu: true,
      width: 100,
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton
              color='error'
              onClick={() => openDeleteModal(params.row.id)}
            >
              <Icon
                icon='tabler:trash'
                style={{ cursor: 'pointer' }}
              />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Users', to: buildUrl('userAccounts') },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            isLoading={isLoading}
            rows={userList ? userList.results : []}
            totalRows={userList ? userList.count : 0}
            onPageChange={handlePageChange}
            columns={columns}
            miniColumns={['name']}
            search={search}
            onSearchChange={handleSearchChange}
            columnsInSearch={['first_name', 'last_name']}
            showToolbar
            openMiniModal={openTableDataModal}
            actionBtns={
              <Link
                href={buildUrl('userAccounts', {
                  mode: 'new',
                })}
              >
                <ResponsiveButton
                  icon='tabler:plus'
                  mini={isMobileSize}
                  label='Add User'
                />
              </Link>
            }
            searchPlaceholder='Search Users'
          />
        </Card>
      </PageContainer>

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete User'
        content={
          <Box py={2}>
            This user will be removed from active users and
            will go into a pending permanent deletion state
            for 30 days during which time you can restore
            them.
            <Typography
              color='error'
              mt={3}
              fontWeight={600}
            >
              After 30 days, the person and all their
              tracked data will be permanently deleted!
            </Typography>
          </Box>
        }
        confirmTitle='Delete'
        onConfirm={_deleteUser}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <TableDataModal
        open={tableDataStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.first_name} ${tableData.last_name}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Image:': (
                  <Avatar src={tableData.img}>
                    {tableData.first_name}{' '}
                    {tableData.last_name}
                  </Avatar>
                ),
                'Name:': `${tableData.first_name} ${tableData.last_name}`,
                'Phone:': tableData.mobile,
                'Address:': tableData.address,
                'Role:': (
                  <CustomTag label={tableData.role} />
                ),
                'Status:': (
                  <CustomTag
                    label={
                      tableData.status === 0
                        ? 'Inactive'
                        : 'Active'
                    }
                    color={
                      tableData.status === 0
                        ? 'error'
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
          </Box>
        }
      />
    </>
  )
}

export default UserList
