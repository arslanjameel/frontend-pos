import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import QuoteForm from 'src/components/quotes/QuoteForm'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { updateQuote } from 'src/store/reducers/quotesSlice'
import { isIdValid } from 'src/utils/routerUtils'
import { IData } from 'src/utils/types'

const EditQuotePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const quoteData = useAppSelector(state =>
    state.quotes.quotes.find(quote => quote.id === id),
  )

  const dispatch = useAppDispatch()

  const handleSubmit = (values: IData) => {
    toast.success('Quote updated successfully')

    //@ts-ignore //TODO: update this
    dispatch(updateQuote({ ...values }))
    router.replace('/quotes')
  }

  return (
    <QuoteForm
      defaultValues={quoteData as any}
      onSubmit={handleSubmit}
    />
  )
}

EditQuotePage.acl = {
  action: 'update',
  subject: 'quote',
}

export default EditQuotePage
