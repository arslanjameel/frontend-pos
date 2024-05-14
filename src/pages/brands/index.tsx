import {
  Box,
  Card,
  Button,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import TableDataModal from 'src/components/global/TableDataModal'
import AutomationStatus from 'src/components/categories/AutomationStatus'
import { useModal } from 'src/hooks/useModal'
import CustomTag from 'src/components/global/CustomTag'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import { useWindowSize } from 'src/hooks/useWindowSize'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import {
  useDeleteBrandMutation,
  useGetBrandSearchQuery,
} from 'src/store/apis/productsSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import TableSearchInput from 'src/components/global/TableSearchInput'
import Can from 'src/layouts/components/acl/Can'

// interface Props {}

const BrandsList = () => {
  const { isMobileSize } = useWindowSize()
  const [query, setQuery] = useState({
    search: '',
    page: 1,
  })
  const { data: brands, isLoading } =
    useGetBrandSearchQuery(query)
  const [deleteBrand] = useDeleteBrandMutation()

  const {
    modalData: tableData,
    openModal: openTableDataModal,
    closeModal: closeTableDataModal,
    isModalOpen: tableDataModalStatus,
  } = useModal<IData>()

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const _deleteBrand = () => {
    if (deleteModal) {
      deleteBrand(deleteModal)
        .unwrap()
        .then((res: any) => {
          if (hasErrorKey((res as any) || {})) {
            toast.error(extractErrorMessage(res as any))
          } else {
            toast.success('Brand deleted successfully')
          }
        })
        .catch(() => {
          toast.error('An error occured')
        })
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      renderCell: params => (
        <Typography>{params.value}</Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'NAME',
      flex: 1,
      minWidth: 270,
      type: 'string',
      disableColumnMenu: true,
      renderCell: params => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar>
              <Icon icon='tabler:crown' />
            </Avatar>
            <Typography color='primary' fontWeight={600}>
              <Link href={`/brands/${params.row.id}`}>
                {params.value}
              </Link>
            </Typography>
          </Box>
        )
      },
    },

    // {
    //   field: 'automation',
    //   headerName: 'AUTOMATION',
    //   minWidth: 150,
    //   flex: 1,
    //   maxWidth: 400,
    //   align: 'center',
    //   headerAlign: 'center',
    //   disableColumnMenu: true,
    //   renderCell: params => (
    //     <AutomationStatus status={params.value} />
    //   ),
    // },
    // {
    //   field: 'is_active',
    //   headerName: 'STATUS',
    //   width: 150,
    //   align: 'center',
    //   headerAlign: 'center',
    //   disableColumnMenu: true,
    //   renderCell: params => (
    //     <CustomTag
    //       label={params.value ? 'Active' : 'Inactive'}
    //       color={params.value ? 'success' : 'warning'}
    //     />
    //   ),
    // },
    {
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      disableColumnMenu: true,
      width: 105,
      cellClassName: 'yes-overflow',
      renderCell: params => {
        return (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Can I='update' a='brand'>
              <Link href={`/brands/${params.row.id}`}>
                <IconButton color='primary'>
                  <Icon icon='tabler:edit' />
                </IconButton>
              </Link>
            </Can>

            <Can I='delete' a='brand'>
              <IconButton
                color='error'
                onClick={() =>
                  openDeleteModal(params.row.id)
                }
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Can>
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Brands', to: '/brands' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            rows={brands ? brands.results : []}
            toolbarBottom={false}
            showPageSizes={false}
            isLoading={isLoading}
            columns={columns}
            miniColumns={['name']}
            openMiniModal={openTableDataModal}
            showToolbar
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  placeholder='Search Brands'
                  value={query.search}
                  onChange={val => {
                    const filter = { ...query }
                    filter.search = val
                    setQuery(filter)
                  }}
                  sx={{ minWidth: '200px' }}
                />
              </Box>
            }
            onPageChange={val => {
              const filter = { ...query }
              filter.page = val
              setQuery(filter)
            }}
            showSearch={false}
            totalRows={brands?.count}
            actionBtns={
              <Link href='/brands/new'>
                <ResponsiveButton
                  label='Add Brand'
                  icon='tabler:plus'
                  mini={isMobileSize}
                />
              </Link>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={tableDataModalStatus()}
        handleClose={closeTableDataModal}
        title={
          tableData ? `Details of ${tableData.name}` : ''
        }
        tableData={
          tableData
            ? {
                'Image:': (
                  <Avatar
                    src={'add-img-link'}
                    alt={tableData.name}
                  />
                ),
                'Name:': tableData.name,
                'Description:': tableData.brandDescription,
                'Automation:': (
                  <AutomationStatus
                    status={tableData.automation}
                  />
                ),
                'Status:': (
                  <CustomTag
                    label={
                      tableData.status === 1
                        ? 'Active'
                        : 'Inactive'
                    }
                    color={
                      tableData.status === 1
                        ? 'success'
                        : 'warning'
                    }
                  />
                ),
              }
            : {}
        }
        actionBtns={
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <Link
              href={`/brands/${tableData && tableData.id}`}
            >
              <Button
                variant='tonal'
                startIcon={<Icon icon='tabler:edit' />}
              >
                Edit
              </Button>
            </Link>
          </Box>
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Brand'
        content={
          'Are you sure you want to delete this brand?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteBrand}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

BrandsList.acl = {
  action: 'read',
  subject: 'brand',
}

export default BrandsList
