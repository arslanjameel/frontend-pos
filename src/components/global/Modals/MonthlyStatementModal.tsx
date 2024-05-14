import React, { useState } from 'react'
import { Box, Button } from '@mui/material'

import AppModal from '../AppModal'
import AppSelect from '../AppSelect'
import { generateArrayOfMonths } from 'src/utils/dateUtils'

interface Props {
  transactions: any[]
  open: boolean
  handleClose: () => void
  generateStatement: (month: string) => void
}

const MonthlyStatementModal = ({
  transactions,
  handleClose,
  open,
  generateStatement,
}: Props) => {
  const [selectedMonth, setSelectedMonth] = useState('')

  const _generateStatement = () => {
    generateStatement(selectedMonth)
  }

  return (
    <AppModal
      maxWidth={400}
      open={open}
      handleClose={handleClose}
      title='Monthly Statement'
    >
      <Box>
        <AppSelect
          maxWidth={300}
          value={selectedMonth}
          options={generateArrayOfMonths(transactions)}
          handleChange={e =>
            setSelectedMonth(e.target.value)
          }
        />

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
            mt: 6,
          }}
        >
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={_generateStatement}
          >
            Generate
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}

export default MonthlyStatementModal
