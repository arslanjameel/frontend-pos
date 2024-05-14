import {
  Box,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material'
import React from 'react'

import TableSearchInput from './TableSearchInput'

interface Props {
  leftActionBtns?: React.ReactNode
  actionBtns?: React.ReactNode
  secondaryActionBtns?: React.ReactNode
  toolbarBottom?: React.ReactNode
  showSearch?: boolean
  showPageSizes?: boolean
  pageSize: number
  setPageSize: (newSize: number) => void

  search?: string
  setSearch?: (newSize: string) => void
  checkboxSelection?: boolean
  searchPlaceholder?: string
  isMobileSize: boolean
  pageSizeOptions?: number[]
}

const TableToolbar = ({
  actionBtns,
  leftActionBtns,
  secondaryActionBtns,
  showSearch,
  search = '',
  setSearch,
  showPageSizes,
  pageSize,
  setPageSize,
  isMobileSize,
  searchPlaceholder = 'Search',
  pageSizeOptions = [5, 10, 15, 20],
  toolbarBottom,
}: Props) => {
  return (
    <Toolbar
      sx={{
        pt: 4,
        pb: 2,
        px: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        borderBottom: '1px solid rgba(47, 43, 61, 0.16)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {leftActionBtns && leftActionBtns}
          {!isMobileSize && showPageSizes && (
            <Select
              size='small'
              value={pageSize}
              sx={{ width: 70 }}
              onChange={e =>
                setPageSize(Number(e.target.value))
              }
            >
              {pageSizeOptions.map(v => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          )}
          {actionBtns && actionBtns}
        </Box>

        <Box
          sx={{
            // width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {showSearch && !isMobileSize && (
            <TableSearchInput
              value={search}
              onChange={val => setSearch && setSearch(val)}
              placeholder={searchPlaceholder}
            />
          )}
          {!isMobileSize &&
            secondaryActionBtns &&
            secondaryActionBtns}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        {showSearch && isMobileSize && (
          <TableSearchInput
            value={search}
            onChange={val => setSearch && setSearch(val)}
            placeholder={searchPlaceholder}
          />
        )}
        {toolbarBottom && toolbarBottom}
        {isMobileSize &&
          secondaryActionBtns &&
          secondaryActionBtns}
      </Box>
    </Toolbar>
  )
}

export default TableToolbar
