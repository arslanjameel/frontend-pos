import { IAddress } from 'src/utils/types'

const fakeAddresses: IAddress[] = [
  {
    id: 1,
    title: 'Work',
    fullName: 'Mr. Bean',
    addressName:
      '101 Kings Street, Bronx Beach LE45 4GH Australia',
    addressLine: '101 Kings Street Bronx',
    postCode: 'GG32 4GH',
    city: 'Beach',
    country: 1,
    isDefaultShipping: true,
    isDefaultBilling: false,
    customerId: 1,
  },
  {
    id: 2,
    title: 'Home',
    fullName: 'Sir. Julian',
    addressName:
      '101 Colin Street, Bronx Melbource LE45 4GH Australia',
    addressLine: '101 Colin Street Bronx',
    postCode: 'LE45 4GH',
    city: 'Melbource',
    country: 1,
    isDefaultShipping: false,
    isDefaultBilling: true,
    customerId: 1,
  },
  {
    id: 3,
    title: 'Home',
    fullName:
      '101 Kings Street, Bronx Beach LE45 4GH Australia',
    addressName:
      '101 Kings Street, Bronx Beach LE45 4GH Australia',
    addressLine: '101 Kings Street Bronx',
    postCode: 'GG32 4GH',
    city: 'Beach',
    country: 1,
    isDefaultShipping: true,
    isDefaultBilling: false,
    customerId: 2,
  },
  {
    id: 4,
    title: 'Work',
    fullName:
      '101 Colin Street, Bronx Melbource LE45 4GH Australia',
    addressName:
      '101 Colin Street, Bronx Melbource LE45 4GH Australia',
    addressLine: '101 Colin Street Bronx',
    postCode: 'LE45 4GH',
    city: 'Melbource',
    country: 1,
    isDefaultShipping: false,
    isDefaultBilling: true,
    customerId: 2,
  },
]

export default fakeAddresses
