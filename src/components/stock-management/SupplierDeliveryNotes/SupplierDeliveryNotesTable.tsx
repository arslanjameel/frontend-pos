import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import TableSearchInput from 'src/components/global/TableSearchInput'
import { getFullName } from 'src/utils/dataUtils'

export const SupplierDeliveryNotesTable = () => {
  const arr = [
    {
      id: 1,
      dnid: '123',
      supplier: 'John',
      store: 'Store 1',
      date: '2020-01-01',
    },
  ]

  const [search, setSearch] = useState({
    search: '',
    start: '',
    end: '',
    user: '',
  })
  const [user, setUser] = useState('')

  const columns: GridColDef[] = [
    {
      field: 'dnid',
      headerName: 'D/N ID',
      type: 'string',
      width: 120,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'SUPPLIER',
      type: 'string',
      width: 150,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'store',
      headerName: 'STORE',
      width: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'DATE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 130,
      cellClassName: 'yes-overflow',
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => console.log(params)}
              color='primary'
            >
              <Icon icon='tabler:edit' />
            </IconButton>
            <IconButton color='error'>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <Card>
      <AppTable
        columns={columns}
        rows={arr}
        miniColumns={['receiptNumber', 'amount']}
        showToolbar
        showHeader={true}
        header='Supplier Delivery Notes'
        showSearch={false}
        secondaryActionBtns={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TableSearchInput
              placeholder='Search'
              value={search.search}
              onChange={val => {
                const filter = { ...search }
                filter.search = val
                setSearch(filter)
              }}
              sx={{ minWidth: '200px' }}
            />
            <AppSelect
              placeholder='Supplier'
              value={user}
              options={[].map(_user => ({
                label: getFullName(_user),
                value: _user,
              }))}
              handleChange={e => setUser(e.target.value)}
              sx={{ minWidth: '150px' }}
            />
            <AppSelect
              placeholder='Brand'
              value={user}
              options={[].map(_user => ({
                label: getFullName(_user),
                value: _user,
              }))}
              handleChange={e => console.log(e)}
              sx={{ minWidth: '150px' }}
            />
            <AppSelect
              placeholder='Direct Delivery'
              value={user}
              options={[].map(_user => ({
                label: getFullName(_user),
                value: _user,
              }))}
              handleChange={e => console.log(e)}
              sx={{ minWidth: '150px' }}
            />
          </Box>
        }
      />
    </Card>
  )
}
