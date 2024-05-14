import React from 'react'

import CustomTag from '../global/CustomTag'
import { IUserStatus, UserStatus } from 'src/models/IUser'
import { Box } from '@mui/material'

interface Props {
  status: IUserStatus
  onClick?: () => void
}

const UserStatusTag = ({ status, onClick }: Props) => {
  let color: 'error' | 'success' | 'warning' | 'secondary' =
    'secondary'

  switch (status) {
    case UserStatus.Inactive:
      color = 'error'
      break
    case UserStatus.Active:
      color = 'success'
      break
    case UserStatus.Pending:
      color = 'warning'
      break

    default:
      color = 'secondary'
      break
  }

  return (
    <Box
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'auto',
      }}
    >
      <CustomTag
        sx={{ fontSize: 13 }}
        size='small'
        color={color}
        label={status ? status : '--'}
      />
    </Box>
  )
}

export default UserStatusTag
