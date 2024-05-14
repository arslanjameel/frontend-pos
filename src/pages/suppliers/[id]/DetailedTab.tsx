// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import AppTable from 'src/components/global/AppTable'
import { useModal } from 'src/hooks/useModal'
import { IData } from 'src/utils/types'
import { formatCurrency } from 'src/utils/formatCurrency'
import TableDataModal from 'src/components/global/TableDataModal'
import TransactionStatus from 'src/components/customers/TransactionStatus'
import AppMenu from 'src/components/global/AppMenu'
import FilterMenu from 'src/components/global/FilterMenu'
import DateRangePicker from 'src/components/global/DateRangePicker'
import EmailDocumentsModal from 'src/components/customers/EmailDocumentsModal'
import AppSelect from 'src/components/global/AppSelect'
import AppModal from 'src/components/global/AppModal'

const DetailedTab = () => {
  const detailedTransactions: any[] = []

  const [dateRange, setDateRange] = useState<string[]>([
    new Date().toLocaleDateString(),
    new Date().toLocaleDateString(),
  ])
  const [transactionType, setTransactionType] = useState(11)
  const [rowsSelectedData, setRowsSelectedData] = useState<
    any[]
  >([])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    openModal: openEmailDocsModal,
    closeModal: closeEmailDocsModal,
    isModalOpen: emailDocsModalStatus,
  } = useModal<any>()

  const {
    openModal: openNoDocsModal,
    closeModal: closeNoDocsModal,
    isModalOpen: noDocsModalStatus,
  } = useModal<any>()

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'DATE',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'document',
      headerName: 'DOCUMENT',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'transactionId',
      headerName: 'TRANSACTION ID',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <TransactionStatus status={params.value} />
      ),
    },
  ]

  return (
    <>
      <Box>
        <AppTable
          columns={columns}
          miniColumns={['date', 'document']}
          openMiniModal={openTableDataModal}
          rows={detailedTransactions}
          checkboxSelection={true}
          showPageSizes={false}
          showToolbar
          showSearch
          onRowSelectionModelChange={ids => {
            setRowsSelectedData(
              detailedTransactions.filter(transaction =>
                ids.includes(transaction.id),
              ),
            )
          }}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Detailed Transaction
            </Typography>
          }
          secondaryActionBtns={
            <>
              <FilterMenu>
                <DateRangePicker
                  value={dateRange}
                  onChange={val => setDateRange(val)}
                />
                <Box sx={{ height: 5 }}></Box>
                <AppSelect
                  label=''
                  placeholder='Transaction Type'
                  value={transactionType}
                  handleChange={e =>
                    setTransactionType(e.target.value)
                  }
                  options={[
                    { label: 'Pending', value: 0 },
                    { label: 'Completed', value: 1 },
                  ]}
                />
              </FilterMenu>
              <AppMenu
                menuItems={[
                  {
                    icon: 'tabler:cash',
                    label: 'Add Payment',
                    onClick: () =>
                      console.log('adding payment'),
                  },
                  {
                    icon: 'tabler:mail',
                    label: 'Email',
                    onClick: () => {
                      if (rowsSelectedData.length > 0) {
                        openEmailDocsModal(1)
                      } else {
                        openNoDocsModal(1)
                      }
                    },
                  },
                  {
                    icon: 'tabler:download',
                    label: 'Download',
                    onClick: () => console.log('download'),
                  },
                ]}
              />
            </>
          }
        />
      </Box>
      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.transactionId}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Date:': tableData.date,
                'Document:': tableData.document,
                'Transaction ID:': tableData.transactionId,
                'Amount:': tableData.amount,
              }
            : {}
        }
      />

      <EmailDocumentsModal
        from='supplier'
        open={emailDocsModalStatus()}
        handleClose={closeEmailDocsModal}
        onSubmit={values => {
          toast.success(
            'TODO: Email sent to ' + values.email,
          )
          closeEmailDocsModal()
        }}
        data={{
          customerName: 'Jamal Kerrod',
          customerId: 'BGIW23',
          documents: rowsSelectedData,
        }}
      />

      <AppModal
        open={noDocsModalStatus()}
        handleClose={closeNoDocsModal}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ mb: 3 }}>
            No Documents Selected
          </Typography>
          <Typography>
            Please select some documents and try again
          </Typography>
        </Box>
      </AppModal>
    </>
  )
}

export default DetailedTab
