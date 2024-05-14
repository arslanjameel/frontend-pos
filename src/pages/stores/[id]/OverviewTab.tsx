import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import StoreFormInputs from 'src/components/stores/StoreFormInputs'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import { IUpdateStore } from 'src/models/IStore'
import {
  useDeleteStoreMutation,
  useGetSingleStoreQuery,
  useUpdateStoreMutation,
} from 'src/store/apis/accountSlice'
import Error404 from 'src/pages/404'
import FallbackSpinner from 'src/@core/components/spinner'
import {
  IsResourceNotFound,
  getCustomNotFoundError,
} from 'src/utils/apiUtils'
import { IData } from 'src/utils/types'
import { isIdValid } from 'src/utils/routerUtils'

const OverviewTab = () => {
  const router = useRouter()
  const id = router.query.id

  const storeId = isIdValid(id)

  const {
    data: storeInfo,
    isLoading: isQueryLoading,
    isError,
  } = useGetSingleStoreQuery(storeId)

  const [deleteStore] = useDeleteStoreMutation()
  const [updateStore] = useUpdateStoreMutation()

  const [deleteModal, setDeleteModal] = useState<
    number | false
  >(false)
  const openDeleteModal = (id: number) => setDeleteModal(id)
  const closeDeleteModal = () => setDeleteModal(false)

  const { isWindowBelow } = useWindowSize()

  const _updateStore = (values: IUpdateStore) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { storeLogo, ...body } = values

    updateStore({ id: Number(storeId), body })
      .unwrap()
      .then(() => {
        toast.success('Store updated successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  const _deleteStore = () => {
    deleteStore(Number(storeId))
      .unwrap()
      .then(() => {
        router.replace('/stores')
        toast.success('Store deleted successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError('store')
  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isQueryLoading) return <FallbackSpinner brief />
  if (isError || (isQueryLoading && storeId === -1))
    return <CustomError404 />

  return IsResourceNotFound(storeInfo as IData) ? (
    <CustomError404 />
  ) : (
    <Box sx={{ p: 5 }}>
      <StoreFormInputs
        defaultValues={storeInfo}
        onSubmit={_updateStore}
        actionBtns={
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button variant='contained' type='submit'>
              {isWindowBelow(400) ? (
                <Icon icon='tabler:device-floppy' />
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              variant='tonal'
              color='error'
              onClick={() =>
                openDeleteModal(Number(storeId))
              }
            >
              {isWindowBelow(400) ? (
                <Icon icon='tabler:trash' />
              ) : (
                ' Delete Store'
              )}
            </Button>
          </Box>
        }
      />

      <ConfirmationModal
        open={typeof deleteModal === 'number'}
        handleClose={closeDeleteModal}
        title='Delete Store'
        content='Are you sure you want to delete this store?'
        confirmTitle='Delete'
        onConfirm={_deleteStore}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </Box>
  )
}

export default OverviewTab
