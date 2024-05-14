import {
  Box,
  Button,
  Card,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'

import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSelect from './AppSelect'

interface IAutomationCondition {
  id: number
  automationKey: number
  automationCondition: number
  automationValue: any
}

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T, any>
  disabled?: boolean
  error?: any
  currentAutomation?: string
  changeAutomation: (vals: string) => any

  conditions: IAutomationCondition[]
  changeConditions: (vals: IAutomationCondition[]) => void

  anyOrAll?: string
  changeAnyOrAll: (val: string) => void

  automationKey: Path<T>
  automationCondition: Path<T>
}

const AutomationCard = <T extends FieldValues>({
  name,

  // control,
  currentAutomation,
  changeAutomation,
  conditions,
  changeConditions,

  anyOrAll,
  changeAnyOrAll,

  // automationKey,
  // automationCondition,
  error,
}: Props<T>) => {
  const { errorLight } = UseBgColor()
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
              {title}
            </Typography>
            <Typography>{desc}</Typography>
          </Box>
        }
        value={title}
        control={<Radio value={value} />}
      />
    </Box>
  )

  return (
    <Card
      sx={{
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 17 }}
        id='automation'
      >
        Automation
      </Typography>
      <Typography sx={{ color: '#979797' }}>
        Product assignment method
      </Typography>
      <Box>
        <RadioGroup
          value={Number(currentAutomation)}
          name={name}
          onChange={e => changeAutomation(e.target.value)}
        >
          {[
            {
              value: 0,
              title: 'Manual',
              desc: 'Add producsts to this category by manually selecting this category during product creaton or update.',
            },
            {
              value: 1,
              title: 'Automatic',
              desc: 'Products matched with the following conditions will be automatically assigned to this category.',
            },
          ].map(role => (
            <Role
              value={role.value}
              key={role.title}
              title={role.title}
              desc={role.desc}
            />
          ))}
        </RadioGroup>
      </Box>
      {currentAutomation === '1' && (
        <Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: 17 }}
          >
            Conditions
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Typography>Products must match:</Typography>
            <RadioGroup
              name='conditions'
              value={Number(anyOrAll) || 0}
              onChange={e => changeAnyOrAll(e.target.value)}
              sx={{
                display: 'flex',
                gap: 6,
                flexDirection: 'row',
              }}
            >
              <FormControlLabel
                label={
                  <Typography>All Conditions</Typography>
                }
                value={1}
                control={<Radio value={1} />}
              />
              <FormControlLabel
                label={
                  <Typography>Any Conditions</Typography>
                }
                value={0}
                control={<Radio value={0} />}
              />
            </RadioGroup>
          </Box>

          {conditions.map((c, i) => (
            <Box
              sx={{ display: 'flex', gap: 5, my: 2 }}
              key={i}
            >
              <Box sx={{ flex: 1 }}>
                <AppSelect
                  label=''
                  placeholder='Choose...'
                  value={c.automationKey}
                  handleChange={e => {
                    const newVal = e.target.value
                    let currentValues = conditions
                    currentValues = currentValues.map(v =>
                      c.id === v.id
                        ? {
                            ...v,
                            automationKey: Number(newVal),
                          }
                        : v,
                    )
                    changeConditions(currentValues)
                  }}
                  options={[
                    { label: 'Product Tag', value: 0 },
                    { label: 'Price', value: 1 },
                  ]}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AppSelect
                  label=''
                  placeholder='Choose...'
                  value={c.automationKey}
                  handleChange={e => {
                    const newVal = e.target.value
                    let currentValues = conditions
                    currentValues = currentValues.map(v =>
                      c.id === v.id
                        ? {
                            ...v,
                            automationCondition:
                              Number(newVal),
                          }
                        : v,
                    )
                    changeConditions(currentValues)
                  }}
                  options={[
                    { label: 'is equal to', value: 0 },
                    { label: 'is greater than', value: 1 },
                  ]}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <CustomTextField
                  type='text'
                  fullWidth
                  label=''
                  value={c.automationValue}
                  onChange={event => {
                    let currentValues = conditions
                    currentValues = currentValues.map(v =>
                      c.id === v.id
                        ? {
                            ...v,
                            automationValue:
                              event.target.value,
                          }
                        : v,
                    )
                    changeConditions(currentValues)
                  }}
                  placeholder={''}

                  // error={Boolean(error)}
                  // {...(error && { helperText: error.message })}
                />
              </Box>
              <IconButton
                color='error'
                sx={{
                  ...errorLight,
                  borderRadius: '9px !important',
                  '&:hover': {
                    ...errorLight,
                  },
                }}
                onClick={() => {
                  changeConditions(
                    conditions.filter(v => v.id !== c.id),
                  )
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          ))}

          <Button
            variant='tonal'
            color='primary'
            startIcon={<Icon icon='tabler:plus' />}
            sx={{ marginTop: 10 }}
            onClick={() => {
              changeConditions([
                ...conditions,
                {
                  id: Date.now(),
                  automationKey: 0,
                  automationCondition: 0,
                  automationValue: '',
                },
              ])
            }}
          >
            Add Another Condition
          </Button>
        </Box>
      )}
      {error && (
        <Typography color='error'>
          {error.message || ''}
        </Typography>
      )}
    </Card>
  )
}

export default AutomationCard
