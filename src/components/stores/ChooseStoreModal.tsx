import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'

import Icon from 'src/@core/components/icon'
import AppModal from '../global/AppModal'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import {
  closeStoreModal,
  selectStore,
  activeStore,
} from 'src/store/reducers/appSlice'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useGetUserStoresQuery } from 'src/store/apis/accountSlice'
import { useAuth } from 'src/hooks/useAuth'
import useStorage from 'src/hooks/useStorage'
import FallbackSpinner from 'src/@core/components/spinner'
import { isStoreSelected } from 'src/utils/storeUtils'

const ChooseStoreModal = () => {
  const { user } = useAuth()
  const { getStorageItem, setLocalStorageItem } =
    useStorage()

  const { primaryLight } = UseBgColor()

  const dispatch = useAppDispatch()
  const { storeModal, store } = useAppSelector(
    state => state.app,
  )

  const { data: stores, isLoading } = useGetUserStoresQuery(
    user?.id || 0,
  )

  useEffect(() => {
    if (!isStoreSelected(store)) {
      const _storeId = getStorageItem('activeStore')
      const _store = getStorageItem('store')

      if (_store) dispatch(activeStore(JSON.parse(_store)))
      if (_storeId) dispatch(selectStore(Number(_storeId)))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') {
      dispatch(closeStoreModal())
    }
  }

  return (
    <AppModal
      maxWidth={500}
      open={storeModal}
      handleClose={handleClose as any}
      closeBtn={false}
    >
      <Typography
        id='modal-title'
        variant='h4'
        sx={{ textAlign: 'center', fontWeight: 600 }}
      >
        Select Store
      </Typography>

      <Typography
        id='modal-description'
        variant='body1'
        sx={{ mt: 2, textAlign: 'center' }}
      >
        Select the store you would like to use
      </Typography>

      {isLoading ? (
        <FallbackSpinner brief />
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
            mt: 5,
          }}
        >
          {(stores ? stores.results : []).map(
            (_store: any) => (
              <Box
                onClick={() => {
                  dispatch(selectStore(_store.id))
                  dispatch(activeStore(_store))
                  setLocalStorageItem(
                    'store',
                    JSON.stringify(_store),
                  )
                  setLocalStorageItem(
                    'activeStore',
                    _store.id.toString(),
                  )
                }}
                key={_store.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  border: `1.4px solid ${
                    isStoreSelected(store)
                      ? _store.id === store.id
                        ? primaryLight.color
                        : '#ccc'
                      : '#ccc'
                  } `,
                  width: 140,
                  height: 110,
                  padding: 2,
                  borderRadius: 1,
                  cursor: 'pointer',
                  background: isStoreSelected(store)
                    ? _store.id === store.id
                      ? primaryLight.backgroundColor
                      : ''
                    : '',

                  color: isStoreSelected(store)
                    ? _store.id === store.id
                      ? primaryLight.color
                      : ''
                    : '',

                  '&:hover': {
                    border: `1.4px solid ${primaryLight.backgroundColor}`,
                  },
                }}
              >
                <Icon
                  fontSize={40}
                  icon={
                    isStoreSelected(store) &&
                    _store.id === store?.id
                      ? 'tabler:home'
                      : 'tabler:building-community'
                  }
                  color={
                    isStoreSelected(store) &&
                    _store.id === store?.id
                      ? primaryLight.color
                      : 'rgba(75, 70, 92, 1)'
                  }
                />
                <Typography
                  variant='h6'
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: 'center',
                    color:
                      isStoreSelected(store) &&
                      _store.id === store?.id
                        ? primaryLight.color
                        : 'inherit',
                  }}
                >
                  {_store.name}
                </Typography>
              </Box>
            ),
          )}

          {(stores ? stores.results : []).length === 0 && (
            <Typography>
              You have don't have access to any stores
            </Typography>
          )}
        </Box>
      )}
    </AppModal>
  )
}

export default ChooseStoreModal
