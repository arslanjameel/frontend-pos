import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import AppModal from '../global/AppModal'
import AppTable from '../global/AppTable'
import AppTabs from '../global/AppTabs'
import { IData } from 'src/utils/types'
import { useWindowSize } from 'src/hooks/useWindowSize'
import TableDataModal from '../global/TableDataModal'
import { useModal } from 'src/hooks/useModal'
import { ISaleInvoice } from 'src/models/ISaleInvoice'
import { ICustomer } from 'src/models/ICustomer'
import { formatDate } from 'src/utils/dateUtils'
import { ISaleDeliveryNote } from 'src/models/ISaleDeliveryNote'
import CurrentStoreName from '../global/CurrentStoreName'
import CurrentStoreAddress from '../global/CurrentStoreAddress'
import useGetCityName from 'src/hooks/useGetCityName'
import { generateDeliveryNote } from 'src/utils/pdfs/generateDeliveryNote'
import { useAppSelector } from 'src/store/hooks'
import { downloadPDFAction } from 'src/utils/pdfUtils'
import capitalize from 'src/utils/capitalize'

interface Props {
  open: boolean
  handleClose: () => void
  invoiceInfo?: ISaleInvoice
  customerInfo?: ICustomer
  data?: {
    customerName: string
    customerRef: string
    customerDeliveryAddress: string
    productsInfo: IData[]
    deliveryNote: ISaleDeliveryNote
  }
  print?: () => void
  markAsComplete: (data: any) => void
  isOrder?: boolean
}

const DeliveryNotesModal = ({
  open,
  data,
  customerInfo,
  handleClose,
  markAsComplete,
  isOrder,
}: Props) => {
  const { store } = useAppSelector(state => state.app)

  const { isMobileSize } = useWindowSize()
  const [openedTab, setOpenedTab] = useState(0)

  const { getCity } = useGetCityName()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  // generate PDF
  const printPDF = () => {
    let noteTitle = ''
    const storeName = store.name

    if (openedTab === 0) {
      //delivery note
      noteTitle = 'Delivery Note ' + data?.deliveryNote?.id
    } else {
      noteTitle = 'Picking Note ' + data?.deliveryNote?.id
    }

    const receiptTopData: { [key: string]: any } = {
      'Issue Date': formatDate(
        data?.deliveryNote?.created_at || '',
        'dd/MM/yyyy',
      ),
    }

    if (isOrder) {
      receiptTopData['Order No.'] =
        data?.deliveryNote?.sale_order
    } else {
      receiptTopData['Invoice No.'] =
        data?.deliveryNote?.sale_invoice
    }
    receiptTopData['Customer No.'] = customerInfo?.id

    const deliveryNotePDF = generateDeliveryNote({
      storeName,
      products:
        data?.deliveryNote?.sale_delivery_note_track || [],
      deliveryAddress:
        data?.deliveryNote?.delivery_address.split('\n') ||
        [],

      // deliveryAddress: [
      //   getFullName(customerInfo),
      //   getAddress(
      //     Number(data?.customerDeliveryAddress || 0),
      //   ).addressLine1 || '',
      //   getCity(
      //     getAddress(
      //       Number(data?.customerDeliveryAddress || 0),
      //     ).city,
      //   ) +
      //     ', ' +
      //     getAddress(
      //       Number(data?.customerDeliveryAddress || 0),
      //     ).postCode +
      //     ', ' +
      //     getCountry(
      //       getAddress(
      //         Number(data?.customerDeliveryAddress || 0),
      //       ).country,
      //     ),
      //   customerInfo?.primaryPhone || '',
      //   customerInfo?.email || '',
      // ],
      receiptTopData,
      storeAddress: [
        capitalize(store.storeAddress),
        getCity(store.city),
        store.postalCode,
        '',
        `Tel No.   ${store.phone}`,
        `Email   ${store.email}`,
      ],
      title: noteTitle,
      isPickingNote: openedTab === 1,
    })

    downloadPDFAction(deliveryNotePDF, noteTitle)
  }

  const columns: GridColDef[] = [
    {
      field: 'sku',
      headerName: 'SKU',
      type: 'string',
      minWidth: 100,
      flex: 1,
      maxWidth: 130,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'product_name',
      headerName: 'NAME',
      type: 'string',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'delivered_now',
      headerName: 'QUANTITY',
      type: 'number',
      minWidth: 100,
      headerAlign: 'center',
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
  ]

  const NoteInfo = ({
    title = 'Delivery Note',
  }: {
    title?: string
  }) => (
    <Box id='pdf-content'>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: 5,
          justifyContent: 'space-between',
          px: isMobileSize ? 2 : 4,
        }}
      >
        <Box sx={{ maxWidth: 230 }}>
          <CurrentStoreName />
          <CurrentStoreAddress />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 300,
          }}
        >
          <Typography variant='h3'>
            {title} {data?.deliveryNote?.id || '--'}
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Date Issued:
            </Typography>
            <Typography fontWeight={600}>
              {formatDate(
                data?.deliveryNote?.created_at || '',
                'dd/MM/yyyy',
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Time:
            </Typography>
            <Typography fontWeight={600}>
              {formatDate(
                data?.deliveryNote?.created_at || '',
                'HH:mm',
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Customer No:
            </Typography>
            <Typography fontWeight={600}>
              {customerInfo?.id || '--'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: 110 }}>
              Customer Ref:
            </Typography>
            <Typography fontWeight={600}>
              {data?.deliveryNote?.customer_ref || '--'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 2,
          rowGap: 3,
          mt: 5,
          px: isMobileSize ? 2 : 5,
        }}
      >
        <Box>
          <Typography variant='h5' marginBottom={2}>
            Delivery Note To
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography>
              {data?.deliveryNote?.customer_name || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            gap: 1,
            maxWidth: 300,
          }}
        >
          <Typography variant='h5'>
            Delivery Address:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography>
              {data?.deliveryNote?.delivery_address ||
                'No Address Added'}
              {/* {getFullName(customerInfo)} */}
            </Typography>
            {/* <Typography>
              {
                getAddress(
                  Number(
                    data?.customerDeliveryAddress || 0,
                  ),
                ).addressLine1
              }
            </Typography>
            <Typography>
              {getCity(
                getAddress(
                  Number(
                    data?.customerDeliveryAddress || 0,
                  ),
                ).city,
              )}
              {', '}
              {
                getAddress(
                  Number(
                    data?.customerDeliveryAddress || 0,
                  ),
                ).postCode
              }
              {', '}
              {getCountry(
                getAddress(
                  Number(
                    data?.customerDeliveryAddress || 0,
                  ),
                ).country,
              )}
            </Typography>
            <Typography>
              {customerInfo?.primaryPhone || '--'}
            </Typography>
            <Typography>
              {customerInfo?.email || '--'}
            </Typography> */}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          border: '1px solid #ddd',
          mt: 6,
          my: 3,
          px: isMobileSize ? 0 : 5,
        }}
      >
        <AppTable
          columns={columns}
          rows={
            data?.deliveryNote?.sale_delivery_note_track ||
            []
          }
          miniColumns={['sku']}
          openMiniModal={openTableDataModal}
          showToolbar={false}
          showSearch={false}
          showPageSizes={false}
          pagination={false}
        />
      </Box>
    </Box>
  )

  return (
    <>
      <AppModal
        maxWidth={800}
        open={open}
        handleClose={handleClose}
        sx={{ px: isMobileSize ? 2 : 7 }}
      >
        {isMobileSize && (
          <Box
            sx={{
              pb: 4,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant='contained'
              onClick={() => {
                printPDF()
              }}
            >
              Print
            </Button>
            <Button
              variant='contained'
              onClick={() => markAsComplete(data)}
            >
              Mark as Complete
            </Button>
          </Box>
        )}
        <AppTabs
          legacy
          openedTab={openedTab}
          changeTab={tabId => setOpenedTab(tabId)}
          tabs={[
            {
              id: 0,
              title: 'Delivery Notes',
              content: <NoteInfo />,
            },
            {
              id: 1,
              title: 'Picking Note',
              content: <NoteInfo title='Picking Note' />,
            },
          ]}
          customBtns={
            <Box
              sx={{
                display: isMobileSize ? 'none' : 'flex',
                pb: 1,
                width: '100%',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                variant='contained'
                onClick={() => {
                  printPDF()
                }}
              >
                Print
              </Button>
              <Button
                variant='contained'
                onClick={() => markAsComplete(data)}
              >
                Mark as Complete
              </Button>
            </Box>
          }
          bottomContainerSx={{ height: '100%', mt: 3 }}
        />
      </AppModal>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.sku}` : ''
        }
        tableData={
          tableData
            ? {
                'Name:': tableData.product_name,
                'SKU:': tableData.sku,
                'Quantity:': tableData.quantity_sold,
              }
            : {}
        }
      />
    </>
  )
}

export default DeliveryNotesModal
