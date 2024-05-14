import { IProductStatus } from 'src/types/IProducts'

export interface IProduct {
  id?: number
  sku: string
  alternateSku?: string
  productName: string
  productDescriptions: string
  barcode: string
  deleted: 0 | 1
  image: string
  isActive: 0 | 1
  createdAt: string
  productURL: string

  /***
   * ProductPrice
   *
   */
  unitPrice?: number
  priceA: number
  priceB: number
  priceC: number

  /**
   * Stock
   */
  quantity: number
  pending: number

  productStatus: IProductStatus
}

export interface IVariation {
  id: number
  isSameProduct: boolean
  productSku: string
  productDescription: string
}

export const fakeProducts: IProduct[] = [
  {
    id: 1,
    sku: 'SUHGSS',
    productName: 'Zonda Lin Flanage Membrane 600',
    productDescriptions: 'Some description',
    barcode: '237672332',
    deleted: 0,
    image: '/image-url',
    isActive: 1,
    createdAt: 'Jun 20, 2023',
    productURL: '/some-url',
    unitPrice: 20,
    priceA: 22.32,
    priceB: 22.32,
    priceC: 22.32,

    quantity: 219,
    pending: 219,

    productStatus: 1,
  },
  {
    id: 2,
    sku: 'SUHGF GSS',
    productName: 'Lin Flanage Membrane 600',
    productDescriptions: 'Some description',
    barcode: '237672332',
    deleted: 0,
    image: '/image-url',
    isActive: 1,
    createdAt: 'Jun 20, 2023',
    productURL: '/some-url',
    unitPrice: 20,
    priceA: 22.32,
    priceB: 22.32,
    priceC: 22.32,

    quantity: 219,
    pending: 219,

    productStatus: 0,
  },
]

export interface IRawProduct {
  id: number
  tempId: string
  sku: string
  productName: string
  brand: string
  price: number
  cost: number
  createdAt: string
  user: string

  productStatus?: IProductStatus
  unitPrice?: number
  priceA?: number
  quantity?: number
}

export const fakeRawProducts: IRawProduct[] = [
  {
    id: 102,
    tempId: 'TRBH',
    sku: 'JHSGHSG',
    productName: 'Zonda Lin',
    brand: 'Apple',
    unitPrice: 102,
    price: 102,
    cost: 102,
    createdAt: '5 Sep 23',
    user: 'John Doe',
    productStatus: 1,
  },
]
