import React from 'react'
import CustomTag from '../global/CustomTag'

interface Props {
  status: number | string
}

const AutomationStatus = ({ status }: Props) => {
  switch (status) {
    case 0:
    case '0':
      return <CustomTag label='Manual' color='primary' />
    case 1:
    case '1':
      return <CustomTag label='Automated' color='success' />

    default:
      return <CustomTag label='--' color='warning' />
  }
}

export default AutomationStatus
