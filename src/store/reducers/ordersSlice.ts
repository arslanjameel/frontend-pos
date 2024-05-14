import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  IOrder,
  fakeSalesOrders,
} from 'src/@fake-db/orders'

interface InitialState {
  orders: IOrder[]
  managerApprovalModal: boolean
  managerAppovalInfo: any
  productsToInvoice: any[]
}

const initialState: InitialState = {
  orders: [...fakeSalesOrders],

  productsToInvoice: [
    {
      id: 12,
      sku: 'WDIJED',
      name: 'WASTE DISPOSAL UNIT',
      deliveryStatus: 1,
      productStatus: 1,
      quantity: 120,
      total: 10,
      delivered: 1,
      deliverNow: 1,
    },
    {
      id: 122,
      sku: '23IWO',
      name: 'Zonda Lin FLange Membrane 600',
      deliveryStatus: 0,
      productStatus: 0,
      quantity: 210,
      total: 10,
      delivered: 1,
      deliverNow: 1,
    },
    {
      id: 22,
      sku: 'W232JED',
      name: 'Zentum C/C Fully BTW Pan',
      deliveryStatus: 2,
      productStatus: 2,
      quantity: 100,
      total: 10,
      delivered: 1,
      deliverNow: 1,
    },
  ],

  managerApprovalModal: false,
  managerAppovalInfo: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<IOrder>) => {
      return {
        ...state,
        orders: [...state.orders, action.payload],
      }
    },
    updateOrder: (state, action: PayloadAction<IOrder>) => {
      return {
        ...state,
        orders: state.orders.map(invoice =>
          invoice.id === action.payload.id
            ? action.payload
            : invoice,
        ),
      }
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        orders: state.orders.filter(
          product => product.id !== action.payload,
        ),
      }
    },

    /**
     * Manager Approval Modal
     *
     */
    openManagerApprovalModal: (
      state,
      action: PayloadAction<any>,
    ) => {
      return {
        ...state,
        managerApprovalModal: true,
        managerAppovalInfo: action.payload,
      }
    },
    closeManagerApprovalModal: state => {
      return {
        ...state,
        managerApprovalModal: false,
        managerAppovalInfo: null,
      }
    },
  },
})

export const {
  createOrder,
  updateOrder,
  deleteOrder,
  openManagerApprovalModal,
  closeManagerApprovalModal,
} = ordersSlice.actions
export default ordersSlice.reducer
