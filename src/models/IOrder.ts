export const DeliveryStatus = {
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  PARTIAL: 'partial',
  RETURNED: 'returned',

  VOID: 'void', //!REMOVE THIS
} as const

export type IDeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus]

export const OrderStatus = {
  CLEARED: 'cleared',
  PAID: 'paid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  VOID: 'void',
} as const

export type IOrderStatus =
  (typeof OrderStatus)[keyof typeof OrderStatus]

export const ProductDeliveryStatus = {
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  PARTIAL: 'partial',
  VOID: 'void',
} as const

export type IProductDeliveryStatus =
  (typeof ProductDeliveryStatus)[keyof typeof ProductDeliveryStatus]
