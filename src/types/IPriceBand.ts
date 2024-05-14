export const PriceBand = {
  A: 'A',
  B: 'B',
  C: 'C',
} as const

export type IPriceBand =
  (typeof PriceBand)[keyof typeof PriceBand]

export const priceBands: IPriceBand[] = ['A', 'B', 'C']
