import React, { useState } from 'react'
import { Button } from '@mui/material'

import AppModal from './AppModal'
import UncontrolledInput from './UncontrolledInput'

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (pin_code: string) => void
}

const EnterPinModal = ({
  open,
  handleClose,
  onSubmit,
}: Props) => {
  const [pinCode, setPinCode] = useState('')
  const [pinCodeErr, setPinCodeErr] = useState('')

  const _onSubmit = () => {
    const pin_code = pinCode.trim()

    if (pin_code.length === 0) {
      setPinCodeErr('Pin Code Required')
    } else {
      onSubmit(pin_code)
    }
  }

  return (
    <AppModal
      title='Enter Your Pin Code'
      titleAlign='left'
      open={open}
      handleClose={handleClose}
      maxWidth={500}
      sx={{ p: 5 }}
    >
      <UncontrolledInput
        label='Pin Code'
        placeholder='*******'
        maxLength={6}
        value={pinCode}
        inputType='password'
        onChange={newVal => setPinCode(newVal)}
        error={pinCodeErr && { message: pinCodeErr }}
      />

      <Button
        variant='contained'
        sx={{ mt: 5 }}
        onClick={_onSubmit}
      >
        Submit
      </Button>
    </AppModal>
  )
}

export default EnterPinModal
