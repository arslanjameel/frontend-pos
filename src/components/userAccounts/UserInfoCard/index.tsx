// import { Box, Button, Card, IconButton, Typography } from '@mui/material'
// import Image from 'next/image'
import React, { useState } from 'react'

// import Icon from 'src/@core/components/icon'
// import CustomTag from '../global/CustomTag'
// import { useWindowSize } from 'src/hooks/useWindowSize'
// import UseBgColor from 'src/@core/hooks/useBgColor'
import { useUpdateUserStatusMutation } from 'src/store/apis/accountSlice'

// import { getRoleName } from 'src/utils/dataUtils'
import { IUserStatus } from 'src/models/IUser'

// import useGetCountryName from 'src/hooks/useGetCountryName'

// import { dateToString } from 'src/utils/dateUtils'

// import UserStatusTag from './UserStatusTag'
import toast from 'react-hot-toast'
import { useModal } from 'src/hooks/useModal'
import EnterPinModal from '../../global/EnterPinModal'
import UserInfoCardLegacy from './UserInfoCardLegacy'
import UserInfoCardNew from './UserInfoCardNew'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'

interface Props {
  userData?: {
    fullName: string
    email: string
    user_type: number
    status: IUserStatus
    country: number
    createdAt: string
  }
  legacy?: boolean
  switchStatus?: (value: boolean) => void
  allowStatusUpdate?: boolean
  country?: number
  joinedOn?: string
  actionBtns?: React.ReactNode
  primaryBtnText?: string

  currentImage?: string
  handleImageChange?: (file: File) => void
}

const UserInfoCard = ({
  userData,
  legacy,
  actionBtns,
  allowStatusUpdate,
  primaryBtnText = 'Upload store logo',

  currentImage,
  handleImageChange,
}: Props) => {
  //   const { data: roles } = useGetUserTypesQuery()
  //   const { data: countries } = useGetCountriesQuery()

  //   const { getCountry } = useGetCountryName(countries ? countries : [])

  const { openModal, closeModal, isModalOpen } =
    useModal<number>()

  const [updateUserStatus] = useUpdateUserStatusMutation()

  //   const { isMobileSize } = useWindowSize()
  //   const { primaryFilled, primaryLight, secondaryLight, secondaryFilled } = UseBgColor()

  const [selectedImage, setSelectedImage] = useState<
    string | null
  >(currentImage || null)

  const _handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const imgUrl = URL.createObjectURL(file)
      setSelectedImage(imgUrl)

      handleImageChange && handleImageChange(file)
    }
  }

  const resetImage = () => setSelectedImage(null)

  const _updateUserStatus = (pin_code: string) => {
    if (userData) {
      let new_status: IUserStatus = 'Inactive'
      if (
        userData.status === 'Inactive' ||
        userData.status === 'Pending'
      ) {
        new_status = 'Active'
      } else {
        new_status = 'Inactive'
      }

      updateUserStatus({
        email: userData.email,
        new_status,
        pin_code,
      })
        .unwrap()
        .then((res: any) => {
          if (hasErrorKey(res)) {
            toast.error(extractErrorMessage(res))
          } else {
            toast.success('Status updated successfully')
          }
        })
        .catch(err => {
          toast.error(extractErrorMessage(err))
        })
    }
  }

  return (
    <>
      {!legacy && userData ? (
        <UserInfoCardNew
          selectedImage={selectedImage}
          handleImageChange={_handleImageChange}
          resetImage={resetImage}
          userData={userData}
          actionBtns={actionBtns}
          allowStatusUpdate={allowStatusUpdate}
          openStatusModal={() => openModal(1)}
        />
      ) : (
        <UserInfoCardLegacy
          primaryBtnText={primaryBtnText}
          selectedImage={selectedImage}
          handleImageChange={_handleImageChange}
          resetImage={resetImage}
        />
      )}
      <EnterPinModal
        open={isModalOpen()}
        handleClose={closeModal}
        onSubmit={_updateUserStatus}
      />
    </>
  )
}

export default UserInfoCard
