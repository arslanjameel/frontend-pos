import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'
import CustomTag from '../global/CustomTag'
import StoreCard from '../global/StoreCard'
import EditRolesStoresModal from './EditRolesStoresModal'
import { useGetUserTypesQuery } from 'src/store/apis/accountSlice'
import { getRoleName } from 'src/utils/dataUtils'
import { IStore } from 'src/models/IStore'

interface Props {
  userId: number
  role: number
  stores: IStore[]
  isEditable?: boolean
}

const RolesStoresCard = ({
  userId,
  role,
  stores,
  isEditable,
}: Props) => {
  const { data: roles } = useGetUserTypesQuery()

  const [editRoleStoresModal, setEditRoleStoresModal] =
    useState(false)
  const openEditRoleStoresModal = () =>
    setEditRoleStoresModal(true)
  const closeEditRoleStoresModal = () =>
    setEditRoleStoresModal(false)

  return (
    <>
      <Card sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Icon icon='tabler:list-details' />
            Roles and Stores
          </Typography>

          {isEditable && (
            <IconButton onClick={openEditRoleStoresModal}>
              <Icon icon='tabler:dots-vertical' />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            mt: 4,
          }}
        >
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography sx={{ width: 60 }}>Role</Typography>

            <Box sx={{ flex: 1 }}>
              <CustomTag
                label={getRoleName(
                  roles ? roles.results : [],
                  Number(role),
                )}
                color='primary'
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography sx={{ width: 60 }}>
              Stores
            </Typography>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  gap: 3,
                  flexWrap: 'wrap',
                }}
              >
                {stores.map(store => (
                  <StoreCard
                    key={store.id}
                    title={store.name}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
      {isEditable && (
        <EditRolesStoresModal
          userId={userId}
          open={editRoleStoresModal}
          handleClose={closeEditRoleStoresModal}
          defaultValues={{ role, stores }}
        />
      )}
    </>
  )
}

export default RolesStoresCard
