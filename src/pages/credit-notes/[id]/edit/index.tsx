import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import CreditNotesForm from 'src/components/credit-notes/CreditNoteForm'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { updateCreditNote } from 'src/store/reducers/creditNotesSlice'
import { isIdValid } from 'src/utils/routerUtils'
import { IData } from 'src/utils/types'

const EditCreditNotePage = () => {
  const router = useRouter()
  const id = isIdValid(router.query.id)

  const creditNoteData = useAppSelector(state =>
    state.creditNotes.creditNotes.find(
      creditNote => creditNote.id === id,
    ),
  )

  const dispatch = useAppDispatch()

  const handleSubmit = (values: IData) => {
    toast.success('Credit Note updated successfully')

    //@ts-ignore //TODO: update this
    dispatch(updateCreditNote({ ...values }))
    router.replace('/credit-notes')
  }

  return (
    <CreditNotesForm
      defaultValues={creditNoteData}
      onSubmit={handleSubmit}
    />
  )
}

export default EditCreditNotePage
