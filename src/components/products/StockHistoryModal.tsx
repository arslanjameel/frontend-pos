import { Box, Typography } from '@mui/material'
import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import AppModal from '../global/AppModal'
import AppTable from '../global/AppTable'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import { useModal } from 'src/hooks/useModal'
import TableDataModal from '../global/TableDataModal'
import { formatDate } from 'src/utils/dateUtils'

interface Props {
  open: boolean
  handleClose: () => void
  stockData: {
    dateAdded: string
    supplierName: string
    cost: number
    quantity: number
    location: string
    purchaseInvoice: string
  }[]
  isMobile?: boolean
}

const StockHistoryModal = ({
  open,
  handleClose,
  stockData,
  isMobile,
}: Props) => {
  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'dateAdded',
      headerName: 'DATE',
      type: 'string',
      minWidth: 110,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'supplierName',
      headerName: 'SUPPLIER',
      type: 'string',
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'cost',
      headerName: 'COST',
      type: 'number',
      minWidth: 90,
      flex: 1,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'number',
      minWidth: 90,
      flex: 1,
      maxWidth: 100,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'LOCATION',
      type: 'string',
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'purchaseInvoice',
      headerName: 'PURCHASE ORDER',
      type: 'string',
      minWidth: 120,
      flex: 1,
      maxWidth: 200,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
  ]

  return (
    <>
      <AppModal
        open={open}
        handleClose={handleClose}
        maxWidth={750}
        sx={{ p: 6, pt: 7 }}
        isMobile={isMobile}
      >
        <Typography
          id='modal-modal-title'
          variant='h4'
          sx={{
            textAlign: 'center',
            mb: 5,
            fontWeight: 700,
          }}
        >
          Stock History
        </Typography>
        <Typography sx={{ textAlign: 'center', mb: 5 }}>
          Full stock history for this product
        </Typography>

        <Box
          sx={{
            border: '1px solid rgba(219, 218, 222, 1)',
          }}
        >
          <AppTable
            miniColumns={['purchaseInvoice']}
            openMiniModal={openTableDataModal}
            showToolbar={false}
            columns={columns}
            rows={stockData}
            defaultPageSize={10}
          />
        </Box>
      </AppModal>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.supplierName}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Date Added:': tableData.dateAdded,
                'Supplier:': tableData.supplierName,
                'Cost:': tableData.cost,
                'Quantity:': tableData.quantity,
                'Location:': tableData.location,
                'Invoice:': tableData.purchaseInvoice,
              }
            : {}
        }
      />
    </>
  )
}

export default StockHistoryModal
