import React from 'react'

import AppModal from './AppModal'
import { IData } from 'src/utils/types'
import { Box, Typography } from '@mui/material'

interface Props {
  open: boolean
  handleClose: () => void
  title?: string
  content?: React.ReactNode
  actionBtns?: React.ReactNode
  tableData: IData
}

const TableDataModal = ({
  open,
  handleClose,
  title = 'More Details',
  actionBtns,
  tableData,
}: Props) => {
  const RowItem = ({
    label,
    value,
    isLast = false,
  }: {
    label: string
    value: string | React.ReactNode
    isLast?: boolean
  }) => (
    <Box
      sx={{
        display: 'flex',
        py: 2,
        gap: 1,
        borderBottom: !isLast
          ? '1.5px solid #e1e1e190'
          : 'none',
      }}
    >
      <Box
        sx={{
          maxWidth: 100,
          width: '100%',
          fontWeight: 600,
        }}
      >
        {label}
      </Box>
      <Box sx={{ flex: 1 }}>{value}</Box>
    </Box>
  )

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxHeight={400}
      zIndex={100}
    >
      <Typography
        sx={{ mb: 2, fontSize: 20, fontWeight: 600 }}
      >
        {title}
      </Typography>
      {tableData &&
        Object.entries(tableData).map((keyValue, i) => (
          <RowItem
            key={i}
            label={keyValue[0]}
            value={keyValue[1]}
            isLast={
              Object.entries(tableData).length === i + 1 &&
              !actionBtns
            }
          />
        ))}

      {actionBtns && (
        <RowItem
          isLast
          label='Actions'
          value={actionBtns}
        />
      )}

      {/* {actionBtns && <Box sx={{ mt: 2 }}>{actionBtns}</Box>} */}
    </AppModal>
  )
}

export default TableDataModal
