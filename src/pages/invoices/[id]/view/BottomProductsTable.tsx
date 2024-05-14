import { Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'

import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'

interface Props {
  invoicedProducts: any[]
}

const BottomProductsTable = ({
  invoicedProducts,
}: Props) => {
  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'product_name',
      headerName: 'PRODUCT',
      type: 'string',
      minWidth: 150,
      flex: 1,
      maxWidth: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight={500}>
            {params.value}
          </Typography>
          <Typography variant='body2' sx={{ opacity: 0.7 }}>
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'product_note',
      headerName: 'INTERNAL NOTES',
      type: 'string',
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value || '--'}</Typography>
      ),
    },
  ]

  return (
    <>
      <AppTable
        columns={columns}
        rows={invoicedProducts || []}
        miniColumns={['product_name']}
        openMiniModal={openTableDataModal}
        showToolbar={false}
        showPageSizes={false}
        pagination={false}
        flexHeight
      />

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.product_name,
                'SKU:': tableData.sku,
                'Notes:': tableData.internalNotes,
              }
            : {}
        }
      />
    </>
  )
}

export default BottomProductsTable
