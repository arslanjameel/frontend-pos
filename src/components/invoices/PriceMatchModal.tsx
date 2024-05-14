import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from '@mui/material'

import AppModal from '../global/AppModal'
import Icon from 'src/@core/components/icon'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { formatCurrency } from 'src/utils/formatCurrency'
import ControlledInput from '../global/ControlledInput'
import { requiredMsg } from 'src/utils/formUtils'
import { useWindowSize } from 'src/hooks/useWindowSize'
import UncontrolledInput from '../global/UncontrolledInput'
import { isUserAManager } from 'src/utils/rolesUtils'
import { useAuth } from 'src/hooks/useAuth'
import { includeVAT, numTo2dp } from 'src/utils/dataUtils'

interface IFormData {
  competitor_price: number
  new_price: number
  competitor_link: string
  notes: string
  product: number
}

interface Props {
  open: boolean
  handleClose: () => void
  priceMatchInfo: any
  onSubmit: (values: IFormData) => void
}

const PriceMatchModal = ({
  open,
  handleClose,
  priceMatchInfo,
  onSubmit,
}: Props) => {
  const { user } = useAuth()

  const { isMobileSize } = useWindowSize()
  const { primaryFilled } = UseBgColor()

  const schema = yup.object().shape({
    competitor_price: yup
      .number()
      .required(requiredMsg('Price')),
    new_price: yup.number().required(requiredMsg('Price')),
    competitor_link: yup
      .string()
      .required(requiredMsg('Link')),
    notes: yup.string().required(requiredMsg('Notes')),
  })

  const {
    watch,
    control,
    trigger,
    reset,
    setValue,

    formState: { isValid, errors },
  } = useForm<IFormData>({
    defaultValues: schema.getDefault(),
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const _handleSubmit = () => {
    trigger().then(() => {
      const vals = watch()
      vals.product = priceMatchInfo.id
      if (isValid) {
        onSubmit(vals)
        reset()
      }
    })
  }

  const ItemCon = ({
    icon,
    title,
    value,
    active = false,
  }: {
    icon: string
    title: string
    value: string
    active?: boolean
  }) => (
    <Box
      sx={{ display: 'flex', gap: 3, alignItems: 'center' }}
    >
      <Box
        sx={{
          background: active
            ? primaryFilled.backgroundColor
            : '#eaeaea',
          color: active ? '#fff' : '#808080',
          width: 42,
          height: 42,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon icon={icon} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 13.5, opacity: 0.7 }}>
          {title}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <AppModal
      open={open}
      handleClose={handleClose}
      maxWidth={660}
      title='Price Match'
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          rowGap: 8,
          px: isMobileSize ? 0 : 11,
          pb: 6,
        }}
      >
        <Box
          sx={{
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <ItemCon
            icon='tabler:box'
            title='SKU'
            value={priceMatchInfo.sku}
            active
          />
          <ItemCon
            icon='tabler:database'
            title='NAME'
            value={priceMatchInfo.product_name}
          />
          <ItemCon
            icon='tabler:database'
            title='BRAND'
            value={priceMatchInfo.product_name}
          />
          <ItemCon
            icon='tabler:credit-card'
            title='PRICE'
            value={formatCurrency(
              includeVAT(
                numTo2dp(Number(priceMatchInfo.base_price)),
              ),
            )}
          />
        </Box>

        <Divider
          orientation='vertical'
          flexItem
          sx={{ display: isMobileSize ? 'none' : 'block' }}
        />

        <Box sx={{ flex: 1 }}>
          <Grid container columns={12} spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <UncontrolledInput
                label='Competitors Price'
                error={errors.competitor_price}
                placeholder='23'
                value={
                  watch('competitor_price') !== 0
                    ? watch('competitor_price')
                    : ''
                }
                inputType='number'
                onChange={newVal =>
                  setValue(
                    'competitor_price',
                    parseFloat(Number(newVal).toFixed(2)),
                  )
                }
                onBlur={() => trigger('competitor_price')}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <UncontrolledInput
                label='New Product Price'
                error={errors.new_price}
                placeholder='23'
                value={
                  watch('new_price') !== 0
                    ? watch('new_price')
                    : ''
                }
                inputType='number'
                onChange={newVal =>
                  setValue(
                    'new_price',
                    parseFloat(Number(newVal).toFixed(2)),
                  )
                }
                onBlur={() => trigger('new_price')}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='competitor_link'
                control={control}
                label='Competitor Link'
                error={errors.competitor_link}
                placeholder='https://text.com'
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <ControlledInput
                name='notes'
                control={control}
                label='Notes'
                error={errors.notes}
                placeholder='Notes'
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant='contained'
              onClick={_handleSubmit}
            >
              {isUserAManager(user)
                ? 'Submit'
                : 'Request Manager Approval'}
            </Button>
          </Box>
        </Box>
      </Box>
    </AppModal>
  )
}

export default PriceMatchModal
