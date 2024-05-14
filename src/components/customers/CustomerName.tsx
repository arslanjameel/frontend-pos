import { useGetSingleCustomerQuery } from 'src/store/apis/customersSlice'

interface Props {
  customerId: number
}

const CustomerName = ({ customerId }: Props) => {
  const { data, isLoading } =
    useGetSingleCustomerQuery(customerId)
  console.log(data)
  if (isLoading || !data) return '--'

  return data ? 'w' : '--'
}

export default CustomerName
