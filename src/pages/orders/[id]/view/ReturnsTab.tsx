import { Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import AppTable from 'src/components/global/AppTable'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { formatDate } from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { isIdValid } from 'src/utils/routerUtils'
import { IData } from 'src/utils/types'
import { useGetSinglereturnSaleQuery } from 'src/store/apis/SalesSlice'

const ReturnsTab = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)
  const { data: Sales } = useGetSinglereturnSaleQuery(id)

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'ID',
      headerName: 'ID',
      width: 155,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/credit-notes/${id}/view`}
            style={{ fontWeight: 600 }}
          >
            {params.row.id}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'TYPE',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <div>
          {params.row.paid_from_card > 0 && (
            <Typography>Card</Typography>
          )}
          {params.row.paid_from_bacs > 0 && (
            <Typography>BACS</Typography>
          )}
          {params.row.paid_from_credit > 0 && (
            <Typography>Credit</Typography>
          )}
          {params.row.paid_from_cash > 0 && (
            <Typography>Cash</Typography>
          )}
        </div>
      ),
    },
    {
      field: 'return_price',
      headerName: 'AMOUNT',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          <Typography>
            {parseFloat(params.row.return_price).toFixed(2)}
          </Typography>
        </Typography>
      ),
    },
    {
      field: 'return_date',
      headerName: 'RETURN DATE',
      type: 'string',
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>
          {formatDate(params.row.return_date)}
        </Typography>
      ),
    },
    {
      field: 'first_name',
      headerName: 'VERIFIED BY',
      type: 'string',
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{Sales.user.first_name}</Typography>
      ),
    },
  ]

  return (
    <>
      <Card sx={{ flex: 1 }}>
        <AppTable
          columns={columns}
          rows={Sales ? Sales.return_on : []}
          miniColumns={['id', 'type']}
          openMiniModal={openTableDataModal}
          showToolbar
          showSearch={false}
          showPageSizes={false}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Credit Notes
            </Typography>
          }
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
                'ID:': tableData.id,
                'Type:': tableData.type,
                'Amount:': formatCurrency(tableData.amount),
                'Return Date:': formatDate(
                  tableData.returnDate,
                ),
                'Verified By:': tableData.verifiedBy,
              }
            : {}
        }
      />
    </>
  )
}

export default ReturnsTab
