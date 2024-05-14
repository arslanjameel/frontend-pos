import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import AppModal from '../global/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useWindowSize } from 'src/hooks/useWindowSize'
import { requiredMsg } from 'src/utils/formUtils'

interface IPermission {
  read: boolean
  write: boolean
  create: boolean
}

interface IActualPermission {
  [key: string]: IPermission
}

interface RoleInfo {
  roleName: string
  roleDescription: string
  permissions: IActualPermission
}

interface Props {
  open: boolean
  handleClose: () => void
  onSubmit: (values: RoleInfo) => void
  isEdit?: boolean
}

const permissionsList = [
  'User Management',
  'Content Management',
  'Displutes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll',
]

const initialPermissions: IActualPermission = {
  'User Management': {
    read: true,
    write: false,
    create: false,
  },
  'Content Management': {
    read: false,
    write: false,
    create: false,
  },
  'Displutes Management': {
    read: false,
    write: false,
    create: false,
  },
  'Database Management': {
    read: false,
    write: false,
    create: false,
  },
  'Financial Management': {
    read: false,
    write: false,
    create: false,
  },
  Reporting: { read: false, write: false, create: false },
  'API Control': {
    read: false,
    write: false,
    create: false,
  },
  'Repository Management': {
    read: false,
    write: false,
    create: false,
  },
  Payroll: { read: false, write: false, create: false },
}

const AddRoleModal = ({
  open,
  handleClose,
  onSubmit,
  isEdit,
}: Props) => {
  const { isMobileSize } = useWindowSize()

  const schema = yup.object().shape({
    roleName: yup
      .string()
      .required(requiredMsg('Role Name')),
    roleDescription: yup
      .string()
      .required(requiredMsg('Role Description')),
  })

  const {
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      roleName: '',
      roleDescription: '',
      permissions: initialPermissions,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const handleCheck = (
    permission: string,
    capability: 'read' | 'write' | 'create',
    checked: boolean,
  ) => {
    const currPermissions = getValues('permissions')

    currPermissions[permission][capability] = checked
    setValue('permissions', currPermissions)
  }

  const manageAll = (toggleAll: boolean) => {
    const currPermissions = getValues('permissions')

    Object.keys(currPermissions).forEach(permission => {
      currPermissions[permission] = {
        read: toggleAll,
        write: toggleAll,
        create: toggleAll,
      }
    })
    setValue('permissions', currPermissions)
  }

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={550}
    >
      <form onSubmit={onSubmit && handleSubmit(onSubmit)}>
        <Typography
          id='modal-modal-title'
          sx={{ mb: 5, fontSize: 18, fontWeight: 700 }}
        >
          {isEdit ? 'Edit' : 'Add'} New Role
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Controller
            name='roleName'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <CustomTextField
                fullWidth
                label='Role Name'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder='Administrator'
                error={Boolean(errors.roleName)}
                {...(errors.roleName && {
                  helperText: errors.roleName.message,
                })}
              />
            )}
          />

          <Controller
            name='roleDescription'
            control={control}
            rules={{ required: true }}
            render={({
              field: { value, onChange, onBlur },
            }) => (
              <CustomTextField
                fullWidth
                label='Role Description'
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder='Best for business owners and company administrators'
                error={Boolean(errors.roleDescription)}
                {...(errors.roleDescription && {
                  helperText:
                    errors.roleDescription.message,
                })}
              />
            )}
          />

          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: 16 }}
            >
              Role Permissions
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: isMobileSize
                  ? 'flex-start'
                  : 'center',
                justifyContent: 'space-between',
                flexDirection: isMobileSize
                  ? 'column'
                  : 'row',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Administrator Access
              </Typography>
              <Typography>
                <label>
                  <Checkbox
                    onChange={e => {
                      manageAll(e.target.checked)
                    }}
                  />
                  Select All
                </label>
              </Typography>
            </Box>

            {permissionsList.map((permission, i) => (
              <Box
                key={permission}
                sx={{
                  display: 'flex',
                  alignItems: isMobileSize
                    ? 'flex-start'
                    : 'center',
                  justifyContent: 'space-between',
                  flexDirection: isMobileSize
                    ? 'column'
                    : 'row',
                }}
              >
                <Typography>{permission}</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    id={'read' + i}
                    checked={
                      watch('permissions')[permission].read
                    }
                    onChange={e =>
                      handleCheck(
                        permission,
                        'read',
                        e.target.checked,
                      )
                    }
                  />
                  <label htmlFor={'read' + i}>Read</label>
                  <Checkbox
                    id={'write' + i}
                    checked={
                      watch('permissions')[permission].write
                    }
                    onChange={e =>
                      handleCheck(
                        permission,
                        'write',
                        e.target.checked,
                      )
                    }
                  />
                  <label htmlFor={'write' + i}>Write</label>
                  <Checkbox
                    id={'create' + i}
                    checked={
                      watch('permissions')[permission]
                        .create
                    }
                    onChange={e =>
                      handleCheck(
                        permission,
                        'create',
                        e.target.checked,
                      )
                    }
                  />
                  <label htmlFor={'create' + i}>
                    Create
                  </label>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Save
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default AddRoleModal
