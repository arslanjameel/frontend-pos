export interface IUser {
  id?: number
  last_name: string
  first_name: string
  address: string
  role?: string
  status?: number
  country: number
  joinedOn?: string
  img?: string

  password?: string
  email?: string
  city?: string
  postCode?: string
  mobile?: string
}

export const fakeUsers: IUser[] = [
  {
    id: 1,
    last_name: 'Snow',
    first_name: 'Jon',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 2,
    last_name: 'Lannister',
    first_name: 'Cersei',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 3,
    last_name: 'Lannister',
    first_name: 'Jaime',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 1,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 4,
    last_name: 'Stark',
    first_name: 'Arya',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 5,
    last_name: 'Targaryen',
    first_name: 'Daenerys',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 6,
    last_name: 'Melisandre',
    first_name: '',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 7,
    last_name: 'Clifford',
    first_name: 'Ferrara',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 8,
    last_name: 'Frances',
    first_name: 'Rossini',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
  {
    id: 9,
    last_name: 'Roxie',
    first_name: 'Harvey',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
    img: 'add-img-link',
  },
]

export const getUserById = (id: number) => {
  const user = fakeUsers.find(u => u.id === id)
  if (user) {
    return {
      ...user,
      name: user.first_name + ' ' + user.last_name,
    }
  }

  return {
    id: 9,
    last_name: 'Roxie',
    first_name: 'Harvey',
    name: 'Roxie Harvey',
    mobile: '071235456789',
    address: 'Lake Chelsie, Utah, United States',
    role: 'Administrator',
    status: 0,
    country: 1,
    joinedOn: 'April 2021',
  }
}
