import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import EmailStatementsModal from 'src/components/customers/EmailStatementsModal'
import AppMenu from 'src/components/global/AppMenu'
import AppModal from 'src/components/global/AppModal'
import AppTable from 'src/components/global/AppTable'
import CustomTag from 'src/components/global/CustomTag'
import MonthlyStatementModal from 'src/components/global/Modals/MonthlyStatementModal'
import TableDataModal from 'src/components/global/TableDataModal'
import useGetCityName from 'src/hooks/useGetCityName'
import useGetDefaultCustomerAddresses from 'src/hooks/useGetDefaultCustomerAddresses'
import { useModal } from 'src/hooks/useModal'
import { ICustomer } from 'src/models/ICustomer'
import { useGetCitiesQuery } from 'src/store/apis/accountSlice'
import {
  useGetCustomerPendingInvoicesQuery,
  useGetCustomerTransactionsQuery,
} from 'src/store/apis/customersSlice'
import { useAppSelector } from 'src/store/hooks'
import capitalize from 'src/utils/capitalize'
import {
  addDebitCreditAvailableColumn,
  dateToString,
  divideTransactionsIntoMonths,
  filterTransactionsByMonthYear,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { downloadStatementsPDF } from 'src/utils/pdfUtils'
import { addTransactionInfo } from 'src/utils/transactionUtils'
import { IData } from 'src/utils/types'

interface Props {
  customer_id: number
  customerInfo: ICustomer
}

const StatementsTab = ({
  customer_id,
  customerInfo,
}: Props) => {
  const [openedTab, setOpenedTab] = useState(0)
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setOpenedTab(newValue)
  }

  const { getDefaultBilling } =
    useGetDefaultCustomerAddresses({
      addresses: customerInfo.addresses,
    })

  const { data: cities } = useGetCitiesQuery()
  const { getCity } = useGetCityName(cities || [])

  const [rowsSelectedData, setRowsSelectedData] = useState<
    any[]
  >([])

  const { store } = useAppSelector(state => state.app)

  const { statements } = useAppSelector(
    state => state.customers,
  )

  const { data: customerTransactions } =
    useGetCustomerTransactionsQuery({
      customer_id,
      page: 1,
    })

  const { data: customerInvoices } =
    useGetCustomerPendingInvoicesQuery({
      page: 1,
      customer_id,
    })

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    openModal: openEmailCustomerModal,
    closeModal: closeEmailCustomerModal,
    isModalOpen: emailCustomerModalStatus,
  } = useModal<any>()

  const {
    // openModal: openEmailDocsModal,
    closeModal: closeEmailDocsModal,
    isModalOpen: emailDocsModalStatus,
  } = useModal<any>()

  const {
    // openModal: openNoDocsModal,
    closeModal: closeNoDocsModal,
    isModalOpen: noDocsModalStatus,
  } = useModal<any>()

  const {
    openModal: openMonthlyStatementModal,
    closeModal: closeMonthlyStatementModal,
    isModalOpen: monthlyStatementModalStatus,
  } = useModal<any>()

  const generateMonthlyStatement = (monthYear: string) => {
    const _transactions = addDebitCreditAvailableColumn(
      addTransactionInfo(
        filterTransactionsByMonthYear(
          customerTransactions?.transactions || [],
          monthYear,
          'created_at',
        ),
      ),
    )

    const _totals =
      divideTransactionsIntoMonths(_transactions)
    const totals = _totals.reduce(
      (acc: any, { label, value }) => {
        acc[label] = formatCurrency(value)

        return acc
      },
      {},
    )

    downloadStatementsPDF({
      statements: _transactions.map(statement => ({
        ...statement,
        date: dateToString(new Date(statement.created_at)),
        transaction: statement.transaction_number,
        debit: formatCurrency(statement.debit),
        credit: formatCurrency(statement.credit),
        available: formatCurrency(statement.available),
      })),
      tableItems: {
        'Statement Date': dateToString(
          new Date(),
          'dd/MM/yyyy',
        ),
        'Statement No.': '8723',
        'Customer No.': customer_id,
      },
      totals,
      billingAddressTitle: customerInfo.accountName,
      billingAddress: [
        getDefaultBilling().addressLine1,
        getCity(getDefaultBilling().city),
        getDefaultBilling().postCode,
      ],
      storeName: store.name,
      storeAddress: [
        store.storeAddress,
        getCity(store.city),
        store.postalCode,
        '',
        'Tel No: ' + store.phone,
        'Email: ' + store.email,
      ],
    })
  }

  const generateOutstandingStatement = () => {
    const _transactions = addDebitCreditAvailableColumn(
      addTransactionInfo(customerInvoices?.results || []),
    )

    const _totals =
      divideTransactionsIntoMonths(_transactions)
    const totals = _totals.reduce(
      (acc: any, { label, value }) => {
        acc[label] = formatCurrency(value)

        return acc
      },
      {},
    )

    downloadStatementsPDF({
      statements: _transactions.map(statement => ({
        ...statement,
        date: dateToString(new Date(statement.created_at)),
        document: capitalize(
          statement.transaction.transaction_type,
        ),
        transaction:
          statement.transaction.transaction_number,
        debit: formatCurrency(statement.debit),
        credit: formatCurrency(statement.credit),
        available: formatCurrency(statement.available),
      })),
      tableItems: {
        'Statement Date': dateToString(
          new Date(),
          'dd/MM/yyyy',
        ),
        'Statement No.': '8723',
        'Customer No.': customer_id,
      },
      totals,
      storeName: store.name,
      storeAddress: [
        store.storeAddress,
        getCity(store.city),
        store.postalCode,
        '',
        'Tel No: ' + store.phone,
        'Email: ' + store.email,
      ],
      billingAddressTitle: customerInfo.accountName,
      billingAddress: [
        getDefaultBilling().addressLine1,
        getCity(getDefaultBilling().city),
        getDefaultBilling().postCode,
      ],
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'statementId',
      headerName: 'STATEMENT ID',
      flex: 1,
      minWidth: 150,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'createdDate',
      headerName: 'CREATED DATE',
      type: 'string',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'emailStatus',
      headerName: 'EMAIL STATUS',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTag
          label={
            params.value === 0 ? 'Not Sent' : 'Emailed'
          }
          color={params.value === 0 ? 'warning' : 'success'}
        />
      ),
    },
    {
      field: 'totalAmount',
      headerName: 'TOTAL AMOUNT',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: '',
      headerName: 'ACTION',
      align: 'center',
      headerAlign: 'center',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <>
          <IconButton color='primary'>
            <Icon icon='tabler:download' />
          </IconButton>
          <IconButton
            color='primary'
            onClick={() =>
              openEmailCustomerModal(params.row.id)
            }
          >
            <Icon icon='tabler:mail' />
          </IconButton>
        </>
      ),
    },
  ]

  return (
    <>
      <Box>
        <AppTable
          columns={columns}
          miniColumns={['createdDate', 'emailStatus']}
          openMiniModal={openTableDataModal}
          rows={[]}
          noRowsText='No Statements Added'
          checkboxSelection={true}
          showPageSizes={false}
          showToolbar
          showSearch={false}
          onRowSelectionModelChange={ids => {
            setRowsSelectedData(
              statements.filter(transaction =>
                ids.includes(transaction.id),
              ),
            )
          }}
          leftActionBtns={
            <Typography variant='h5'>Statements</Typography>
          }
          secondaryActionBtns={
            <Box sx={{ display: 'flex' }}>
              <Tabs
                value={openedTab}
                onChange={handleChange}
              >
                <Tab label='This Year' />
                {/* <Tab label='2022' />
                <Tab label='2021' /> */}
              </Tabs>

              <AppMenu
                menuItems={[
                  {
                    icon: 'tabler:file-info',
                    label: 'Generate Monthly Statement',
                    onClick: () =>
                      openMonthlyStatementModal(''),
                  },
                  {
                    icon: 'tabler:file-info',
                    label: 'Generate Outstanding Statement',
                    onClick: () =>
                      generateOutstandingStatement(),
                  },

                  // {
                  //   icon: 'tabler:mail',
                  //   label: 'Email',
                  //   onClick: () => {
                  //     if (rowsSelectedData.length > 0) {
                  //       openEmailDocsModal(1)
                  //     } else {
                  //       openNoDocsModal(1)
                  //     }
                  //   },
                  // },
                  // {
                  //   icon: 'tabler:download',
                  //   label: 'Download',
                  //   onClick: () => console.log('download'),
                  // },
                ]}
              />
            </Box>
          }
        />
      </Box>
      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData
            ? `Details of ${tableData.statementId}`
            : ''
        }
        tableData={
          tableData
            ? {
                'Statement ID:': tableData.statementId,
                'Date:': tableData.createdDate,
                'Email Status:': (
                  <CustomTag
                    label={
                      tableData.emailStatus === 0
                        ? 'Not Sent'
                        : 'Emailed'
                    }
                    color={
                      tableData.emailStatus === 0
                        ? 'warning'
                        : 'success'
                    }
                  />
                ),
                'Total Amount:': tableData.totalAmount,
              }
            : {}
        }
        actionBtns={
          <Box>
            <Button
              startIcon={<Icon icon='tabler:download' />}
            >
              Download
            </Button>
            <Button startIcon={<Icon icon='tabler:mail' />}>
              Email
            </Button>
          </Box>
        }
      />

      <EmailStatementsModal
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

      <EmailCustomerModal
        open={emailCustomerModalStatus()}
        handleClose={closeEmailCustomerModal}
        onSubmit={values => {
          toast.success(
            'TODO: Email sent to ' + values.email,
          )
          closeEmailCustomerModal()
        }}
        data={{
          customerName: 'Jamal Kerrod',
          documentId: 'BB2323',
          documentType: 'Invoice',
          documentDate: '09 May 2022',
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

      <MonthlyStatementModal
        transactions={(customerInvoices?.results || []).map(
          stmt => ({
            ...stmt,
          }),
        )}
        open={monthlyStatementModalStatus()}
        handleClose={closeMonthlyStatementModal}
        generateStatement={generateMonthlyStatement}
      />
    </>
  )
}

export default StatementsTab
