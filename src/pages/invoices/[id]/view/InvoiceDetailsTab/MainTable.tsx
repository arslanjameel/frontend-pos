import { Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'

import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { ProductSoldOn } from 'src/models/ISaleInvoice'
import {
  excludeVAT,
  formatTo2dp,
} from 'src/utils/dataUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { calculateRowExVAT } from 'src/utils/invoicesUtils'
import { IData } from 'src/utils/types'

interface Props {
  products: ProductSoldOn[]
}

const MainTable = ({ products }: Props) => {
  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      disableColumnMenu: true,
      sortable: false,
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
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity_sold',
      headerName: 'QTY',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'unit_price',
      headerName: 'UNIT PRICE',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(formatTo2dp(params.value))}
        </Typography>
      ),
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(excludeVAT(params.value))}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      type: 'number',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      valueGetter: params => calculateRowExVAT(params.row),
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  return (
    <>
      <Box
        sx={{
          borderTop: '1px solid #ddd',
          mx: isMobileSize ? 0 : 8,
        }}
      >
        <AppTable
          columns={columns}
          rows={products || []}
          miniColumns={['product_name']}
          openMiniModal={openTableDataModal}
          showToolbar={false}
          pagination={false}
        />
      </Box>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.product_name}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.product_name,
                'SKU:': tableData.sku,
                'Quantity:': tableData.quantity_sold,
                'Unit Price:': formatCurrency(
                  Number(formatTo2dp(tableData.sold_price)),
                ),
                'Total:':
                  tableData.quantity_sold *
                  tableData.sold_price,
              }
            : {}
        }
      />
    </>
  )
}

export default MainTable
