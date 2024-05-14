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

import AppTable from 'src/components/global/AppTable'
import Icon from 'src/@core/components/icon'
import CustomTag from 'src/components/global/CustomTag'
import RoleCard from 'src/components/roles-permissions/RoleCard'
import AddRoleModal from 'src/components/roles-permissions/AddRoleModal'
import PageContainer from 'src/components/global/PageContainer'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import { IData } from 'src/utils/types'
import TableDataModal from 'src/components/global/TableDataModal'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { deleteUserPermission } from 'src/store/reducers/rolesPermissionsSlice'
import { useGetUserTypesQuery } from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'

const RolesAndPermissionsPage = () => {
  const { data: roles, isLoading } = useGetUserTypesQuery()

  const { usersRoles } = useAppSelector(
    state => state.roles,
  )
  const dispatch = useAppDispatch()

  const [addRoleModal, setAddRoleModal] = useState(false)
  const openAddRoleModal = () => setAddRoleModal(true)
  const closeAddRoleModal = () => setAddRoleModal(false)

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

  const _deletePermission = () => {
    if (deleteModal) {
      dispatch(deleteUserPermission(deleteModal))
      toast.success('Permission deleted successfully')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'assignedTo',
      headerName: 'ASSIGNED TO',
      type: 'string',
      flex: 2,
      disableColumnMenu: true,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {params.value.map((v: string) => (
              <CustomTag
                key={v}
                label={v}
                color='primary'
              />
            ))}
          </Box>
        )
      },
    },
    {
      field: 'createdDate',
      headerName: 'CREATED DATE',
      type: 'string',
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },

    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      disableColumnMenu: true,
      width: 105,
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
              color='primary'
              onClick={e => {
                e.stopPropagation()

                // openUpdateFloorModal()
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
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
    },
  ]

  return (
    <>
      <PageContainer title='Roles & Permissions'>
        {isLoading ? (
          <FallbackSpinner brief />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(230px, 1fr))',
              gridAutoRows: 120,
              gap: 3,
              mb: 4,
            }}
          >
            {(roles ? roles.results : []).map((role: any) => (
              <RoleCard key={role.id} role={role} />
            ))}

            <Card
              sx={{
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                py: 3,
              }}
            >
              <Button
                variant='contained'
                onClick={openAddRoleModal}
              >
                Add New Role
              </Button>
              <Typography>
                Add role, if it does not exist
              </Typography>
            </Card>
          </Box>
        )}

        <Card>
          <AppTable
            columns={columns}
            rows={usersRoles}
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar
            actionBtns={
              <Typography variant='h5' fontWeight={600}>
                Permissions List
              </Typography>
            }
            secondaryActionBtns={
              <>
                <Button variant='contained'>
                  Add Permission
                </Button>
              </>
            }
          />
        </Card>
      </PageContainer>

      <AddRoleModal
        open={addRoleModal}
        handleClose={closeAddRoleModal}
        onSubmit={values => console.log(values)}
      />
      <ConfirmationModal
        open={typeof deleteModal === 'number'}
        handleClose={closeDeleteModal}
        title='Delete Permission'
        content='Are you sure you want to delete this permission?'
        confirmTitle='Delete'
        onConfirm={_deletePermission}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <TableDataModal
        open={typeof tableData !== 'boolean'}
        handleClose={closeTableDataModal}
        tableData={
          tableData
            ? {
                'Name:': tableData.name,
                'Assigned To:': (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    {tableData.assignedTo.map(
                      (val: string) => (
                        <CustomTag key={val} label={val} />
                      ),
                    )}
                  </Box>
                ),
                'Created Date:': tableData.createdDate,
              }
            : {}
        }
        actionBtns={
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: 2,
            }}
          >
            <Button
              variant='contained'
              startIcon={<Icon icon='tabler:edit' />}
              onClick={() => {
                closeTableDataModal()

                // openUpdateFloorModal()
              }}
            >
              Edit
            </Button>
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

export default RolesAndPermissionsPage
