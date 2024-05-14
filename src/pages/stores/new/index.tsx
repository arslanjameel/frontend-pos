import { Box, Card, Button } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'

import StoreFormInputs from 'src/components/stores/StoreFormInputs'
import PageContainer from 'src/components/global/PageContainer'
import { IStoreNew } from 'src/models/IStore'
import { useCreateStoreMutation } from 'src/store/apis/accountSlice'

const NewStore = () => {
  const [createStore, { isLoading }] =
    useCreateStoreMutation()

  const router = useRouter()

  const handleSubmit = (values: IStoreNew) => {
    createStore(values)
      .unwrap()
      .then(() => {
        toast.success('Store created successfully')

        router.replace('/stores')
      })
      .catch(() => toast.error('An error occured'))
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Stores', to: '/stores' },
          { label: 'Add', to: '#' },
        ]}
      >
        <Card sx={{ p: 4 }}>
          <StoreFormInputs
            onSubmit={handleSubmit}
            actionBtns={
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={isLoading}
                >
                  Create Store
                </Button>
                <Link href={'/stores'}>
                  <Button
                    variant='contained'
                    color='secondary'
                  >
                    Cancel
                  </Button>
                </Link>
              </Box>
            }
          />
        </Card>
      </PageContainer>
    </>
  )
}

NewStore.acl = {
  action: 'create',
  subject: 'store',
}

export default NewStore
