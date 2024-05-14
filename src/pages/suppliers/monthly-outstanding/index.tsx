import {
  Card,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

// import toast from 'react-hot-toast'
// import Link from 'next/link'
import React, { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'

import AppTable from 'src/components/global/AppTable'

// import CustomTag from 'src/components/global/CustomTag'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { IData } from 'src/utils/types'
import { formatCurrency } from 'src/utils/formatCurrency'
import { useAppSelector } from 'src/store/hooks'

const SuppliersOutstandingPage = () => {
  const { isMobileSize } = useWindowSize()
  const { outstanding } = useAppSelector(
    state => state.suppliers,
  )

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  //   const months = ['AUG 23']

  //   const getFieldCol = (monthData: any, month: string) => {
  //     const monthInfo = monthData.months.find(v => v.label === month)

  //     if (!monthInfo) return

  //     return {
  //       field: 'id',
  //       headerName: 'AUG 23',
  //       minWidth: 130,
  //       flex: 1,
  //       type: 'string',
  //       disableColumnMenu: true,
  //       renderCell: params => <Typography>{params.row.months.find}</Typography>
  //     }
  //   }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'SUPPLIER NAME',
      minWidth: 130,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },

    {
      field: '-id',
      headerName: 'AUG 23',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{formatCurrency(6212)}</Typography>
      ),
    },
    {
      field: 'id1',
      headerName: 'JUL 23',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{formatCurrency(6212)}</Typography>
      ),
    },
    {
      field: 'id2',
      headerName: 'JUN 23',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{formatCurrency(6212)}</Typography>
      ),
    },
    {
      field: 'id3',
      headerName: 'MAY 23+',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{formatCurrency(6212)}</Typography>
      ),
    },
    {
      field: 'id4',
      headerName: 'TOTAL',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: () => (
        <Typography>{formatCurrency(6212)}</Typography>
      ),
    },
  ]

  const monthOptions = ['4 Months']
  const [monthOption, setMonthOption] = useState('')

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Suppliers', to: '/suppliers' },
          {
            label: 'Supplier Monthly Outstanding',
            to: '#',
          },
        ]}
        actionBtns={
          <ResponsiveButton
            icon='tabler:file-export'
            label='Export Outstanding'
            mini={isMobileSize}
          />
        }
      >
        <Card sx={{ pb: 5 }}>
          <AppTable
            columns={columns}
            rows={outstanding}
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar
            pagination={false}
            searchPlaceholder='Search Suppliers'
            secondaryActionBtns={
              <Select
                size='small'
                value={monthOption}
                sx={{ width: 130 }}
                onChange={e =>
                  setMonthOption(e.target.value)
                }
              >
                {monthOptions.map(v => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.name}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.name,
                'AUG 23:': formatCurrency(23232),
                'JUL 23:': formatCurrency(23232),
                'JUN 23:': formatCurrency(23232),
                'MAY 23+:': formatCurrency(23232),
                'TOTAL:': formatCurrency(23232),
              }
            : {}
        }
      />
    </>
  )
}

export default SuppliersOutstandingPage
