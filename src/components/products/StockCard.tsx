import {
  Box,
  Button,
  Card,
  IconButton,
  Switch,
  Typography,
} from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import AppSelect from '../global/AppSelect'
import { useGetStoresQuery } from 'src/store/apis/accountSlice'
import { Icon } from '@iconify/react'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSearchSupplierQuery } from 'src/store/apis/suppliersSlice'
import {
  IProductPurchase,
  IProductStock,
} from 'src/types/IProducts'
import StockFormModal from './StockFormModal'
import { useModal } from 'src/hooks/useModal'
import AppTable from '../global/AppTable'
import { GridColDef } from '@mui/x-data-grid'
import { formatCurrency } from 'src/utils/formatCurrency'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  cardId?: string
  hideCost: boolean
  setHideCost: Dispatch<SetStateAction<boolean>>
  unitCost: number
  setUnitCost: Dispatch<SetStateAction<number>>
  stocks: IProductStock[]
  setStocks: Dispatch<SetStateAction<IProductStock[]>>
  purchase: IProductPurchase[]
  setPurchase: Dispatch<SetStateAction<IProductPurchase[]>>
}

const StockCard = ({
  cardId = 'inventory',
  hideCost,
  setHideCost,
  unitCost,
  setUnitCost,
  stocks,
  setStocks,
  purchase,
  setPurchase,
}: Props) => {
  const { user } = useAuth()
  const uid = new Date().getTime()
  const { primaryFilled, primaryLight } = UseBgColor()
  const { data: suppliers } = useSearchSupplierQuery('')
  const { data: stores } = useGetStoresQuery()

  const {
    openModal: openAddStockModal,
    closeModal: closeAddStockModal,
    isModalOpen: addStockModalStatus,
  } = useModal<any>()

  const handlePurchaseChange = (
    idToUpdate: number,
    newValue: number,
    ele: string,
  ) => {
    setPurchase(prev =>
      prev.map(item =>
        item.id === idToUpdate
          ? { ...item, [ele]: newValue }
          : item,
      ),
    )
  }

  const handleSupplierName = (id: number) => {
    const supplier = suppliers?.find(
      (supplier: any) => supplier.id === id,
    )

    return supplier?.name || ''
  }

  const handleStoreName = (id: number) => {
    const store = stores?.results.find(
      (store: any) => store.id === id,
    )

    return store?.name
  }

  const columnsAdmin: GridColDef[] = [
    {
      field: 'quantity',
      headerName: 'QTY',
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='QTY'
          type='number'
          value={params.value}
          onChange={val => {
            const updatedStocks = stocks.map(item => {
              if (item.id === params.row.id) {
                return {
                  ...item,
                  quantity: Number(val.target.value),
                }
              } else {
                return item
              }
            })
            setStocks(updatedStocks)
          }}
        />
      ),
    },
    {
      field: 'store',
      headerName: 'STORE',
      minWidth: 140,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {handleStoreName(params.value)}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'SUPPLIER',
      minWidth: 140,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {handleSupplierName(params.value)}
        </Typography>
      ),
    },
    {
      field: 'floor',
      headerName: 'FLOOR',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'section',
      headerName: 'SECTION',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'unit_cost',
      headerName: 'UNIT COST',
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      valueGetter: params => formatCurrency(params.value),
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'action',
      headerName: '',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 40,
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
              color='error'
              onClick={() =>
                setStocks(
                  stocks.filter(
                    item => item.id !== params.row.id,
                  ),
                )
              }
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const columnsManager: GridColDef[] = [
    {
      field: 'quantity',
      headerName: 'QTY',
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <CustomTextField
          fullWidth
          placeholder='QTY'
          type='number'
          value={params.value}
          onChange={val => {
            const updatedStocks = stocks.map(item => {
              if (item.id === params.row.id) {
                return {
                  ...item,
                  quantity: Number(val.target.value),
                }
              } else {
                return item
              }
            })
            setStocks(updatedStocks)
          }}
        />
      ),
    },
    {
      field: 'store',
      headerName: 'STORE',
      minWidth: 140,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {handleStoreName(params.value)}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'SUPPLIER',
      minWidth: 140,
      flex: 1,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>
          {handleSupplierName(params.value)}
        </Typography>
      ),
    },
    {
      field: 'floor',
      headerName: 'FLOOR',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'section',
      headerName: 'SECTION',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'action',
      headerName: '',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      width: 40,
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
              color='error'
              onClick={() =>
                setStocks(
                  stocks.filter(
                    item => item.id !== params.row.id,
                  ),
                )
              }
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <Card
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 3,
          }}
        >
          <Typography
            sx={{ fontWeight: 700, fontSize: 17 }}
            id={cardId}
          >
            Stock
          </Typography>
          <Button
            variant='contained'
            onClick={() => openAddStockModal(1)}
          >
            Add Stock
          </Button>
        </Box>

        <Box
          sx={{
            border: '1px solid #96969655',
            borderBottom: 'none',
          }}
        >
          <AppTable
            columns={
              user?.user_type === 'superadmin'
                ? columnsAdmin
                : (!hideCost &&
                    user?.user_type === 'manager' &&
                    columnsAdmin) ||
                  columnsManager
            }
            rows={stocks}
            showToolbar={false}
            showSearch={false}
            pagination={false}
            noRowsText='No Stock Added'
            showPageSizes={false}
          />
        </Box>

        <Typography
          sx={{ color: '#979797', mt: -2, mb: 2 }}
        >
          Current stock quantity and the location in store
        </Typography>

        <Typography sx={{ fontSize: 13, mb: -2 }}>
          Purchase Order
        </Typography>
        {purchase.map(e => (
          <Box
            key={e.id}
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ width: 80 }}>
              <CustomTextField
                placeholder='QTY'
                type='number'
                onChange={event =>
                  handlePurchaseChange(
                    e.id,
                    Number(event.target.value),
                    'quantity',
                  )
                }
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 80 }}>
              <AppSelect
                options={(suppliers || []).map(
                  (item: any) => ({
                    label: item.name,
                    value: item.id,
                  }),
                )}
                value={e.supplier}
                handleChange={event =>
                  handlePurchaseChange(
                    e.id,
                    Number(event.target.value),
                    'supplier',
                  )
                }
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 80 }}>
              <CustomTextField
                fullWidth
                placeholder='Delivery Date'
                type='date'
                onChange={event =>
                  handlePurchaseChange(
                    e.id,
                    Number(event.target.value),
                    'date',
                  )
                }
              />
            </Box>
            {user?.user_type === 'superadmin' && (
              <Box sx={{ flex: 1, minWidth: 80 }}>
                <CustomTextField
                  fullWidth
                  placeholder='Unit Cost'
                  type='number'
                  inputProps={{
                    step: '0.01',
                  }}
                  onChange={event =>
                    handlePurchaseChange(
                      e.id,
                      Number(event.target.value),
                      'cost',
                    )
                  }
                />
              </Box>
            )}
            {!hideCost && user?.user_type === 'manager' && (
              <Box sx={{ flex: 1, minWidth: 80 }}>
                <CustomTextField
                  fullWidth
                  placeholder='Unit Cost'
                  type='number'
                  inputProps={{
                    step: '0.01',
                  }}
                  onChange={event =>
                    handlePurchaseChange(
                      e.id,
                      Number(event.target.value),
                      'cost',
                    )
                  }
                />
              </Box>
            )}
            <Box>
              <IconButton
                sx={{
                  ...primaryFilled,
                  borderRadius: '9px !important',
                  '&:hover': { ...primaryFilled },
                }}
                color='primary'
                onClick={() =>
                  setPurchase(
                    purchase.filter(
                      item => item.id !== e.id,
                    ),
                  )
                }
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Typography sx={{ color: '#979797', my: -2 }}>
          Stock ordered
        </Typography>
        <Box>
          <IconButton
            sx={{
              ...primaryLight,
              borderRadius: '9px !important',
              '&:hover': { ...primaryFilled },
            }}
            color='primary'
            onClick={() =>
              setPurchase([
                ...purchase,
                {
                  id: uid,
                  quantity: 0,
                  supplier: 0,
                  date: '',
                  cost: 0,
                },
              ])
            }
          >
            <Icon icon='tabler:plus' />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user?.user_type === 'superadmin' && (
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13 }}>
                Hide Product Cost
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Switch
                  checked={hideCost}
                  onChange={e =>
                    setHideCost(e.target.checked)
                  }
                  inputProps={{
                    'aria-label': 'controlled',
                  }}
                />

                <Typography>Yes</Typography>
              </Box>
              <Typography sx={{ color: '#979797', my: -2 }}>
                Hide product costs from anyone who isn't an
                admin
              </Typography>
            </Box>
          )}
          {user?.user_type === 'superadmin' && (
            <Box sx={{ flex: 1 }}>
              <CustomTextField
                label='Default Unit Cost'
                placeholder='Unit Cost'
                type='number'
                inputProps={{
                  step: '0.01',
                }}
                value={unitCost}
                onChange={event => {
                  setUnitCost(Number(event.target.value))
                }}
              />
            </Box>
          )}
          {!hideCost && user?.user_type === 'manager' && (
            <Box sx={{ flex: 1 }}>
              <CustomTextField
                label='Default Unit Cost'
                placeholder='Unit Cost'
                type='number'
                inputProps={{
                  step: '0.01',
                }}
                value={unitCost}
                onChange={event => {
                  setUnitCost(Number(event.target.value))
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
      <StockFormModal
        open={addStockModalStatus()}
        handleClose={closeAddStockModal}
        onSubmit={val => setStocks([...stocks, val])}
      />
    </>
  )
}

export default StockCard
