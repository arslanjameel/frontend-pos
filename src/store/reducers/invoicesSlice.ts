import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  IInvoice,
  fakeSalesInvoices,
} from 'src/@fake-db/invoices'

interface InitialState {
  invoices: IInvoice[]
  managerApprovalModal: boolean
  managerAppovalInfo: any
  productsToInvoice: any[]
}

const initialState: InitialState = {
  invoices: [...fakeSalesInvoices],

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

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    createInvoice: (
      state,
      action: PayloadAction<IInvoice>,
    ) => {
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      }
    },
    updateInvoice: (
      state,
      action: PayloadAction<IInvoice>,
    ) => {
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id
            ? action.payload
            : invoice,
        ),
      }
    },
    deleteInvoice: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        invoices: state.invoices.filter(
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
  createInvoice,
  updateInvoice,
  deleteInvoice,
  openManagerApprovalModal,
  closeManagerApprovalModal,
} = invoicesSlice.actions
export default invoicesSlice.reducer
