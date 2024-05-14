import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Typography,
  capitalize,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Image from 'next/image'
import toast from 'react-hot-toast'

import AppModal from '../global/AppModal'
import UseBgColor from 'src/@core/hooks/useBgColor'
import {
  useGetSingleUserQuery,
  useGetStoresQuery,
  useGetUserTypesQuery,
  useUpdateUserPartialMutation,
} from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import { IStore } from 'src/models/IStore'
import AppSelect from '../global/AppSelect'

interface Props {
  userId: number
  open: boolean
  defaultValues: { role: number; stores: IStore[] }
  handleClose: () => void
}

const EditRolesStoresModal = ({
  userId,
  open,
  defaultValues,
  handleClose,
}: Props) => {
  const { data: userData } = useGetSingleUserQuery(userId)
  const { data: roles } = useGetUserTypesQuery()
  const { data: stores, isLoading: isStoresLoading } =
    useGetStoresQuery()
  const [updateUserPartial, { isLoading }] =
    useUpdateUserPartialMutation()

  const [selectedStores, setSelectedStores] = useState<
    number[]
  >(defaultValues.stores.map(s => s.id))

  const { primaryLight } = UseBgColor()
  const schema = yup.object().shape({
    role: yup.number().required(),
    stores: yup.array().required(),
  })

  const { watch, setValue, handleSubmit } = useForm({
    values: {
      role: defaultValues.role,
      stores: defaultValues.stores.map(s => s.id),
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const _updateUserInfo = (values: {
    role: number
    stores: number[]
  }) => {
    const _userInfo = userData
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        {
          working_hours: userData.working_hours.map(
            ({ ...obj }) => obj,
          ),
        }
      : {}
    updateUserPartial({
      id: userId,
      body: {
        ..._userInfo,
        user_type: values.role,
        stores: values.stores,
      },
    })
      .unwrap()
      .then(() =>
        toast.success('User details updated successfully'),
      )
      .catch(() => toast.error('An error occured'))
      .finally(() => handleClose())
  }

  useEffect(() => {
    setSelectedStores(defaultValues.stores.map(s => s.id))
  }, [defaultValues])

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={550}
    >
      <form onSubmit={handleSubmit(_updateUserInfo)}>
        <Typography
          id='modal-modal-title'
          sx={{ mb: 5, fontSize: 18, fontWeight: 700 }}
        >
          Edit Roles and Stores
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <AppSelect
            value={watch('role')}
            options={
              roles
                ? roles.results.map((r: any) => ({
                    label: capitalize(r.type),
                    value: r.id,
                  }))
                : []
            }
            handleChange={e =>
              setValue('role', e.target.value)
            }
          />

          <Box>
            <Typography>Stores</Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(150px, 1fr))',
                gridAutoRows: 100,
              }}
            >
              {isStoresLoading ? (
                <FallbackSpinner brief />
              ) : (
                (stores ? stores.results : []).map(
                  (store: any) => (
                    <Card
                      key={store.id}
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderWidth: 1.5,
                        borderStyle: 'dashed',
                        borderColor:
                          selectedStores.includes(store.id)
                            ? primaryLight.color
                            : '#c8c8c860',
                        backgroundColor:
                          selectedStores.includes(store.id)
                            ? primaryLight.backgroundColor
                            : 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        px: 3,
                      }}
                      onClick={() => {
                        let _temp = [...selectedStores]
                        if (!_temp.includes(store.id)) {
                          _temp.push(store.id)
                        } else {
                          _temp = _temp.filter(
                            _t => _t !== store.id,
                          )
                        }
                        setSelectedStores(_temp)
                        setValue('stores', _temp)
                      }}
                    >
                      <Image
                        src='/images/store.png'
                        alt='purple-store'
                        width={36}
                        height={36}
                      />
                      <Typography
                        fontWeight={600}
                        textAlign='center'
                      >
                        {store.name}
                      </Typography>
                    </Card>
                  ),
                )
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            type='submit'
            disabled={isLoading}
          >
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default EditRolesStoresModal
