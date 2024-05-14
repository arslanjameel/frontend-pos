import {
  Box,
  Button,
  Card,
  IconButton,
  Switch,
  Typography,
  capitalize,
} from '@mui/material'
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useWindowSize } from 'src/hooks/useWindowSize'
import fakeWeekWorkHours from 'src/@fake-db/weekWorkHours'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/store/hooks'
import { createUserStep2 } from 'src/store/reducers/userAccountsSlice'
import IWorkingHr from 'src/models/shared/IWorkingHr'
import IDay from 'src/models/shared/IDay'

interface Props {
  brief?: boolean
  headerShown?: boolean
  title?: string
  openEditModal?: () => void
  weekHoursData?: IWorkingHr[]
  onUpdate?: (values: IWorkingHr[]) => void
  actionBtns?: React.ReactNode
  useForm?: boolean
  prevNext?: boolean
  prevStep?: () => void
  nextStep?: () => void
}

const WeekWorkHours = ({
  headerShown = true,
  title = 'Work Week',
  openEditModal,
  brief,
  weekHoursData = fakeWeekWorkHours,
  onUpdate,
  actionBtns,
  useForm = false,
  prevNext = false,
  prevStep,
  nextStep,
}: Props) => {
  const { isMobileSize, isWindowBelow } = useWindowSize()

  const step2 = useAppSelector(
    state => state.userAccounts.createUserSteps.step2,
  )

  const [workHrs, setWorkHrs] = useState<IWorkingHr[]>(
    step2.length > 0 ? step2 : weekHoursData,
  )

  const dispatch = useAppDispatch()
  const saveAndNext = () => {
    dispatch(createUserStep2(workHrs))
    nextStep && nextStep()
  }

  const handleStatusChange = (
    dayOfWeek: string,
    value: boolean,
  ) => {
    const temp = workHrs.map(wh =>
      wh.day === dayOfWeek
        ? { ...wh, isActive: value }
        : wh,
    )
    setWorkHrs(temp)
  }

  const handleTimeChange = (
    dayOfWeek: string,
    startEnd: 'start' | 'end',
    value: string,
  ) => {
    const temp = workHrs.map(wh =>
      wh.day === dayOfWeek
        ? startEnd === 'start'
          ? { ...wh, startTime: value }
          : { ...wh, endTime: value }
        : wh,
    )
    setWorkHrs(temp)
  }

  const handleCopyToAll = (dayOfWeek: string) => {
    const timeSet = workHrs.find(wh => wh.day === dayOfWeek)
    if (timeSet) {
      const temp = workHrs.map(wh =>
        wh.isActive
          ? {
              ...wh,
              startTime: timeSet.startTime,
              endTime: timeSet.endTime,
            }
          : wh,
      )
      setWorkHrs(temp)
    }
  }

  const { primaryLight } = UseBgColor()

  const TimeCell = ({
    info,
    disabled,
  }: {
    info: IWorkingHr
    disabled?: boolean
  }) => (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <CustomTextField
        type='time'
        value={info.startTime}
        onChange={newTime =>
          handleTimeChange(
            info.day,
            'start',
            newTime.target.value,
          )
        }
        disabled={disabled}
      />
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
        TO
      </Typography>

      <CustomTextField
        type='time'
        value={info.endTime}
        onChange={newTime =>
          handleTimeChange(
            info.day,
            'end',
            newTime.target.value,
          )
        }
        disabled={disabled}
      />
    </Box>
  )

  const CopyTime = ({
    dayOfWeek,
  }: {
    dayOfWeek: string
  }) => (
    <Card
      onClick={() => handleCopyToAll(dayOfWeek)}
      sx={{
        p: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: primaryLight.color,
        ...primaryLight,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: 'fit-content',
        cursor: 'pointer',
      }}
    >
      <Icon icon='tabler:copy' />
      {!isWindowBelow(800) && 'Copy time to all days'}
    </Card>
  )

  const WorkWeekInputs = () => (
    <>
      {headerShown && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, fontSize: 17 }}
          >
            {title}
          </Typography>
          {openEditModal && (
            <IconButton onClick={openEditModal}>
              <Icon icon='tabler:dots-vertical' />
            </IconButton>
          )}
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        {workHrs.map((wh, i) => (
          <Box
            key={wh.day}
            sx={{
              minHeight: 55,
              display: 'flex',
              flexDirection: isMobileSize
                ? 'column'
                : 'row',
              alignItems: isMobileSize
                ? 'flex-start'
                : 'center',
              rowGap: 2,
              pb: isMobileSize ? 5 : 0,
              borderBottom: isMobileSize
                ? '1.5px solid rgba(230,230,230,0.7)'
                : '',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Typography sx={{ minWidth: 90 }}>
                {capitalize(wh.day.toLocaleLowerCase())}
              </Typography>

              {!brief && (
                <Box
                  sx={{
                    minWidth: 120,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Switch
                    checked={wh.isActive}
                    onChange={(_, checked) =>
                      handleStatusChange(wh.day, checked)
                    }
                  />
                  {wh.isActive ? 'Open' : 'Closed'}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              {wh.isActive ? (
                <TimeCell info={wh} disabled={brief} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  --{' '}
                </Box>
              )}
              {!brief &&
                i === 0 &&
                wh.startTime &&
                wh.endTime &&
                wh.isActive && (
                  <CopyTime dayOfWeek={wh.day} />
                )}
            </Box>
          </Box>
        ))}
      </Box>
      {actionBtns && actionBtns}
      {prevNext && (
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
            disabled={false}
            onClick={prevStep}
          >
            Previous
          </Button>
          <Button
            variant='contained'
            endIcon={<Icon icon='tabler:arrow-right' />}
            disabled={false}
            onClick={saveAndNext}
          >
            Next
          </Button>
        </Box>
      )}
    </>
  )

  const isDayHrsSet = useCallback(
    (day: IDay) => {
      if (weekHoursData) {
        const _res = weekHoursData.find(
          whd => whd.day === day,
        )

        if (_res) return _res
      }

      return false
    },
    [weekHoursData],
  )

  useEffect(() => {
    if (weekHoursData) {
      const _weekHoursData = fakeWeekWorkHours.map(wwh => {
        const _dayInfo = isDayHrsSet(wwh.day)
        if (_dayInfo) return _dayInfo

        return wwh
      })
      setWorkHrs(_weekHoursData)
    }
  }, [weekHoursData, isDayHrsSet])

  return !useForm ? (
    <WorkWeekInputs />
  ) : (
    <form
      onSubmit={e => {
        e.preventDefault()

        onUpdate && onUpdate(workHrs)
      }}
    >
      <WorkWeekInputs />
    </form>
  )
}

export default WeekWorkHours
