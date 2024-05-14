import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Can from 'src/layouts/components/acl/Can'
import Icon from 'src/@core/components/icon'
import EmailCustomerModal from 'src/components/customers/EmailCustomerModal'
import AppSelect from 'src/components/global/AppSelect'
import AppTable from 'src/components/global/AppTable'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import DateRangePicker from 'src/components/global/DateRangePicker'
import PageContainer from 'src/components/global/PageContainer'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import TableDataModal from 'src/components/global/TableDataModal'
import TableSearchInput from 'src/components/global/TableSearchInput'
import useGetCityName from 'src/hooks/useGetCityName'
import { useModal } from 'src/hooks/useModal'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
} from 'src/store/apis/accountSlice'
import {
  useDeleteSingleQuoteMutation,
  useGetQuoteSearchQuery,
  useGetUsersWithQuotesQuery,
} from 'src/store/apis/quotesSlice'
import { useAppSelector } from 'src/store/hooks'
import {
  getAddressInfo,
  getCityName,
  getCountryName,
} from 'src/utils/addressUtils'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import capitalize from 'src/utils/capitalize'
import { isCashCustomer } from 'src/utils/customers.util'
import {
  excludeVAT,
  getFullName,
} from 'src/utils/dataUtils'
import {
  dateToString,
  formatDate,
} from 'src/utils/dateUtils'
import { formatCurrency } from 'src/utils/formatCurrency'
import { EMAIL_QUOTE_BODY } from 'src/utils/globalConstants'
import {
  downloadPDFAction,
  emailPDFAction,
} from 'src/utils/pdfUtils'
import { generateQuotePDF } from 'src/utils/pdfs/generateQuotePDF'
import { buildUrl } from 'src/utils/routeUtils'
import {
  addQuotesTotalColumn,
  calculateQuoteValue,
} from 'src/utils/transactionUtils'
import { IData } from 'src/utils/types'

const QuotationsList = () => {
  const { getCity } = useGetCityName()
  const { store } = useAppSelector(state => state.app)
  const [search, setSearch] = useState({
    search: '',
    start: '',
    end: '',
    user: '',
    page: 1,
    store: store?.id,
  })

  const [dateRange, setDateRange] = useState<string[]>([])

  useEffect(() => {
    if (store.id !== 0) {
      setSearch({
        ...search,
        store: store?.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  const {
    data: quotes,
    isLoading,
    isFetching,
  } = useGetQuoteSearchQuery({
    ...search,
    start: dateRange[0]
      ? formatDate(
          new Date(dateRange[0] || '').toISOString(),
          'yyyy-MM-dd',
        )
      : '',
    end: dateRange[1]
      ? formatDate(
          new Date(dateRange[1] || '').toISOString(),
          'yyyy-MM-dd',
        )
      : '',
  })
  const { data: userAccounts } =
    useGetUsersWithQuotesQuery()
  const [deleteSingleQuote] = useDeleteSingleQuoteMutation()
  const { data: countries } = useGetCountriesQuery()
  const { data: cities } = useGetCitiesQuery()

  const { isMobileSize } = useWindowSize()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const {
    modalData: quoteToEmail,
    openModal: openEmailCustomerModal,
    closeModal: closeEmailCustomerModal,
    isModalOpen: emailCustomerModalStatus,
  } = useModal<any>()

  const pdfAction = (
    action: 'email' | 'download',
    emailTo = quoteToEmail?.customer?.email,
  ) => {
    if (quoteToEmail?.customer) {
      const quoteTitle =
        'Quote ' + quoteToEmail?.quote_number

      const emailInfo = {
        email: emailTo || '',
        email_title: quoteTitle,
        email_body: EMAIL_QUOTE_BODY,
        store_id: store?.id,
      }

      let quotationAddress = []
      if (!isCashCustomer(quoteToEmail?.customer)) {
        const addr = getAddressInfo(
          quoteToEmail?.customer.addresses,
          { id: quoteToEmail.invoice_to },
        )
        quotationAddress = [
          addr.fullName,
          addr.addressLine1,
          addr.postCode,
          getCityName(addr.city, cities || []),
          getCountryName(addr.country, countries || []),
        ]
      } else {
        quotationAddress = [quoteToEmail.invoice_to]
      }

      const generatedQuotePDF = generateQuotePDF({
        title: quoteTitle,
        quotationAddress,
        products: addQuotesTotalColumn(
          quoteToEmail?.sale_quote || [],
        ),
        quoteTopData: {
          'Quotation Date': dateToString(
            new Date(quoteToEmail.created_at),
            'dd/MM/yyyy',
          ),

          'Customer Ref': quoteToEmail?.customer_reference,

          'Customer No.': quoteToEmail.customer.id,

          'Expiry Date': dateToString(
            new Date(quoteToEmail.quote_expire_date),
            'dd/MM/yyyy',
          ),
          'Raised By': getFullName(quoteToEmail.user),
        },
        totals: {
          'Net Amount': formatCurrency(
            excludeVAT(
              Number(
                calculateQuoteValue(
                  quoteToEmail?.sale_quote || [],
                  quoteToEmail?.delivery || 0,
                  'total',
                ),
              ),
            ),
          ),
          'VAT Amount': formatCurrency(
            excludeVAT(
              Number(
                calculateQuoteValue(
                  quoteToEmail?.sale_quote || [],
                  quoteToEmail?.delivery || 0,
                  'vat',
                ),
              ),
            ),
          ),
          'Gross Total': formatCurrency(
            excludeVAT(
              Number(
                calculateQuoteValue(
                  quoteToEmail?.sale_quote || [],
                  quoteToEmail?.delivery || 0,
                  'gross',
                ),
              ),
            ),
          ),
        },
        notes: quoteToEmail?.extra_notes || '',
        storeAddress: [
          capitalize(store.storeAddress),
          getCity(store.city),
          store.postalCode,
          '',
          `Tel No.   ${store.phone}`,
          `Email   ${store.email}`,
        ],
      })

      if (action === 'email') {
        emailPDFAction(
          generatedQuotePDF,
          emailInfo,
          quoteTitle,
        )
          .then(res => {
            if (hasErrorKey(res as any)) {
              toast.error(extractErrorMessage(res as any))
            } else {
              toast.success('Email sent successfully')
            }
          })
          .catch(err => {
            toast.error(extractErrorMessage(err as any))
          })
          .finally(() => closeEmailCustomerModal())
      } else {
        downloadPDFAction(
          generatedQuotePDF,
          quoteTitle.toLowerCase(),
        )
      }
    }
  }

  const emailQuote = (email?: string) => {
    pdfAction('email', email)
  }

  const columns: GridColDef[] = [
    {
      field: 'quote_number',
      headerName: 'QUOTATION',
      width: 140,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography color='primary'>
          <Link
            href={`/quotes/${params.row.id}/view`}
            style={{ fontWeight: 600 }}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      align: 'center',
      headerAlign: 'center',
      type: 'number',
      width: 110,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {formatCurrency(Number(params.value).toFixed(2))}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'CUSTOMER',
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        return getFullName(params.value)
      },
      renderCell: params => (
        <Typography>
          <Link
            href={buildUrl('customers', {
              itemId: params.value?.customer?.id,
            })}
          >
            {params.value}
          </Link>
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'CREATED DATE',
      type: 'string',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      sortable: true,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'quote_expire_date',
      headerName: 'EXPIRY DATE',
      type: 'string',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      sortable: true,
      renderCell: params => (
        <Typography>{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'user',
      headerName: 'USER',
      minWidth: 100,
      flex: 1,
      maxWidth: 150,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {params.value.first_name} {params.value.last_name}
        </Typography>
      ),
    },
    {
      field: 'id',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 130,
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
              color='primary'
              onClick={() =>
                openEmailCustomerModal(params.row)
              }
            >
              <Icon icon='tabler:mail' />
            </IconButton>
            <IconButton
              color='error'
              onClick={() => openDeleteModal(params.row.id)}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const _deleteQuote = () => {
    deleteSingleQuote(deleteModal as number)
      .unwrap()
      .then(() => {
        toast.success('Quote deleted successfully')
      })
      .catch(() => toast.error('An error occurred'))
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Sales Quote', to: '/quotes' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card sx={{}}>
          <AppTable
            isLoading={isLoading || isFetching}
            columns={columns}
            rows={quotes ? quotes.results : []}
            miniColumns={['quote_number', 'total']}
            openMiniModal={openTableDataModal}
            showToolbar
            showSearch={false}
            onPageChange={val => {
              const filter = { ...search }
              filter.page = val
              setSearch(filter)
            }}
            totalRows={quotes?.count}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Can I='create' a='quote'>
                  <Link href='/quotes/new'>
                    <ResponsiveButton
                      label='Create Quote'
                      icon='tabler:plus'
                      mini={isMobileSize}
                    />
                  </Link>
                </Can>
              </Box>
            }
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  placeholder='Search Quotations'
                  value={search.search}
                  onChange={val => {
                    const filter = { ...search }
                    filter.search = val
                    setSearch(filter)
                  }}
                  sx={{ minWidth: '200px' }}
                />
                <DateRangePicker
                  value={dateRange}
                  onChange={val => setDateRange(val)}
                />
                <AppSelect
                  placeholder='Select User'
                  value={search.user}
                  handleChange={e => {
                    const filter = { ...search }
                    filter.user = e.target.value
                    setSearch(filter)
                  }}
                  options={userAccounts?.map(_user => ({
                    label: getFullName(_user),
                    value: _user.id,
                  }))}
                  sx={{ minWidth: '150px' }}
                />
              </Box>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of #${tableData.id}` : ''
        }
        tableData={
          tableData
            ? {
                'ID:': tableData.id,
                'Customer:': tableData.customer.firstName,
                'Total:': formatCurrency(tableData.total),
                'Created Date:': formatDate(
                  tableData.created_at,
                ),
                'Expiry Date:': formatDate(
                  tableData.expiryDate,
                ),

                // 'User:': tableData.user
              }
            : {}
        }
        actionBtns={
          tableData && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                color='primary'
                onClick={() => {
                  openEmailCustomerModal(tableData)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:mail' />
              </IconButton>
              <IconButton
                color='error'
                onClick={() => {
                  openDeleteModal(tableData.id)
                  closeTableDataModal()
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          )
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Quote'
        content={
          'Are you sure you want to delete this quote?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteQuote}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <EmailCustomerModal
        data={{
          email: quoteToEmail.customer?.email || '',
          customerName:
            getFullName(quoteToEmail.customer) || '',
          documentDate: dateToString(
            new Date(quoteToEmail?.created_at || ''),
          ),
          documentId: quoteToEmail?.quote_number || '',
          documentType: 'Quote',
        }}
        onSubmit={({ email }) => emailQuote(email)}
        open={emailCustomerModalStatus()}
        handleClose={closeEmailCustomerModal}
      />
    </>
  )
}

QuotationsList.acl = {
  action: 'read',
  subject: 'quote',
}

export default QuotationsList
