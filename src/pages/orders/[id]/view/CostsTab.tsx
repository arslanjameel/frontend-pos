import { Button, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useAppSelector } from 'src/store/hooks'
import { IData } from 'src/utils/types'

const CostsTab = () => {
  const { suppliers } = useAppSelector(
    state => state.suppliers,
  )
  const [costData, setCostData] = useState([
    {
      id: 121,
      sku: 'SIWJIJSW',
      name: 'Waste Disposal Unit ',
      unitCost: 122,
      supplier: 1,
    },
    {
      id: 11,
      sku: 'PQOW',
      name: '15x10mm Cmp Reducing Coupling',
      unitCost: 122,
      supplier: 1,
    },
    {
      id: 1221,
      sku: 'JWHW',
      name: 'Zentrum C/C Fully BTW Pan Wh',
      unitCost: 122,
      supplier: 1,
    },
  ])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const updateCosts = () => {
    toast.success('TODO: update costs')
  }

  const updateInfo = (
    id: number,
    key: string,
    value: number,
  ) => {
    let temp = [...costData]
    temp = temp.map(prod =>
      prod.id === id ? { ...prod, [key]: [value] } : prod,
    )
    setCostData(temp)
  }

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'unitCost',
      headerName: 'UNIT COST',
      type: 'number',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Cost'
          value={params.value}
          type='number'
          sx={{ maxWidth: 100 }}
          onChange={e =>
            updateInfo(
              params.row.id,
              'unitCost',
              Number(e.target.value),
            )
          }
        />
      ),
    },
    {
      field: 'supplier',
      headerName: 'SUPPLIER',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <AppSelect
          value={params.value}
          handleChange={e =>
            updateInfo(
              params.row.id,
              'supplier',
              e.target.value,
            )
          }
          options={suppliers.map(supplier => ({
            label: supplier.name.split(' ')[0],
            value: supplier.id,
          }))}
        />
      ),
    },
  ]

  return (
    <>
      <Card sx={{ flex: 1 }}>
        <AppTable
          columns={columns}
          rows={costData}
          miniColumns={['sku']}
          openMiniModal={openTableDataModal}
          showToolbar
          showSearch={false}
          showPageSizes={false}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Product Costs
            </Typography>
          }
          secondaryActionBtns={
            <Button
              variant='contained'
              onClick={updateCosts}
            >
              Update
            </Button>
          }
        />
      </Card>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'SKU:': tableData.sku,
                'Name:': tableData.name,
                'Unit Cost:': (
                  <CustomTextField
                    fullWidth
                    placeholder='Cost'
                    value={
                      costData.find(
                        c => c.id === tableData.id,
                      )?.unitCost
                    }
                    type='number'
                    sx={{ maxWidth: 100 }}
                    onChange={e =>
                      updateInfo(
                        tableData.id,
                        'unitCost',
                        Number(e.target.value),
                      )
                    }
                  />
                ),
                'Supplier:': (
                  <AppSelect
                    sx={{ maxWidth: 100 }}
                    value={
                      costData.find(
                        c => c.id === tableData.id,
                      )?.supplier || 0
                    }
                    handleChange={e =>
                      updateInfo(
                        tableData.id,
                        'supplier',
                        e.target.value,
                      )
                    }
                    options={suppliers.map(supplier => ({
                      label: supplier.name.split(' ')[0],
                      value: supplier.id,
                    }))}
                  />
                ),
              }
            : {}
        }
      />
    </>
  )
}

export default CostsTab
