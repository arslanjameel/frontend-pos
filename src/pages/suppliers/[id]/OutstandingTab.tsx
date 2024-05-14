// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Box, Typography } from '@mui/material'
import { GridColDef, GridRowId } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import AppMenu from 'src/components/global/AppMenu'
import AppTable from 'src/components/global/AppTable'
import FilterMenu from 'src/components/global/FilterMenu'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { formatCurrency } from 'src/utils/formatCurrency'
import { IData } from 'src/utils/types'
import DateRangePicker from 'src/components/global/DateRangePicker'
import EmailDocumentsModal from 'src/components/customers/EmailDocumentsModal'
import AppSelect from 'src/components/global/AppSelect'
import AppModal from 'src/components/global/AppModal'

const OutstandingTab = () => {
  const outstandingTransactions: any[] = []

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
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      type: 'string',
      align: 'center',
      headerAlign: 'center',
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
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
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
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'debit',
      headerName: 'DEBIT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 14 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'credit',
      headerName: 'CREDIT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography sx={{ fontSize: 14 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: '',
      headerName: 'AVAILABLE',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      maxWidth: 220,
      disableColumnMenu: true,
    },
  ]

  const totals = [
    { label: '4 Months', value: 0 },
    { label: '3 Months', value: 0 },
    { label: '2 Months', value: 0 },
    { label: '1 Months', value: 0 },
    { label: 'Current', value: 0 },
    { label: 'Total', value: 0 },
  ]

  return (
    <>
      <Box>
        <AppTable
          columns={columns}
          miniColumns={['date', 'document']}
          openMiniModal={openTableDataModal}
          rows={outstandingTransactions}
          checkboxSelection={true}
          showPageSizes={false}
          showToolbar
          showSearch
          pagination={false}
          onRowSelectionModelChange={ids => {
            setRowsSelectedData(
              outstandingTransactions.filter(
                (transaction: { id: GridRowId }) =>
                  ids.includes(transaction.id),
              ),
            )
          }}
          leftActionBtns={
            <Typography variant='h5' fontWeight={600}>
              Outstanding Transactions
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

        <Box
          sx={{
            mb: 4,
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {totals.map((item, i) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                px: 5,
                gap: 2,
                width: 'fit-content',
                pt: 2,
                pb: 1,
                borderTop:
                  i + 1 === totals.length
                    ? '1px solid #e3e3e3b2'
                    : '',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  minWidth: 80,
                  textAlign: 'right',
                }}
              >
                {item.label}:
              </Typography>
              <Typography
                sx={{ minWidth: 80, textAlign: 'right' }}
              >
                {formatCurrency(item.value)}
              </Typography>
            </Box>
          ))}
        </Box>
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
                'Debit:': tableData.debit,
                'Credit:': tableData.credit,
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
          documents: rowsSelectedData.map(val => ({
            ...val,
            amount: val.credit,
          })),
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

export default OutstandingTab
