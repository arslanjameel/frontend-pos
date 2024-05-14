import { Box, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useState } from 'react'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableSearchInput from 'src/components/global/TableSearchInput'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { getFullName } from 'src/utils/dataUtils'

export const PendingSupplierDeliveryTable = () => {
  const arr = [
    {
      id: 1,
      sku: '123',
      productName: 'Product 1',
      quantity: 10,
      invoiceNumber: 'INV-123',
      orderNumber: '24242A',
      directDelivery: '2020-01-01',
    },
  ]

  const { isMobileSize } = useWindowSize()
  const [search, setSearch] = useState({
    search: '',
    start: '',
    end: '',
    user: '',
  })
  const [user, setUser] = useState('')

  const columns: GridColDef[] = [
    {
      field: 'invoiceNumber',
      headerName: 'INVOICE NO.',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      minWidth: 170,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'productName',
      headerName: 'PRODUCT NAME',
      type: 'string',
      width: 180,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },

    {
      field: 'orderNumber',
      headerName: 'ORDER NO.',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'directDelivery',
      headerName: 'Expec. Date',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
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
        header='Pending Supplier Delivery'
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
              placeholder='Direct Delivery'
              value={user}
              options={[].map(_user => ({
                label: getFullName(_user),
                value: _user,
              }))}
              handleChange={e => setUser(e.target.value)}
              sx={{ minWidth: '150px' }}
            />
            <Link href=''>
              <ResponsiveButton
                label='Add Delivery Note'
                icon=''
                sx={{ width: '180px' }}
                mini={isMobileSize}
              />
            </Link>
          </Box>
        }
      />
    </Card>
  )
}
