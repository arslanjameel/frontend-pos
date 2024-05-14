import { Button, Card } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import AppTabs from 'src/components/global/AppTabs'
import OverviewTab from './OverviewTab'
import Icon from 'src/@core/components/icon'
import UserAccessTab from './UserAccessTab'

// import WarehouseTab from './WarehouseTab'
import FloorModal from 'src/components/stores/FloorModal'
import PageContainer from 'src/components/global/PageContainer'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  IFloor,
  createWarehouse,
} from 'src/store/reducers/storesSlice'
import { useAppDispatch } from 'src/store/hooks'
import { isIdValid } from 'src/utils/routerUtils'

const ViewStore = () => {
  const router = useRouter()
  const id = router.query.id
  const storeId = isIdValid(id)

  const dispatch = useAppDispatch()

  const { isMobileSize } = useWindowSize()
  const [openedTab, setOpenedTab] = useState(0)

  const [addFloorModal, setAddFloorModal] = useState(false)
  const openAddFloorModal = () => setAddFloorModal(true)
  const closeAddFloorModal = () => setAddFloorModal(false)

  const [addUserAccessModal, setAddUserAccessModal] =
    useState(false)
  const openAddUserAccessModal = () =>
    setAddUserAccessModal(true)
  const closeAddUserAccessModal = () =>
    setAddUserAccessModal(false)

  const _addFloor = (values: IFloor) => {
    dispatch(
      createWarehouse({
        ...values,
        floor: values.floorName,
        sections: values.sections.map(s => s.toString()),
      }),
    )
    toast.success('Floor added successfully')
    closeAddFloorModal()
  }

  const getCustomBtns = (tab: number) => {
    if (tab === 2) {
      return isMobileSize ? (
        <Button
          size='small'
          sx={{ ml: 3, my: 1 }}
          variant='contained'
          onClick={openAddFloorModal}
        >
          <Icon icon='tabler:plus' />
        </Button>
      ) : (
        <Button
          sx={{ ml: 3, my: 1 }}
          startIcon={<Icon icon='tabler:plus' />}
          variant='contained'
          onClick={openAddFloorModal}
        >
          Add Floor
        </Button>
      )
    } else if (tab === 1) {
      return isMobileSize ? (
        <Button
          size='small'
          sx={{ ml: 3, my: 1 }}
          variant='contained'
          onClick={openAddUserAccessModal}
        >
          <Icon icon='tabler:plus' />
        </Button>
      ) : (
        <Button
          sx={{ ml: 3, my: 1 }}
          startIcon={<Icon icon='tabler:plus' />}
          variant='contained'
          onClick={openAddUserAccessModal}
        >
          Add User
        </Button>
      )
    } else {
      return undefined
    }
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Stores', to: '/stores' },
          { label: 'Account', to: '#' },
        ]}
      >
        <Card>
          <AppTabs
            openedTab={openedTab}
            changeTab={id => setOpenedTab(id)}
            tabs={[
              {
                id: 0,
                title: 'Overview',
                content: <OverviewTab />,
                icon: 'tabler:grid-dots',
              },

              // {
              //   id: 1,
              //   title: 'Warehouses',
              //   content: <WarehouseTab />,
              //   icon: 'tabler:building-warehouse',
              // },
              {
                id: 1,
                title: 'User Access',
                content: (
                  <UserAccessTab
                    storeId={storeId}
                    userAccessModalOpen={addUserAccessModal}
                    closeUserAccessModal={
                      closeAddUserAccessModal
                    }
                  />
                ),
                icon: 'tabler:user-shield',
              },
            ]}
            customBtns={getCustomBtns(openedTab)}
          />
        </Card>
      </PageContainer>

      <FloorModal
        open={addFloorModal}
        onSubmit={_addFloor}
        handleClose={closeAddFloorModal}
      />
    </>
  )
}

export default ViewStore
