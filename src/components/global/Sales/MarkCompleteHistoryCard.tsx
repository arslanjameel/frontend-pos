import { Box, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { getFullName } from 'src/utils/dataUtils'
import { formatDate } from 'src/utils/dateUtils'
import AppTable from '../AppTable'
import TableDataModal from '../TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'
import {
  IProductDeliveryMode,
  deliveryModeOptionsPretty2,
} from 'src/models/ISaleInvoice'

// import { useGetMarkCompletedNewQuery } from 'src/store/apis/markCompletedSlice'

interface Props {
  historyData: any[]
  isLoading?: boolean
  isOrder?: boolean
}

const MarkCompleteHistoryCard = ({
  historyData,
  isLoading,
  isOrder,
}: Props) => {
  // const { data: historyData, isLoading } =
  //   useGetMarkCompletedNewQuery({
  //     sale_invoice_id,
  //     sale_order_id,
  //   })

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const extractProductStr = (obj: any) => {
    if (isOrder) {
      return obj?.sale_orders_track
        ? {
            product_name:
              obj?.sale_orders_track.product_name,
            quantity: obj?.total_delivered_now,
          }
        : null
    }

    return obj?.sale_invoice_track
      ? {
          product_name:
            obj?.sale_invoice_track.product_name,
          quantity: obj?.total_delivered_now,
        }
      : null
  }

  const columns: GridColDef[] = [
    {
      field: 'mark_date',
      headerName: 'DATE',
      minWidth: 100,
      maxWidth: 130,
      flex: 1,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'history',
      headerName: 'HISTORY',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            fontWeight={600}
            sx={{ opacity: 0.9 }}
          >
            {params.row?.delivery_mode
              ? deliveryModeOptionsPretty2[
                  params.row
                    .delivery_mode as IProductDeliveryMode
                ]
              : '--'}
          </Typography>
          <Typography
            fontWeight={600}
            sx={{ opacity: 0.9 }}
          >
            {extractProductStr(params.row) &&
              extractProductStr(params.row)?.product_name +
                ' x ' +
                extractProductStr(params.row)?.quantity}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'comments',
      headerName: 'COMMENTS',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
      maxWidth: 300,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'user',
      headerName: 'USER',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 1,
      maxWidth: 200,
      disableColumnMenu: true,
      valueGetter: params => getFullName(params.row?.user),
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
  ]

  return (
    <>
      <Card sx={{ width: '100%' }}>
        <AppTable
          pagination={false}
          isLoading={isLoading}
          columns={columns}
          rows={historyData || []}
          miniColumns={['create_at', 'history']}
          openMiniModal={openTableDataModal}
          showToolbar={false}
          rowHeight={60}
        />
      </Card>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'ID:': formatDate(tableData.created_at),
                'Comments:': formatDate(tableData.comments),
                'Verified By:': getFullName(tableData.user),
              }
            : {}
        }
      />
    </>
  )
}

export default MarkCompleteHistoryCard
