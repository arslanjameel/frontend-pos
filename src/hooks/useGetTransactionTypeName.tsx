import { ITransactionType } from 'src/models/ITransactionType'

const useGetTransactionTypeName = (
  transactionTypes: ITransactionType[],
) => {
  const getTransactionTypeName = (
    transactionTypeId: number,
  ) => {
    const transactionType = transactionTypes.find(
      tr => tr.id === Number(transactionTypeId),
    )

    return transactionType ? transactionType.type : '--'
  }

  return { getTransactionTypeName }
}

export default useGetTransactionTypeName
