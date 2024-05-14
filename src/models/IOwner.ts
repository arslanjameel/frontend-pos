export interface IOwnerNew {
  name: string
  email: string
  address: string
  postalCode: string
  city: string
}

export interface IOwner extends IOwnerNew {
  id: number
}
