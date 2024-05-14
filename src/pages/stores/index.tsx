import {
  Card,
  Typography,
  Button,
  Avatar,
} from '@mui/material'
import React, { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import CustomTag from 'src/components/global/CustomTag'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import TableDataModal from 'src/components/global/TableDataModal'
import {
  useGetBusinessTypesQuery,
  useGetBusinessesQuery,
  useGetStoresQuery,
} from 'src/store/apis/accountSlice'
import AppTableUserCard from 'src/components/global/AppTableUserCard'
import FallbackSpinner from 'src/@core/components/spinner'
import AccountNumber from 'src/components/global/AccountNumber'
import useGetCityName from 'src/hooks/useGetCityName'
import { buildUrl } from 'src/utils/routeUtils'
import { getInitials } from 'src/@core/utils/get-initials'

const StoresList = () => {
  const [page, setPage] = useState(1)
  const handlePageChange = (newPage: number) =>
    setPage(newPage)

  const { data: stores, isLoading } = useGetStoresQuery({
    page,
  })
  const { data: businesses } = useGetBusinessesQuery()
  const { data: businessTypes } = useGetBusinessTypesQuery()

  const { getCity } = useGetCityName()

  const getBusiness = (businessId: number) => {
    const _businesses = businesses?.results || []

    return _businesses.find(
      (_b: any) => _b.id === businessId,
    )
  }

  const getBusinessType = (businessTypeId: number) => {
    const _businessTypes = businessTypes?.results || []

    return _businessTypes.find(
      (_b: any) => _b.id === businessTypeId,
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1,
      minWidth: 270,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => {
        return (
          <AppTableUserCard
            img={'no-logo'}
            name={params.value}
            nameLink={buildUrl('stores', {
              itemId: params.row?.id,
            })}
            email={params.row?.email}
          />
        )
      },
    },
    {
      field: 'storeType',
      headerName: 'TYPE',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTag
          color={
            params.value === 'B2C' ? 'primary' : 'success'
          }
          label={params.value}
        />
      ),
    },
    {
      field: 'storeAddress',
      headerName: 'ADDRESS',
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      valueGetter: params =>
        `${params.value}, ${getCity(params.row.city)}, ${
          params.row.postalCode
        }`,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'phone',
      headerName: 'PHONE',
      type: 'string',
      width: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'bank_account',
      headerName: 'BANK ACCOUNT',
      width: 180,
      disableColumnMenu: true,
      align: 'center',
      renderCell: params => (
        <Typography>
          <AccountNumber bank_account={params.value} />
        </Typography>
      ),
    },
  ]

  const [tableData, setTableData] = useState<IData | false>(
    false,
  )
  const openTableDataModal = (data: IData) =>
    setTableData(data)
  const closeTableDataModal = () => setTableData(false)

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Stores', to: buildUrl('stores') },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          {isLoading ? (
            <FallbackSpinner brief />
          ) : (
            <AppTable
              isLoading={isLoading}
              rows={stores?.results || []}
              totalRows={stores ? stores.count : 0}
              onPageChange={handlePageChange}
              columns={columns}
              miniColumns={['name']}
              openMiniModal={openTableDataModal}
              showToolbar
              actionBtns={
                <Link
                  href={buildUrl('stores', { mode: 'new' })}
                >
                  <Button
                    variant='contained'
                    startIcon={<Icon icon='tabler:plus' />}
                  >
                    Add Store
                  </Button>
                </Link>
              }
              showSearch={false}
            />
          )}
        </Card>
      </PageContainer>

      <TableDataModal
        open={typeof tableData !== 'boolean'}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.name}` : ''
        }
        tableData={
          tableData
            ? {
                'Image:': (
                  <Avatar src={tableData.img}>
                    {getInitials(tableData.name)}
                  </Avatar>
                ),
                'Name:': tableData.name,
                'Email:': tableData.email,
                'Type:': (
                  <CustomTag
                    color={
                      tableData.type === 'B2C'
                        ? 'primary'
                        : 'success'
                    }
                    label={
                      getBusinessType(
                        getBusiness(tableData.business)
                          ?.businessType || 1,
                      )?.type || '--'
                    }
                  />
                ),
                'Phone:': tableData.primaryPhone,
                'Address:': tableData?.storeAddress || '--',
                'Account No:': (
                  <AccountNumber
                    bank_account={tableData.bank_account}
                  />
                ),
              }
            : {}
        }
      />
    </>
  )
}

export default StoresList
