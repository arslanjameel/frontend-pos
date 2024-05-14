import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  IconButton,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import AppTable from 'src/components/global/AppTable'
import PageContainer from 'src/components/global/PageContainer'
import { IData } from 'src/utils/types'
import TableDataModal from 'src/components/global/TableDataModal'
import AutomationStatus from 'src/components/categories/AutomationStatus'
import ConfirmationModal from 'src/components/global/ConfirmationModal'
import { useModal } from 'src/hooks/useModal'
import ResponsiveButton from 'src/components/global/ResponsiveButton'
import { useWindowSize } from 'src/hooks/useWindowSize'
import {
  useDeleteCategoryMutation,
  useSearchCategoryListQuery,
} from 'src/store/apis/categorySlice'
import TableSearchInput from 'src/components/global/TableSearchInput'
import Can, {
  AbilityContext,
} from 'src/layouts/components/acl/Can'

// interface Props {}

const CategoriesList = () => {
  const ability = useContext(AbilityContext)

  const { isMobileSize } = useWindowSize()
  const [query, setQuery] = useState({
    search: '',
    page: 1,
  })
  const { data: categories } =
    useSearchCategoryListQuery(query)
  const [deleteSingleCategory] = useDeleteCategoryMutation()

  const [tableData, setTableData] = useState<IData | false>(
    false,
  )
  const openTableDataModal = (data: IData) =>
    setTableData(data)
  const closeTableDataModal = () => setTableData(false)

  const {
    modalData: deleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    isModalOpen: deleteModalStatus,
  } = useModal<number>()

  const _deleteCategory = () => {
    deleteSingleCategory(deleteModal as number)
      .unwrap()
      .then(() => {
        toast.success('Category deleted successfully')
      })
      .catch(() => toast.error('An error occurred'))
  }

  const columns: GridColDef[] = [
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
              gap: 4,
            }}
          >
            <Avatar>
              <Icon icon='tabler:layout-grid' />
            </Avatar>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                spacing: 2,
              }}
            >
              <Typography color='primary' fontWeight={600}>
                <Link href={`/categories/${params.row.id}`}>
                  {params.value}
                </Link>
              </Typography>
              <Typography>
                {params.row.description}
              </Typography>
            </Box>
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
  ]

  if (
    ability.can('update', 'category') ||
    ability.can('delete', 'category')
  ) {
    columns.push({
      field: 'action',
      headerName: 'ACTION',
      sortable: false,
      align: 'center',
      disableColumnMenu: true,
      width: 105,
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
            <Can I='update' a='category'>
              <Link href={`/categories/${params.row.id}`}>
                <IconButton color='primary'>
                  <Icon icon='tabler:edit' />
                </IconButton>
              </Link>
            </Can>

            <Can I='delete' a='category'>
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
    })
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Categories', to: '/categories' },
          { label: 'List', to: '#' },
        ]}
      >
        <Card>
          <AppTable
            rows={categories ? categories.results : []}
            columns={columns}
            miniColumns={['name']}
            showSearch={false}
            showPageSizes={false}
            openMiniModal={openTableDataModal}
            showToolbar
            secondaryActionBtns={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TableSearchInput
                  placeholder='Search Category'
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
            totalRows={categories?.count}
            actionBtns={
              <>
                <Can I='create' a='category'>
                  <Link href='/categories/new'>
                    <ResponsiveButton
                      label='Add Category'
                      icon='tabler:plus'
                      mini={isMobileSize}
                    />
                  </Link>
                </Can>
              </>
            }
          />
        </Card>
      </PageContainer>

      <TableDataModal
        open={typeof tableData !== 'boolean'}
        handleClose={closeTableDataModal}
        title={tableData ? 'Category Details ' : ''}
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
                'Description:': tableData.description,
                'Automation:': (
                  <AutomationStatus
                    status={tableData.automation}
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
            <Can I='update' a='category'>
              <Link
                href={`/brands/${
                  tableData && tableData.id
                }`}
              >
                <Button
                  variant='tonal'
                  startIcon={<Icon icon='tabler:edit' />}
                >
                  Edit
                </Button>
              </Link>
            </Can>

            <Can I='delete' a='category'>
              <Button
                variant='contained'
                color='error'
                startIcon={<Icon icon='tabler:trash' />}
                onClick={() => {
                  closeTableDataModal()
                  openDeleteModal(tableData && tableData.id)
                }}
              >
                Delete
              </Button>
            </Can>
          </Box>
        }
      />

      <ConfirmationModal
        open={deleteModalStatus()}
        handleClose={closeDeleteModal}
        maxWidth={400}
        title='Delete Category'
        content={
          'Are you sure you want to delete this category?'
        }
        confirmTitle='Delete'
        onConfirm={_deleteCategory}
        rejectTitle='Cancel'
        onReject={closeDeleteModal}
      />
    </>
  )
}

CategoriesList.acl = {
  action: 'read',
  subject: 'category',
}

export default CategoriesList
