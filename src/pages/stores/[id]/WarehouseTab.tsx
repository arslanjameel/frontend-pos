import {
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import CustomTag from 'src/components/global/CustomTag'
import TableDataModal from 'src/components/global/TableDataModal'
import FloorModal from 'src/components/stores/FloorModal'
import { IData } from 'src/utils/types'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import {
  IFloor,
  deleteWarehouse,
  updateWarehouse,
} from 'src/store/reducers/storesSlice'

// interface Props {}

const WarehouseTab = () => {
  const { warehouses } = useAppSelector(
    state => state.stores,
  )
  const dispatch = useAppDispatch()

  const [updateFloorModal, setUpdateFloorModal] = useState<
    string | false
  >(false)
  const openUpdateFloorModal = (id: string) =>
    setUpdateFloorModal(id)
  const closeUpdateFloorModal = () =>
    setUpdateFloorModal(false)

  const [deleteModal, setDeleteModal] = useState<
    string | false
  >(false)
  const openDeleteModal = (id: string) => setDeleteModal(id)
  const closeDeleteModal = () => setDeleteModal(false)

  const [tableData, setTableData] = useState<IData | false>(
    false,
  )
  const openTableDataModal = (data: IData) =>
    setTableData(data)
  const closeTableDataModal = () => setTableData(false)

  const _updateWarehouse = (values: IFloor) => {
    dispatch(
      updateWarehouse({
        ...values,
        floor: values.floorName,
        sections: [
          ...values.sections.map(s => s.toString()),
        ],
      }),
    )
    toast.success('Floor upated successfully')
    closeUpdateFloorModal()
  }

  const _deleteWareHouse = () => {
    if (deleteModal) {
      dispatch(deleteWarehouse(deleteModal))

      toast.success('Floor deleted successfully')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'floor',
      headerName: 'FLOOR',
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'sections',
      headerName: 'SECTION',
      flex: 2,
      disableColumnMenu: true,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          {params.value.map((v: string) => (
            <CustomTag key={v} label={v} />
          ))}
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
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
                openUpdateFloorModal(params.row.id)
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
      <AppTable
        rows={warehouses}
        columns={columns}
        miniColumns={['floor']}
        openMiniModal={openTableDataModal}
        showSearch={false}
      />

      <FloorModal
        isEdit
        open={typeof updateFloorModal !== 'boolean'}
        defaultValues={
          updateFloorModal
            ? warehouses.find(
                wh => wh.id === updateFloorModal,
              )
            : undefined
        }
        onSubmit={_updateWarehouse}
        handleClose={() => closeUpdateFloorModal()}
      />
      <ConfirmationModal
        open={typeof deleteModal !== 'boolean'}
        handleClose={closeDeleteModal}
        title='Delete Floor'
        content='Are you sure you want to delete this floor?'
        confirmTitle='Delete'
        onConfirm={_deleteWareHouse}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <TableDataModal
        open={typeof tableData !== 'boolean'}
        handleClose={closeTableDataModal}
        title={tableData ? tableData.floor : ''}
        tableData={
          tableData
            ? {
                'Floor:': tableData.floor,
                'Sections:': (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {tableData.sections.map((v: string) => (
                      <CustomTag key={v} label={v} />
                    ))}
                  </Box>
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
              startIcon={<Icon icon='tabler:edit' />}
              onClick={() => {
                closeTableDataModal()
                openUpdateFloorModal(
                  tableData && tableData.id,
                )
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

export default WarehouseTab
