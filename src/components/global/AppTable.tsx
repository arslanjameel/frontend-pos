import {
  Box,
  IconButton,
  Pagination,
  PaginationItem,
  Typography,
} from '@mui/material'
import {
  DataGrid,
  GridCallbackDetails,
  GridCellParams,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowParams,
  GridRowSelectionModel,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import TableToolbar from './TableToolbar'
import { DEFAULT_PAGE_SIZE } from 'src/utils/globalConstants'

const CustomPaginator = ({
  rowLength = 10,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  handlePageChange,
}: {
  rowLength: number
  page: number
  pageSize: number
  handlePageChange: (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => void
}) => {
  const startEntry = page * pageSize + 1
  const endEntry = Math.min(
    (page + 1) * pageSize,
    rowLength,
  )

  const message = `Showing ${startEntry} to ${endEntry} of ${rowLength} entries`

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Typography
        sx={{
          color: '#9f9baa',
          fontSize: 13,
          fontWeight: 400,
          minWidth: 100,
        }}
      >
        {message}
      </Typography>
      <Pagination
        count={Math.ceil(rowLength / pageSize)}
        page={page + 1}
        onChange={handlePageChange}
        shape='rounded'
        variant='text'
        color='primary'
        renderItem={item => (
          <PaginationItem
            slots={{
              previous: () => (
                <Typography sx={{ px: 1 }}>
                  Previous
                </Typography>
              ),
              next: () => (
                <Typography sx={{ px: 1 }}>Next</Typography>
              ),
            }}
            {...item}
            sx={{
              background: '#f1f0f2',
              '&:hover': { background: '#e2e1e5' },
            }}
          />
        )}
      />
    </Box>
  )
}

const NoRowsOverlay = ({ text }: { text: string }) => (
  <Typography
    sx={{
      py: 2,
      height: '100% ',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      fontStyle: 'italic',
      opacity: 0.7,
    }}
  >
    {text}
  </Typography>
)

interface Props {
  rows: any[]
  totalRows?: number
  columns: GridColDef[]
  miniColumns?: string[]
  columnsInSearch?: string[]
  openMiniModal?: (
    data: GridCellParams<
      any,
      any,
      any,
      GridTreeNodeWithRender
    >['row'],
  ) => void
  onRowClick?: (params: GridRowParams<any>) => void
  leftActionBtns?: React.ReactNode
  actionBtns?: React.ReactNode
  secondaryActionBtns?: React.ReactNode
  toolbarBottom?: React.ReactNode
  showSearch?: boolean
  showToolbar?: boolean
  showPageSizes?: boolean
  defaultPageSize?: number
  checkboxSelection?: boolean
  pagination?: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  searchPlaceholder?: string
  maxHeight?: string | number
  autoHeight?: boolean
  rowHeight?: number
  flexHeight?: boolean
  search?: string
  setRequestSearch?: (val: string) => void //TODO: deprecate this
  onSearchChange?: (val: string) => void
  rowSelectionModel?: GridInputRowSelectionModel
  onRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>,
  ) => void
  isLoading?: boolean
  noRowsText?: string
  headerStyle?: any
  showHeader?: boolean
  header?: string
  compress?: boolean
}

const AppTable = ({
  rows = [],
  totalRows = rows.length,
  columns,
  miniColumns,
  columnsInSearch,
  search,
  onSearchChange,
  openMiniModal,
  onRowClick,
  leftActionBtns,
  actionBtns,
  secondaryActionBtns,
  showSearch = true,
  showToolbar = false,
  showPageSizes = true,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  checkboxSelection = false,
  pagination = true,
  onPageChange,
  onPageSizeChange,
  searchPlaceholder,
  maxHeight,
  rowHeight,
  autoHeight = true,
  flexHeight = false,
  rowSelectionModel,
  onRowSelectionModelChange,
  toolbarBottom,
  isLoading,
  noRowsText = 'No Rows',
  headerStyle = {},
  showHeader = false,
  header = '',
  compress,
}: Props) => {
  const { isMobileSize } = useWindowSize()
  const [page, setPage] = useState(0)
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    const newPage = value - 1
    setPage(newPage)
    onPageChange && onPageChange(value)
  }

  const pageSizeOptions = [5, 10, 25]

  const [pageSize, setPageSize] = useState(defaultPageSize)

  const _miniColumns: GridColDef[] = [
    {
      field: ' ',
      headerName: ' ',
      width: 70,
      disableColumnMenu: true,
      sortable: false,
      cellClassName: 'yes-overflow',
      renderCell: params => {
        return (
          <IconButton
            onClick={() =>
              openMiniModal && openMiniModal(params.row)
            }
          >
            <Icon icon='tabler:square-rounded-plus' />
          </IconButton>
        )
      },
    },
  ]

  return (
    <Box>
      {showHeader && (
        <Box
          sx={{
            pt: 4,
            pb: 2,
            px: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderBottom:
              '1px solid rgba(47, 43, 61, 0.16)',
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {header}
          </Typography>
        </Box>
      )}
      {showToolbar && (
        <TableToolbar
          pageSizeOptions={pageSizeOptions}
          isMobileSize={isMobileSize}
          setPageSize={newPageSize => {
            setPageSize(newPageSize)
            onPageSizeChange &&
              onPageSizeChange(newPageSize)
          }}
          actionBtns={actionBtns}
          checkboxSelection={checkboxSelection}
          leftActionBtns={leftActionBtns}
          searchPlaceholder={searchPlaceholder}
          secondaryActionBtns={secondaryActionBtns}
          showPageSizes={showPageSizes}
          showSearch={showSearch}
          search={search}
          setSearch={onSearchChange}
          pageSize={pageSize}
          toolbarBottom={toolbarBottom}
        />
      )}
      <Box
        sx={{
          height: maxHeight || 'fit-content',
          overflowY: 'auto',
          width: '100%',
          borderBottom: pagination
            ? ''
            : '1px solid rgba(47, 43, 61, 0.16)',
        }}
      >
        <DataGrid
          loading={isLoading}
          sx={{
            height: 100,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.paper',
              ...headerStyle,
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'background.paper',
              ...headerStyle,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              textOverflow: 'clip',
              whiteSpace: 'break-spaces',
              lineHeight: 1.1,
              fontSize: compress ? 12.2 : 13.2,
              fontWeight: 600,
              letterSpacing: 1,
              textAlign: 'center',
            },
            '& .MuiDataGrid-overlayWrapper': {
              minHeight: 40,
            },
          }}
          getRowHeight={
            flexHeight ? () => 'auto' : undefined
          }
          rows={rows}
          columns={
            !isMobileSize || !miniColumns
              ? columns
              : [
                  ..._miniColumns,
                  ...columns.filter(cols =>
                    miniColumns.includes(cols.field),
                  ),
                ]
          }
          paginationModel={{
            page,
            pageSize: pagination ? pageSize : rows.length,
          }}
          slots={{
            pagination: () => (
              <CustomPaginator
                page={page}
                rowLength={totalRows}
                pageSize={pageSize}
                handlePageChange={handlePageChange}
              />
            ),
            noRowsOverlay: () => (
              <NoRowsOverlay text={noRowsText} />
            ),
            noResultsOverlay: () => (
              <NoRowsOverlay text={noRowsText} />
            ),
          }}
          pageSizeOptions={pageSizeOptions}
          disableRowSelectionOnClick
          rowSelection={
            onRowSelectionModelChange !== undefined
          }
          autoHeight={autoHeight}
          rowHeight={rowHeight}
          columnHeaderHeight={rowHeight || 56}
          hideFooter={!pagination}
          onRowClick={onRowClick}
          checkboxSelection={checkboxSelection}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={
            onRowSelectionModelChange
          }
          filterModel={{
            items: (columnsInSearch
              ? columnsInSearch
              : []
            ).map((col, i) => ({
              id: i,
              field: col,
              operator: 'contains',
              value: search,
            })),
          }}
        />
      </Box>
    </Box>
  )
}

export default AppTable
