import { useGetBusinessBankAccountsQuery } from 'src/store/apis/accountSlice'
import { BUSINESS_ID } from 'src/utils/globalConstants'

interface Props {
  bank_account: number
}

const AccountNumber = ({ bank_account }: Props) => {
  const { data, isLoading } =
    useGetBusinessBankAccountsQuery(BUSINESS_ID)
  if (isLoading || !data) return '--'

  if (data?.count > 0) {
    return (data?.results || []).find(
      account => account.id === bank_account,
    )?.accountNumber
  }

  return '--'
}

export default AccountNumber
