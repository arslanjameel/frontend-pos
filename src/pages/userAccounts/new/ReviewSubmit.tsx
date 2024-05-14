// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  capitalize,
} from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import Accordion from 'src/components/Accordion'
import UserInfo from 'src/components/userAccounts/UserInfo'
import WeekWorkHours from 'src/components/userAccounts/WeekWorkHours'
import UseBgColor from 'src/@core/hooks/useBgColor'
import {
  useAppSelector,
  useAppDispatch,
} from 'src/store/hooks'
import { useRegisterUserMutation } from 'src/store/apis/authSlice'
import {
  accountApi,
  useGetStoresQuery,
  useGetUserTypesQuery,
} from 'src/store/apis/accountSlice'
import { clearUserInfo } from 'src/store/reducers/userAccountsSlice'
import { extractFirstErrorMessage } from 'src/utils/apiUtils'

interface Props {
  isFirstStep: boolean
  isLastStep: boolean
  prevStep: () => void
}

const ReviewSubmit = ({ isFirstStep, prevStep }: Props) => {
  const { data: stores } = useGetStoresQuery()
  const { data: roles } = useGetUserTypesQuery()
  const [registerUser, { isLoading }] =
    useRegisterUserMutation()

  const dispatch = useAppDispatch()

  const { createUserSteps } = useAppSelector(
    state => state.userAccounts,
  )
  const router = useRouter()
  const { primaryLight } = UseBgColor()

  const [expanded, setExpanded] = useState(1)

  const handleChange =
    (panel: number) =>
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : 0)
    }

  return (
    <>
      <Box>
        <Accordion.Accordion
          expanded={expanded === 1}
          onChange={handleChange(1)}
        >
          <Accordion.AccordionSummary
            expandIcon={<Icon icon='tabler:chevron-down' />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Typography fontWeight={700} fontSize={20}>
              User Details
            </Typography>
          </Accordion.AccordionSummary>
          <Accordion.AccordionDetails>
            <UserInfo
              isView
              brief
              defaultValues={createUserSteps.step1}
              headerShown={false}
            />
          </Accordion.AccordionDetails>
        </Accordion.Accordion>

        {/**
         *
         * Work  hours
         */}

        <Accordion.Accordion
          expanded={expanded === 2}
          onChange={handleChange(2)}
        >
          <Accordion.AccordionSummary
            expandIcon={<Icon icon='tabler:chevron-down' />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Typography fontWeight={700} fontSize={20}>
              Work Hours
            </Typography>
          </Accordion.AccordionSummary>
          <Accordion.AccordionDetails>
            <Box>
              <WeekWorkHours
                brief
                weekHoursData={createUserSteps.step2}
              />
            </Box>
          </Accordion.AccordionDetails>
        </Accordion.Accordion>

        {/**
         *
         * Roles and Stores
         */}

        <Accordion.Accordion
          expanded={expanded === 3}
          onChange={handleChange(3)}
        >
          <Accordion.AccordionSummary
            expandIcon={<Icon icon='tabler:chevron-down' />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Typography fontWeight={700} fontSize={20}>
              Roles & Stores
            </Typography>
          </Accordion.AccordionSummary>
          <Accordion.AccordionDetails>
            <Grid
              container
              columns={12}
              spacing={4}
              sx={{ gap: 10 }}
            >
              <Grid item md={6} sm={12} xs={12}>
                <Card
                  sx={{
                    p: 7,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: primaryLight.color,
                    backgroundColor:
                      primaryLight.backgroundColor,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    width: 'fit-content',
                    height: 'fit-content',
                  }}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={17}
                    color={primaryLight.color}
                    textAlign='center'
                  >
                    {roles
                      ? capitalize(
                          roles.results.find(
                            r =>
                              r.id ===
                              createUserSteps.step3.role,
                          )?.type || '',
                        )
                      : 'user_type'}
                  </Typography>
                  <Typography
                    color={primaryLight.color}
                    textAlign='center'
                  >
                    {roles
                      ? roles.results.find(
                          r =>
                            r.id ===
                            createUserSteps.step3.role,
                        )?.description
                      : 'user_type_description'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  {createUserSteps.step3.stores.map(
                    store => (
                      <Card
                        key={store}
                        sx={{
                          height: 110,
                          maxWidth: 180,
                          width: '100%',
                          borderWidth: 1.5,
                          borderStyle: 'dashed',
                          borderColor: primaryLight.color,
                          backgroundColor:
                            primaryLight.backgroundColor,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 2,
                          px: 4,
                        }}
                      >
                        <Image
                          src='/images/store.png'
                          alt='purple-store'
                          width={40}
                          height={40}
                        />
                        <Typography fontWeight={600}>
                          {stores
                            ? stores.results.find(
                                s => s.id === store,
                              ).name
                            : 'Store'}
                        </Typography>
                      </Card>
                    ),
                  )}
                </Box>
              </Grid>
            </Grid>
          </Accordion.AccordionDetails>
        </Accordion.Accordion>

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
            onClick={() =>
              expanded === 1
                ? prevStep()
                : setExpanded(expanded - 1)
            }
          >
            Previous
          </Button>
          <Button
            disabled={isLoading}
            variant='contained'
            endIcon={<Icon icon='tabler:arrow-right' />}
            onClick={() => {
              if (expanded !== 3) {
                setExpanded(expanded + 1)
              } else {
                registerUser({
                  address:
                    createUserSteps.step1.address || '',
                  city: createUserSteps.step1.city || 1,
                  country:
                    createUserSteps.step1.country || 1,
                  email: createUserSteps.step1.email,
                  first_name:
                    createUserSteps.step1.first_name,
                  last_name:
                    createUserSteps.step1.last_name,
                  mobile: createUserSteps.step1.mobile,
                  password: createUserSteps.step1.password,
                  pin_code: createUserSteps.step1.pin_code,
                  stores: createUserSteps.step3.stores,
                  user_type: createUserSteps.step3.role,
                  working_hours: createUserSteps.step2,
                  postalCode:
                    createUserSteps.step1.postalCode,
                })
                  .unwrap()
                  .then(() => {
                    toast.success(
                      'User created successfully',
                    )
                    router.replace('/userAccounts')

                    dispatch({
                      type: `${accountApi.reducerPath}/invalidateTags`,
                      payload: ['User'],
                    })
                    dispatch(clearUserInfo())
                  })
                  .catch(e => {
                    toast.error(
                      extractFirstErrorMessage(e?.data),
                    )
                  })
              }
            }}
          >
            {expanded === 3 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default ReviewSubmit
