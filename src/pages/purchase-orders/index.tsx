import { Box, Card, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import PageContainer from 'src/components/global/PageContainer'
import TableSearchInput from 'src/components/global/TableSearchInput'
import { getFullName } from 'src/utils/dataUtils'

const PurchaseOrdersList = () => {
  const [search, setSearch] = useState({
    search: '',
    start: '',
    end: '',
    user: '',
  })
  const [user, setUser] = useState('')

  const arr = [
    {
      id: 1,
      sku: '123',
      productName: 'Product 1',
      quantity: 10,
      invoiceNumber: 'INV-123',
      invoiceDate: '2020-01-01',
      directDelivery: 'Yes',
    },
  ]

  const columns: GridColDef[] = [
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
      field: 'invoiceDate',
      headerName: 'INVOICE DATE',
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
      headerName: 'DIRECT DELIVERY',
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
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Products Pending Order', to: '/' },
        ]}
      >
        <Card>
          <AppTable
            columns={columns}
            rows={arr}
            miniColumns={['receiptNumber', 'amount']}
            showToolbar
            showSearch={false}
            checkboxSelection
            actionBtns={
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
                  handleChange={e =>
                    setUser(e.target.value)
                  }
                  sx={{ minWidth: '150px' }}
                />
                <AppSelect
                  placeholder='Brand'
                  value={user}
                  options={[].map(_user => ({
                    label: getFullName(_user),
                    value: _user,
                  }))}
                  handleChange={e =>
                    setUser(e.target.value)
                  }
                  sx={{ minWidth: '150px' }}
                />
                <AppSelect
                  placeholder='Direct Delivery'
                  value={user}
                  options={[].map(_user => ({
                    label: getFullName(_user),
                    value: _user,
                  }))}
                  handleChange={e =>
                    setUser(e.target.value)
                  }
                  sx={{ minWidth: '150px' }}
                />
              </Box>
            }
          />
        </Card>
      </PageContainer>
    </>
  )
}

export default PurchaseOrdersList
