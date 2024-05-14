import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material'
import {
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import AppTableUserCard from 'src/components/global/AppTableUserCard'
import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import CustomTag from 'src/components/global/CustomTag'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import { IData } from 'src/utils/types'
import TableDataModal from 'src/components/global/TableDataModal'
import {
  accountApi,
  useGetSingleStoreUsersQuery,
  useUpdateUserPartialMutation,
} from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import { getFullName } from 'src/utils/dataUtils'
import { getInitials } from 'src/@core/utils/get-initials'
import { buildUrl } from 'src/utils/routeUtils'
import capitalize from 'src/utils/capitalize'
import AddUserAccessModal from 'src/components/stores/AddUserAccessModal'

interface Props {
  storeId: number
  userAccessModalOpen: boolean
  closeUserAccessModal: () => void
}

const UserAccessTab = ({
  storeId,
  userAccessModalOpen,
  closeUserAccessModal,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1)

  const { data: storeUsers, isLoading } =
    useGetSingleStoreUsersQuery(storeId)

  const [getUserStores] =
    accountApi.endpoints.getUserStores.useLazyQuery()

  const [updateUserPartial] = useUpdateUserPartialMutation()

  const [deleteModal, setDeleteModal] = useState<
    number | false
  >(false)
  const openDeleteModal = (id: number) => setDeleteModal(id)
  const closeDeleteModal = () => setDeleteModal(false)

  const [tableData, setTableData] = useState<IData | false>(
    false,
  )
  const openTableDataModal = (data: IData) =>
    setTableData(data)
  const closeTableDataModal = () => setTableData(false)

  const _addUserAccess = (userId: number) => {
    if (userId) {
      getUserStores(userId)
        .unwrap()
        .then(res => {
          const updatedStoresList = (
            res ? res?.results : []
          ).map(store => store.id)

          updatedStoresList.push(storeId)

          updateUserPartial({
            id: userId,
            body: { stores: updatedStoresList },
          })
            .unwrap()
            .then(() =>
              toast.success(
                'Store access updated successfully',
              ),
            )
            .catch(() => toast.error('An error occured'))
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  const _deleteUserAccess = (userId: number) => {
    if (userId) {
      getUserStores(userId)
        .unwrap()
        .then(res => {
          const updatedStoresList = (
            res ? res?.results : []
          )
            .map(store => store.id)
            .filter(_storeId => _storeId !== storeId)

          updateUserPartial({
            id: userId,
            body: { stores: updatedStoresList },
          })
            .unwrap()
            .then(() =>
              toast.success(
                'Store access updated successfully',
              ),
            )
            .catch(() => toast.error('An error occured'))
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
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.first_name || ''} ${
          params.row.last_name || ''
        }`,
      renderCell: params => {
        return (
          <AppTableUserCard
            name={params.value}
            email={params.row.email}
            img={params.row.img}
            nameLink={buildUrl('userAccounts', {
              itemId: params.row.id,
            })}
          />
        )
      },
    },
    {
      field: 'user_type',
      headerName: 'ROLE',
      width: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTag
          label={
            params.value ? capitalize(params.value) : '--'
          }
        />
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
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return isLoading ? (
    <FallbackSpinner brief />
  ) : (
    <>
      <AppTable
        isLoading={isLoading}
        onPageChange={setPage}
        rows={storeUsers ? storeUsers.results : []}
        columns={columns}
        miniColumns={['name']}
        openMiniModal={openTableDataModal}
        showSearch={false}
      />
      <ConfirmationModal
        open={typeof deleteModal === 'number'}
        handleClose={closeDeleteModal}
        title='Delete User Access'
        content='Are you sure you want to delete this user access?'
        confirmTitle='Delete'
        onConfirm={() =>
          _deleteUserAccess(deleteModal || 0)
        }
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
      <TableDataModal
        open={typeof tableData !== 'boolean'}
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
                    {getInitials(getFullName(tableData))}
                  </Avatar>
                ),
                'Name:': getFullName(tableData),
                'Role:': (
                  <CustomTag
                    label={capitalize(tableData.user_type)}
                  />
                ),
              }
            : {}
        }
        actionBtns={
          <Box sx={{ flex: 1, display: 'flex' }}>
            <Button
              variant='contained'
              color='error'
              startIcon={
                <Icon
                  icon='tabler:trash'
                  style={{ cursor: 'pointer' }}
                />
              }
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

      <AddUserAccessModal
        usersWithAccess={(storeUsers
          ? storeUsers.results
          : []
        ).map(user => user.id)}
        storeId={storeId}
        open={userAccessModalOpen}
        handleClose={closeUserAccessModal}
        addUserAccess={_addUserAccess}
        deleteUserAccess={_deleteUserAccess}
      />
    </>
  )
}

export default UserAccessTab
