import { Button, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { ProductSoldOn } from 'src/models/ISaleInvoice'
import { IData } from 'src/utils/types'

interface Props {
  invoicedProducts?: ProductSoldOn[]
}

const CostsTab = ({ invoicedProducts = [] }: Props) => {
  const [costData, setCostData] = useState([
    ...invoicedProducts,
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

  const updateInfo = (id: number, cost: number) => {
    let temp = [...costData]
    temp = temp.map(prod =>
      prod.id === id ? { ...prod, sold_price: cost } : prod,
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
      field: 'product_name',
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
      field: 'sold_price',
      headerName: 'UNIT COST',
      type: 'number',
      minWidth: 100,
      headerAlign: 'center',
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='Cost'
          value={Number(params.value)}
          type='number'
          sx={{ maxWidth: 100 }}
          onChange={e =>
            updateInfo(
              params.row.id,
              Number(e.target.value),
            )
          }
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
          miniColumns={['id', 'sku']}
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
                'Name:': tableData.product_name,
                'Unit Cost:': (
                  <CustomTextField
                    fullWidth
                    placeholder='Cost'
                    value={Number(tableData.sold_price)}
                    type='number'
                    sx={{ maxWidth: 100 }}
                    onChange={e =>
                      updateInfo(
                        tableData.id,
                        Number(e.target.value),
                      )
                    }
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
