import { Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'

import AppTable from 'src/components/global/AppTable'
import ProductDeliveryModePicker from 'src/components/global/Dropdowns/ProductDeliveryModePicker'
import TableDataModal from 'src/components/global/TableDataModal'
import DeliveryStatusTag from 'src/components/invoices/DeliveryStatusTag'
import { useModal } from 'src/hooks/useModal'
import { IProductStatus } from 'src/models/ISaleInvoice'
import { IData } from 'src/utils/types'

interface Props {
  invoicedProducts: any[]
  overallStatus: IProductStatus
  selectedDeliveryData: number[]
  setSelectedDeliveryData: (ids: number[]) => void
  updateOverallStatus: (val: IProductStatus) => void
  updateDeliveryStatus: (
    productId: number,
    status: IProductStatus,
  ) => void
  secondaryActionBtns: React.ReactNode
}

const MainTable = ({
  invoicedProducts,
  overallStatus,
  selectedDeliveryData,
  setSelectedDeliveryData,
  updateOverallStatus,
  updateDeliveryStatus,
  secondaryActionBtns,
}: Props) => {
  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'id',
      align: 'left',
      headerAlign: 'left',
      type: 'number',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <ProductDeliveryModePicker
          status={overallStatus}
          onChange={newStatus =>
            updateOverallStatus(newStatus)
          }
          readOnly
        />
      ),
      renderCell: params => (
        <ProductDeliveryModePicker
          status={params.row.delivery_mode}
          onChange={newStatus =>
            updateDeliveryStatus(params.value, newStatus)
          }
          readOnly
        />
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 120,
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
      field: 'quantity_sold',
      headerName: 'PENDING',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      disableColumnMenu: true,
      valueGetter: params =>
        params.value -
        params.row.quantity_delivered -
        params.row.products_returned,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_delivery_status',
      headerName: 'STATUS',
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      maxWidth: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <DeliveryStatusTag status={params.value} />
      ),
    },
  ]

  return (
    <>
      <AppTable
        columns={columns}
        rows={invoicedProducts}
        miniColumns={['sku']}
        openMiniModal={openTableDataModal}
        showToolbar
        showSearch={false}
        showPageSizes={false}
        checkboxSelection
        rowSelectionModel={selectedDeliveryData}
        onRowSelectionModelChange={ids => {
          const notCompleted = invoicedProducts.filter(
            (prod: any) =>
              ids.includes(prod.id) &&
              prod.quantity_sold - prod.quantity_delivered >
                0,
          )
          setSelectedDeliveryData(
            notCompleted.map((prod: any) => prod.id),
          )
        }}
        leftActionBtns={
          <Typography variant='h5' fontWeight={600}>
            Delivery/Collection Status
          </Typography>
        }
        secondaryActionBtns={secondaryActionBtns}
      />

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'SKU:': tableData.sku,
                'Name:': tableData.product_name,
                'Status:': (
                  <DeliveryStatusTag
                    status={
                      tableData.product_delivery_status
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

export default MainTable
