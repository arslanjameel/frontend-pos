import { Box } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/router'

import ProfileTab from './ProfileTab'

// import SecurityTab from './SecurityTab'
// import AppTabs from 'src/components/global/AppTabs'
import { useGetSingleUserQuery } from 'src/store/apis/accountSlice'
import FallbackSpinner from 'src/@core/components/spinner'
import Error404 from 'src/pages/404'
import { IsResourceNotFound } from 'src/utils/apiUtils'
import { getFullName } from 'src/utils/dataUtils'
import UserInfoCard from 'src/components/userAccounts/UserInfoCard'

const NOT_FOUND_ERR_TITLE = 'User Not Found'
const NOT_FOUND_ERR_SUBTITLE =
  'Oops! The requested user was not found on this server.'

const EditUser = () => {
  const router = useRouter()
  const userId = router.query.id

  const {
    data: userData,
    isLoading,
    isError,
  } = useGetSingleUserQuery(Number(userId))

  // const [openedTab, setOpenedTab] = useState(0)

  const CustomError404 = () => (
    <Error404
      brief
      title={NOT_FOUND_ERR_TITLE}
      subTitle={NOT_FOUND_ERR_SUBTITLE}
    />
  )

  if (isLoading) return <FallbackSpinner brief />
  if (isError) return <CustomError404 />

  return !userData || IsResourceNotFound(userData) ? (
    <CustomError404 />
  ) : (
    <Box>
      <Box sx={{ mb: 5 }}>
        <UserInfoCard
          userData={{
            email: userData.email,
            fullName: getFullName(userData),
            country: userData.country,
            createdAt: userData.createdAt,
            status: userData.status,
            user_type: userData.user_type,
          }}
        />
      </Box>

      <ProfileTab userId={userData.id} />

      {/* <AppTabs
        legacy={false}
        openedTab={openedTab}
        changeTab={id => setOpenedTab(id)}
        tabs={[
          {
            id: 0,
            title: 'Profile',
            icon: 'tabler:user-check',
            content: <ProfileTab userId={userData.id} />,
          },
          {
            id: 1,
            title: 'Security',
            icon: 'tabler:lock',
            content: <SecurityTab />,
          },
        ]}
      /> */}
    </Box>
  )
}

export default EditUser
