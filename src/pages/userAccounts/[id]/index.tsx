import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import {
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetUserStoresQuery,
  useUpdateUserPartialMutation,
} from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import Error404 from 'src/pages/404'
import {
  IsResourceNotFound,
  getCustomNotFoundError,
} from 'src/utils/apiUtils'
import UpdateWeekWorkHoursModal from 'src/components/userAccounts/UpdateWeekWorkHoursModal'
import RolesStoresCard from 'src/components/userAccounts/RolesStoresCard'
import UserInfo from 'src/components/userAccounts/UserInfo'
import WeekWorkHours from 'src/components/userAccounts/WeekWorkHours'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { isIdValid } from 'src/utils/routerUtils'
import { buildUrl } from 'src/utils/routeUtils'
import { getFullName } from 'src/utils/dataUtils'
import UserInfoCard from 'src/components/userAccounts/UserInfoCard'

const EditUser = () => {
  const { primaryFilled } = UseBgColor()

  const [deleteUser] = useDeleteUserMutation()
  const [deleteModal, setDeleteModal] = useState<
    number | false
  >(false)
  const openDeleteModal = (id: number) => setDeleteModal(id)
  const closeDeleteModal = () => setDeleteModal(false)

  const router = useRouter()
  const id = router.query.id
  const userId = isIdValid(id)

  const {
    isLoading,
    data: userData,
    isError,
  } = useGetSingleUserQuery(Number(userId))
  const { data: userStores } = useGetUserStoresQuery(userId)

  const [editWorkWeekHrsModal, setEditWorkWeekHrsModal] =
    useState(false)
  const openEditWorkWeekHrsModal = () =>
    setEditWorkWeekHrsModal(true)
  const closeEditWorkWeekHrsModal = () =>
    setEditWorkWeekHrsModal(false)

  const { isMobileSize, isWindowBelow } = useWindowSize()

  const [updateUser] = useUpdateUserPartialMutation()

  // const updateStatus = (newStatus: boolean) => {
  //   console.log(newStatus)
  // }

  const _updateUser = (values: any) => {
    updateUser({
      id: userId,
      body: {
        postalCode: values.postalCode,
        country: values.country,
        city: values.city,
        address: values.address,
        mobile: values.mobile,
        email: values.email,
        pin_code: values.pin_code,
        last_name: values.last_name,
        first_name: values.first_name,

        stores: (userStores ? userStores.results : []).map(
          (_store: any) => _store.id,
        ),
      },
    })
      .unwrap()
      .then(() => {
        toast.success('User updated successfully')
      })
      .catch(() => toast.error('An error occured'))
  }

  const _deleteUser = () => {
    if (deleteModal) {
      deleteUser(deleteModal)
        .unwrap()
        .then(() => {
          router.replace(buildUrl('userAccounts'))
          toast.success('User deleted successfully')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  const { errorTitle, errorSubtitle } =
    getCustomNotFoundError()

  const CustomError404 = () => (
    <Error404
      brief
      title={errorTitle}
      subTitle={errorSubtitle}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError || !userData) return <CustomError404 />

  return IsResourceNotFound(userData) ? (
    <CustomError404 />
  ) : (
    <>
      <Box>
        <Box sx={{ pb: 5 }}>
          <UserInfo
            hidePassword
            onSubmit={_updateUser}
            headerShown={false}
            defaultValues={userData}
            headerSection={
              <>
                <Box sx={{ mb: 5 }}>
                  <UserInfoCard
                    allowStatusUpdate
                    userData={{
                      email: userData.email,
                      fullName: getFullName(userData),
                      country: userData.country,
                      createdAt: userData.createdAt,
                      status: userData.status,
                      user_type: userData.user_type,
                    }}
                    actionBtns={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          justifyContent: isMobileSize
                            ? 'center'
                            : 'flex-end',
                        }}
                      >
                        {1 ? (
                          <Button
                            variant='contained'
                            type='submit'
                          >
                            {isWindowBelow(775) ? (
                              <Icon icon='tabler:device-floppy' />
                            ) : (
                              'Update Account'
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant='contained'
                            onClick={() => null}
                          >
                            {isWindowBelow(775) ? (
                              <Icon icon='tabler:check' />
                            ) : (
                              'Mark As Approved'
                            )}
                          </Button>
                        )}
                        <Button
                          variant='tonal'
                          color='error'
                          onClick={() =>
                            openDeleteModal(userData.id)
                          }
                        >
                          {isWindowBelow(775) ? (
                            <Icon icon='tabler:trash' />
                          ) : (
                            'Delete User'
                          )}
                        </Button>
                      </Box>
                    }
                  />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      ...primaryFilled,
                      width: 'fit-content',
                      p: 2,
                      px: 3,
                      borderRadius: 1,
                    }}
                  >
                    <Icon icon='tabler:grid-dots' />
                    <Typography color={primaryFilled.color}>
                      Overview
                    </Typography>
                  </Box>
                </Box>
              </>
            }
          />

          <Grid container columns={12} spacing={4} pt={4}>
            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Card sx={{ p: 4 }}>
                <WeekWorkHours
                  weekHoursData={userData.working_hours}
                  brief
                  onUpdate={values =>
                    console.log('Overview.tsx:', values)
                  }
                  openEditModal={openEditWorkWeekHrsModal}
                />
              </Card>
            </Grid>

            <Grid item md={6} sm={12} xs={12} flex={1}>
              <RolesStoresCard
                userId={userData.id}
                role={userData.user_type}
                stores={
                  userStores ? userStores.results : []
                }
                isEditable
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <ConfirmationModal
        open={typeof deleteModal === 'number'}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete User'
        content={
          <Box py={2}>
            This user will be removed from active users and
            will go into a pending permanent deletion state
            for 30 days during which time you can restore
            them.
            <Typography
              color='error'
              mt={3}
              fontWeight={600}
            >
              After 30 days, the person and all their
              tracked data will be permanently deleted!
            </Typography>
          </Box>
        }
        confirmTitle='Delete'
        onConfirm={_deleteUser}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />

      <UpdateWeekWorkHoursModal
        userId={userData.id}
        open={editWorkWeekHrsModal}
        handleClose={closeEditWorkWeekHrsModal}
      />
    </>
  )
}

export default EditUser
