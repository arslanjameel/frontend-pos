import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import AddRoleModal from './AddRoleModal'
import { IUserType } from 'src/models/IUser'
import capitalize from 'src/utils/capitalize'
import { getInitials } from 'src/@core/utils/get-initials'
import useClipboard from 'src/@core/hooks/useClipboard'
import toast from 'react-hot-toast'

interface Props {
  role: IUserType
}

const RoleCard = ({ role }: Props) => {
  const { primaryLight } = UseBgColor()
  const [editRoleModal, setEditRoleModal] = useState(false)
  const openEditRoleModal = () => setEditRoleModal(true)
  const closeEditRoleModal = () => setEditRoleModal(false)

  const copy = useClipboard()

  const copyToClipboard = () => {
    copy.copy(role.type)
    toast.success('Role copied to clipboard')
  }

  const users = ['Test User', 'Lorenz Cain']

  return (
    <>
      <Card sx={{ p: 3, px: 5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>
            Total {users.length} users
          </Typography>
          <AvatarGroup max={3}>
            {users.map(user => (
              <Avatar key={user}>
                {getInitials(user)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: 17 }}
            >
              {capitalize(role.type)}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: primaryLight.color,
                cursor: 'pointer',
              }}
              onClick={openEditRoleModal}
            >
              Edit Role
            </Typography>
          </Box>

          <Icon
            icon='tabler:copy'
            style={{ cursor: 'pointer' }}
            onClick={copyToClipboard}
          />
        </Box>
      </Card>

      <AddRoleModal
        isEdit
        open={editRoleModal}
        handleClose={closeEditRoleModal}
        onSubmit={values => console.log(values)}
      />
    </>
  )
}

export default RoleCard
