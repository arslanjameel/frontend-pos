import {
  Box,

  // Avatar,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'

// import {
//   Timeline,
//   TimelineConnector,
//   TimelineContent,
//   TimelineDot,
//   TimelineItem,
//   TimelineSeparator,
// } from '@mui/lab'
import React, { useCallback, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import Icon from 'src/@core/components/icon'
import CustomTag from 'src/components/global/CustomTag'

// import UseBgColor from 'src/@core/hooks/useBgColor'
// import { useWindowSize } from 'src/hooks/useWindowSize'
import EditContactDetailsModal from 'src/components/userAccounts/EditContactDetailsModal'
import RolesStoresCard from 'src/components/userAccounts/RolesStoresCard'
import {
  useGetSingleUserQuery,
  useGetUserStoresQuery,
  useGetUserTypesQuery,
  useUpdatePasswordPinCodeMutation,
  useUpdateUserPartialMutation,
} from 'src/store/apis/accountSlice'
import fakeWeekWorkHours from 'src/@fake-db/weekWorkHours'
import IDay from 'src/models/shared/IDay'
import { timeToAMPM } from 'src/utils/dateUtils'
import {
  getFullName,
  getRoleName,
} from 'src/utils/dataUtils'
import { useAuth } from 'src/hooks/useAuth'

// import { UserType } from 'src/types/UserTypes'
import ControlledInput from 'src/components/global/ControlledInput'
import { requiredMsg } from 'src/utils/formUtils'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'

interface Props {
  userId: number
}

const ProfileTab = ({ userId }: Props) => {
  const { user } = useAuth()
  const { data: roles } = useGetUserTypesQuery()
  const { data: userData } = useGetSingleUserQuery(userId)
  const { data: userStores } = useGetUserStoresQuery(userId)

  const [updateUserPartial] = useUpdateUserPartialMutation()

  // const { successLight, warningLight } = UseBgColor()

  // const { isWindowBelow, isMobileSize } = useWindowSize()

  const [editModal, setEditModal] = useState(false)
  const openEditModal = () => setEditModal(true)
  const closeEditModal = () => setEditModal(false)

  const _updateUserPartial = (values: {
    mobile: string
    email: string
  }) => {
    updateUserPartial({
      id: userId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      body: { ...values },
    })
      .unwrap()
      .then(() =>
        toast.success('User details updated successfully'),
      )
      .catch(() => toast.error('An error occured'))
      .finally(() => closeEditModal())
  }

  const [updatePasswordPin] =
    useUpdatePasswordPinCodeMutation()

  interface FormData {
    old_password: string

    // new_password: string
    // verify_new_password: string
    new_pin_code: string
    verify_new_pin_code: string
  }

  const defaultValues = {
    old_password: '',
    new_pin_code: '',
    verify_new_pin_code: '',
  }

  const schema = yup.object().shape({
    old_password: yup
      .string()
      .required(requiredMsg('Password')),
    new_pin_code: yup
      .string()
      .min(6, 'Pin must have at least 6 characters')
      .required(requiredMsg('Pin Code')),
    verify_new_pin_code: yup
      .string()
      .required('Please confirm your Pin Code')
      .oneOf(
        [yup.ref('new_pin_code'), ''],
        'Codes must match',
      ),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = ({
    old_password,
    new_pin_code,
  }: FormData) => {
    updatePasswordPin({
      old_password,
      new_pin_code,
    })
      .unwrap()
      .then((res: any) => {
        if (hasErrorKey(res)) {
          toast.error(extractErrorMessage(res))
        } else {
          toast.success('Pin updated successfully')
          reset()
        }
      })
      .catch((error: any) =>
        toast.error(extractErrorMessage(error)),
      )
  }

  // const timelineData: {
  //   title: string
  //   description: string
  //   date: string
  //   dotColor:
  //     | 'primary'
  //     | 'success'
  //     | 'error'
  //     | 'warning'
  //     | 'secondary'
  //   content?: React.ReactNode
  // }[] = [
  //   {
  //     title: 'Client Meeting',
  //     description: 'Project meeting with John @10.15am',
  //     date: 'Today',
  //     dotColor: 'success',
  //     content: (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           gap: 2,
  //         }}
  //       >
  //         <Avatar src='/images/avatars/person1.png' />
  //         <Box>
  //           <Typography sx={{ fontWeight: 600 }}>
  //             Lecster McCarthy
  //           </Typography>
  //           <Typography sx={{ mt: 1, fontSize: 13 }}>
  //             CEO of Infeibeam
  //           </Typography>
  //         </Box>
  //       </Box>
  //     ),
  //   },
  //   {
  //     title: 'Create a new project for client',
  //     description: 'Add files to new design folder',
  //     date: '2 Day Ago',
  //     dotColor: 'warning',
  //   },
  //   {
  //     title: 'Shared 2 New Project Files',
  //     description: 'Sent by Mollie Dixon',
  //     date: '6 Day Ago',
  //     dotColor: 'error',
  //     content: (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           flexWrap: 'wrap',
  //           alignItems: 'center',
  //           gap: 3,
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             display: 'flex',
  //             alignItems: 'center',
  //             gap: 1,
  //           }}
  //         >
  //           <Icon
  //             icon='tabler:file-description'
  //             color={warningLight.color}
  //           />{' '}
  //           App Guidelines
  //         </Box>
  //         <Box
  //           sx={{
  //             display: 'flex',
  //             alignItems: 'center',
  //             gap: 1,
  //           }}
  //         >
  //           <Icon
  //             icon='tabler:table'
  //             color={successLight.color}
  //           />{' '}
  //           App Guidelines
  //         </Box>
  //       </Box>
  //     ),
  //   },
  // ]

  const isDayHrsSet = useCallback(
    (day: IDay) => {
      if (userData) {
        const _res = userData.working_hours.find(
          (whd: any) => whd.day === day,
        )

        if (_res) return _res
      }

      return false
    },
    [userData],
  )

  const getWorkingHrs = () => {
    return fakeWeekWorkHours.map(wwh => {
      const _dayInfo = isDayHrsSet(wwh.day)
      if (_dayInfo) return _dayInfo

      return wwh
    })
  }

  const WorkHoursBox = ({ day = '', hrs = '' }) => (
    <Box sx={{ display: 'flex' }}>
      <Typography sx={{ width: 110, fontWeight: 600 }}>
        {day}
      </Typography>
      <Typography>{hrs}</Typography>
    </Box>
  )

  const About = () => (
    <Card
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
      }}
    >
      <Typography
        sx={{ fontWeight: 400, fontSize: 13, mb: 3 }}
      >
        ABOUT
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Icon icon='tabler:user' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Full Name:
        </Typography>{' '}
        {userData ? getFullName(userData) : '--'}
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Icon icon='tabler:check' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Status:
        </Typography>{' '}
        <CustomTag color='success' label='Active' />
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Icon icon='tabler:crown' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Role:
        </Typography>{' '}
        {userData
          ? getRoleName(
              roles?.results || [],
              userData.user_type,
            )
          : '--'}
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Icon icon='tabler:flag' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Address:
        </Typography>{' '}
        {userData ? userData.address : '--'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontWeight: 400, fontSize: 13, my: 3 }}
        >
          CONTACTS
        </Typography>

        <Icon
          icon='tabler:dots-vertical'
          style={{ cursor: 'pointer' }}
          onClick={openEditModal}
        />
      </Box>

      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Icon icon='tabler:phone' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Phone:
        </Typography>{' '}
        {userData ? userData.mobile : '--'}
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Icon icon='tabler:mail' />{' '}
        <Typography sx={{ fontWeight: 600 }}>
          Email:
        </Typography>{' '}
        {userData ? userData.email : '--'}
      </Typography>
    </Card>
  )

  // const ActivityTimeline = () => (
  //   <Card
  //     sx={{
  //       p: 4,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       gap: 2,
  //       width: '100%',
  //     }}
  //   >
  //     <Typography
  //       sx={{
  //         fontWeight: 600,
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 2,
  //       }}
  //     >
  //       <Icon icon='tabler:list-details' />
  //       Activity Timeline
  //     </Typography>

  //     <Timeline
  //       sx={{
  //         '& .MuiTimelineItem-missingOppositeContent::before':
  //           {
  //             flex: '0 !important',
  //             '-webkit-flex': '0 !important',
  //           },
  //       }}
  //     >
  //       {timelineData.map((item, i) => (
  //         <TimelineItem key={item.title}>
  //           <TimelineSeparator>
  //             <TimelineDot color={item.dotColor} />
  //             {i !== timelineData.length - 1 && (
  //               <TimelineConnector />
  //             )}
  //           </TimelineSeparator>

  //           <TimelineContent
  //             sx={{
  //               display: 'flex',
  //               flexDirection: 'column',
  //               gap: 2,
  //             }}
  //           >
  //             <Box
  //               sx={{
  //                 display: 'flex',
  //                 gap: 1,
  //                 flexDirection: isWindowBelow(550)
  //                   ? 'column'
  //                   : 'row',
  //                 justifyContent: 'space-between',
  //                 alignItems: 'flex-start',
  //               }}
  //             >
  //               <Box>
  //                 <Typography sx={{ fontWeight: 600 }}>
  //                   {item.title}
  //                 </Typography>
  //                 <Typography>
  //                   {item.description}
  //                 </Typography>
  //               </Box>

  //               <Typography>{item.date}</Typography>
  //             </Box>

  //             {item.content && item.content}
  //           </TimelineContent>
  //         </TimelineItem>
  //       ))}
  //     </Timeline>
  //   </Card>
  // )

  const WorkHrsCard = () => (
    <Card
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
      }}
    >
      <Typography
        sx={{ fontWeight: 400, fontSize: 13, mb: 3 }}
      >
        WORK HOURS
      </Typography>

      {getWorkingHrs().map(workDay => (
        <WorkHoursBox
          key={workDay.day}
          day={workDay.day}
          hrs={
            workDay.isActive
              ? timeToAMPM(workDay.startTime) +
                ' - ' +
                timeToAMPM(workDay.endTime)
              : 'Closed'
          }
        />
      ))}
    </Card>
  )

  const PinCodeCard = () => (
    <Card sx={{ p: 4, height: '100%' }}>
      <Typography
        sx={{ fontWeight: 400, fontSize: 13, mb: 3 }}
      >
        PIN
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columns={12} spacing={4}>
          <Grid item md={12} sm={12} xs={12}>
            <ControlledInput
              name='old_password'
              control={control}
              label='Current Password'
              error={errors.old_password}
              placeholder='******'
              inputType='password'
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <ControlledInput
              name='new_pin_code'
              control={control}
              label='New Pin'
              error={errors.new_pin_code}
              placeholder='******'
              inputType='pinCode'
              maxLength={6}
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <ControlledInput
              name='verify_new_pin_code'
              control={control}
              label='Confirm New Pin'
              error={errors.verify_new_pin_code}
              placeholder='******'
              inputType='pinCode'
              maxLength={6}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginTop: 4,
          }}
        >
          <Button
            variant='contained'
            type='submit'
            fullWidth
          >
            Update
          </Button>
        </Box>
      </form>
    </Card>
  )

  const isUserManager = () => {
    return user ? user.user_type === 'manager' : false
  }

  const getMinSize = () => (isUserManager() ? 4 : 6)

  return (
    <>
      <Grid container columns={12} spacing={4}>
        <Grid
          item
          md={getMinSize()}
          sm={getMinSize()}
          xs={12}
        >
          <About />
        </Grid>
        <Grid
          item
          md={getMinSize()}
          sm={getMinSize()}
          xs={12}
        >
          <WorkHrsCard />
        </Grid>
        {isUserManager() && (
          <Grid
            item
            md={getMinSize()}
            sm={getMinSize()}
            xs={12}
          >
            <PinCodeCard />
          </Grid>
        )}

        <Grid item md={12} sm={12} xs={12}>
          <RolesStoresCard
            role={userData ? userData.user_type : -1}
            stores={userStores ? userStores.results : []}
            userId={userId}
          />
        </Grid>
      </Grid>

      {/* <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isWindowBelow(895) ? '100%' : 380,
            gap: 5,
          }}
        >
          <About />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: isMobileSize ? 'fit-content' : 400,
            flexDirection: 'column',
            display: 'flex',
            gap: 5,
          }}
        >
          <ActivityTimeline />

          <WorkHrsCard />
        </Box>
      </Box> */}

      <EditContactDetailsModal
        open={editModal}
        handleClose={closeEditModal}
        defaultValues={{
          email: userData?.email || '',
          mobile: userData?.mobile || '',
        }}
        onSubmit={values => _updateUserPartial(values)}
      />
    </>
  )
}

export default ProfileTab
