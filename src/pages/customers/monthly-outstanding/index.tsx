import { Card, Typography } from '@mui/material'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
import { GridColDef } from '@mui/x-data-grid'

import AppTable from 'src/components/global/AppTable'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { IData } from 'src/utils/types'
import { formatCurrency } from 'src/utils/formatCurrency'
import {
  customersApi,
  useSearchCustomersQuery,
} from 'src/store/apis/customersSlice'
import { getFullName } from 'src/utils/dataUtils'
import { buildUrl } from 'src/utils/routeUtils'
import {
  addDebitCreditAvailableColumn,
  divideTransactionsInto3Months,
  getPreviousMonthName,
} from 'src/utils/dateUtils'

const CustomersOutstandingPage = () => {
  const { isMobileSize } = useWindowSize()

  const [rows, setRows] = useState<any[]>([])

  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: searchedCustomers,
    isLoading,
    isFetching,
  } = useSearchCustomersQuery(searchTerm)

  const [
    getPending,
    {
      isFetching: isInvoicesFetching,
      isLoading: isInvoicesLoading,
    },
  ] =
    customersApi.endpoints.getCustomerPendingInvoices.useLazyQuery()

  const getCustomerOutstanding = useCallback(
    async (customer_id: number) => {
      const { data: pendingInvoices } = await getPending({
        page: 1,
        customer_id,
      })

      const invoiceTotals = divideTransactionsInto3Months(
        addDebitCreditAvailableColumn(
          pendingInvoices ? pendingInvoices.results : [],
        ),
      )

      return invoiceTotals
    },
    [getPending],
  )

  const getList = useCallback(
    (customerList: any[]) => {
      return customerList.map(
        async (customer: any, i: number) => {
          const obj = await getCustomerOutstanding(
            customer.id,
          )

          return {
            index: i + 1,
            ...customer,
            ...obj,
          }
        },
      )
    },
    [getCustomerOutstanding],
  )

  useEffect(() => {
    const fetchData = async () => {
      const list = await Promise.all(
        getList(searchedCustomers?.results || []),
      )

      setRows(list)
    }

    fetchData()
  }, [searchedCustomers?.results, searchTerm, getList])

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 100,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'CUSTOMER NAME',
      minWidth: 130,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      valueGetter: params => getFullName(params.row),
      renderCell: params => (
        <Typography color='primary' fontWeight={600}>
          <Link
            href={buildUrl('customers', {
              itemId: params.row.id,
            })}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },

    {
      field: 'month',
      headerName: getPreviousMonthName(0),
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'month1',
      headerName: getPreviousMonthName(1),
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'month2',
      headerName: getPreviousMonthName(2),
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'month3',
      headerName: getPreviousMonthName(3) + '+',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'monthTotal',
      headerName: 'TOTAL',
      minWidth: 100,
      flex: 1,
      maxWidth: 160,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Customers', to: '/customers' },
          {
            label: 'Customer Monthly Outstanding',
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
            rows={rows}
            isLoading={
              isLoading ||
              isFetching ||
              isInvoicesFetching ||
              isInvoicesLoading
            }
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar
            pagination={false}
            showPageSizes={false}
            searchPlaceholder='Search Customers'
            search={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${getFullName(tableData)}`
            : ''
        }
        tableData={
          tableData
            ? {
                [getPreviousMonthName(3) + '+']:
                  formatCurrency(tableData.month3),
                [getPreviousMonthName(2)]: formatCurrency(
                  tableData.month2,
                ),
                [getPreviousMonthName(1)]: formatCurrency(
                  tableData.month1,
                ),
                [getPreviousMonthName(0)]: formatCurrency(
                  tableData.month,
                ),
                Total: formatCurrency(tableData.monthTotal),
              }
            : {}
        }
      />
    </>
  )
}

CustomersOutstandingPage.acl = {
  action: 'read',
  subject: 'customer-monthly',
}

export default CustomersOutstandingPage
