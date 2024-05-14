import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  capitalize,
} from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useAuth } from 'src/hooks/useAuth'
import {
  useGetStoresQuery,
  useGetUserTypesQuery,
} from 'src/store/apis/accountSlice'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { createUserStep3 } from 'src/store/reducers/userAccountsSlice'
import useGetAvailableRoles from 'src/utils/rolesUtils'

interface Props {
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  prevStep: () => void
}

const RolesStores = ({
  isFirstStep,
  isLastStep,
  nextStep,
  prevStep,
}: Props) => {
  const { user } = useAuth()

  const { data: availableStores } = useGetStoresQuery()
  const { data: roles } = useGetUserTypesQuery()
  const { getRoles } = useGetAvailableRoles(
    roles ? roles.results : [],
  )

  const dispatch = useAppDispatch()
  const step3 = useAppSelector(
    state => state.userAccounts.createUserSteps.step3,
  )

  const { primaryLight } = UseBgColor()
  const [role, setRole] = useState<number>(step3.role || 0)
  const [stores, setStores] = useState<number[]>(
    step3.stores,
  )

  const Role = ({ value = 0, title = '', desc = '' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 3,
        borderBottomWidth: 2,
        borderBottomStyle: 'dashed',
        borderBottomColor: '#dfdfdf8e',
        pb: 2,
        mb: 3,
      }}
    >
      <FormControlLabel
        label={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {capitalize(title)}
            </Typography>
            <Typography>{desc}</Typography>
          </Box>
        }
        value={value}
        control={<Radio value={value} />}
      />
    </Box>
  )

  const Store = ({
    title = '',
    checked = false,
    onChange,
  }: {
    title: string
    checked: boolean
    onChange: (newValue: boolean) => void
  }) => (
    <Grid item md={4} sm={6} xs={12}>
      <label htmlFor={title}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
          }}
        >
          <Image
            src='/images/store.png'
            alt='purple-store'
            width={40}
            height={40}
          />
          <Typography fontWeight={600} textAlign='center'>
            {title}
          </Typography>
          <Checkbox
            id={title}
            name={title}
            checked={checked}
            onChange={e => {
              onChange(e.target.checked)
            }}
          />
        </Box>
      </label>
    </Grid>
  )

  return (
    <Box>
      <Grid
        container
        columns={12}
        spacing={4}
        sx={{ pb: 5 }}
      >
        <Grid item md={6} sm={12} xs={12}>
          <Typography fontWeight={600} fontSize={20} mb={4}>
            Roles
          </Typography>

          <RadioGroup
            name='role'
            defaultValue={role}
            onChange={e => setRole(Number(e.target.value))}
          >
            {getRoles(user?.user_type || '').map(role => (
              <Role
                key={role.id}
                value={role.id}
                title={role.type}
                desc={role.description}
              />
            ))}
          </RadioGroup>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Typography fontWeight={600} fontSize={20} mb={4}>
            Stores
          </Typography>

          <Box>
            <FormLabel id='select-all'>
              <Card
                sx={{
                  pl: 1,
                  pr: 4,
                  py: 0,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: primaryLight.color,
                  ...primaryLight,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: 'fit-content',
                  margin: 'auto',
                }}
              >
                <Checkbox
                  id='select-all'
                  name='select-all'
                  onChange={e => {
                    if (e.target.checked) {
                      setStores(
                        availableStores
                          ? availableStores.results.map(
                              (s: any) => s.id,
                            )
                          : [],
                      )
                    } else {
                      setStores([])
                    }
                  }}
                />
                Select All Stores
              </Card>
            </FormLabel>
          </Box>

          <Grid container columns={12} sx={{ p: 2 }}>
            {!availableStores
              ? []
              : availableStores.results.map((store: any) => (
                  <Store
                    key={store.id}
                    title={store.name}
                    checked={stores.includes(store.id)}
                    onChange={newValue => {
                      let _temp = [...stores]
                      if (newValue) {
                        _temp.push(store.id)
                      } else {
                        _temp = _temp.filter(
                          s => s !== store.id,
                        )
                      }
                      setStores(_temp)
                    }}
                  />
                ))}
          </Grid>
        </Grid>
      </Grid>

      <Box
        sx={{
          pt: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          variant='contained'
          startIcon={<Icon icon='tabler:arrow-left' />}
          disabled={isFirstStep}
          onClick={prevStep}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          endIcon={<Icon icon='tabler:arrow-right' />}
          disabled={isLastStep}
          onClick={() => {
            dispatch(createUserStep3({ role, stores }))
            nextStep()
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}

export default RolesStores
