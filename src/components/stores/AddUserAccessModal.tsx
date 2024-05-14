import { Box, Button, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'

import AppTableUserCard from '../global/AppTableUserCard'
import Icon from 'src/@core/components/icon'
import AppModal from '../global/AppModal'
import { getFullName } from 'src/utils/dataUtils'
import {
  useGetSingleStoreUsersQuery,
  useGetUsersQuery,
} from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import UsersDropdown from '../global/Dropdowns/UsersDropdown'

interface Props {
  usersWithAccess: number[]
  open: boolean
  storeId: number
  handleClose: () => void
  addUserAccess: (userId: number) => void
  deleteUserAccess: (userId: number) => void
}

const AddUserAccessModal = ({
  usersWithAccess = [],
  open,
  storeId,
  handleClose,
  addUserAccess,
  deleteUserAccess,
}: Props) => {
  const userPickerRef = useRef()
  const [search, setSearch] = useState('')

  const { isLoading, data: userList } = useGetUsersQuery({
    page: 1,
  })
  const {
    data: storeUsers,
    isLoading: isCurrAccessLoading,
  } = useGetSingleStoreUsersQuery(storeId)

  const handleAddUserAccess = (id: number) => {
    // @ts-ignore
    userPickerRef?.current?.blur()
    addUserAccess(id)
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography
        id='modal-modal-title'
        variant='h6'
        component='h2'
        sx={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Select User
      </Typography>
      <Typography
        id='modal-modal-description'
        sx={{ mt: 2, textAlign: 'center' }}
      >
        Select a user to add to this store
      </Typography>

      <UsersDropdown
        searchInputRef={userPickerRef}
        options={(userList?.results || []).filter(
          user => !usersWithAccess.includes(user.id),
        )}
        search={search}
        onSearch={setSearch}
        onSelect={handleAddUserAccess}
      />

      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: 230,
          overflow: 'auto',
        }}
      >
        {isLoading || isCurrAccessLoading ? (
          <FallbackSpinner brief />
        ) : (
          (storeUsers ? storeUsers.results : []).map(
            (user: any) => (
              <AppTableUserCard
                key={user.id}
                name={getFullName(user)}
                email={user.email || ''}
                img={'/images/avatars/person1.png'}
                actionBtns={
                  <Button
                    onClick={() => {
                      deleteUserAccess(user.id)
                    }}
                  >
                    <Icon icon='tabler:x' />
                  </Button>
                }
              />
            ),
          )
        )}
      </Box>
    </AppModal>
  )
}

export default AddUserAccessModal
