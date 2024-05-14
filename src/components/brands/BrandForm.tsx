import {
  Box,
  Button,
  Card,
  Switch,
  Typography,
} from '@mui/material'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { requiredMsg } from 'src/utils/formUtils'
import PageContainer from 'src/components/global/PageContainer'
import ControlledInput from 'src/components/global/ControlledInput'

// import { useWindowSize } from 'src/hooks/useWindowSize'
// import ThumbnailCard from 'src/components/global/ThumbnailCard'
// import PublishStatusCard from 'src/components/global/PublishStatusCard'
// import AutomationCard from 'src/components/global/AutomationCard'
import { IBrand, IBrandNew } from 'src/models/IBrand'
import { useDeleteBrandMutation } from 'src/store/apis/productsSlice'
import {
  extractErrorMessage,
  hasErrorKey,
} from 'src/utils/apiUtils'
import Can from 'src/layouts/components/acl/Can'

// interface TempBrand {
//   id?: number
//   name: string
//   description?: string
//   status?: string
//   automation?: string
//   conditions?: any[]
//   automationKey?: any[]
//   automationCondition?: any[]
//   anyOrAll?: string
//   hide_product_costs?: boolean
// }

interface Props {
  isView?: boolean
  defaultValues?: IBrand
  onSubmit: (values: IBrandNew) => void
}

const TopLink = ({
  label,
  id,
}: {
  label: string
  id: string
}) => (
  <Typography
    variant='h5'
    sx={{ fontWeight: 600, color: '#a5a2ad' }}
  >
    <Link href={`#${id}`}>{label}</Link>
  </Typography>
)

const BrandForm = ({
  isView,
  defaultValues,
  onSubmit,
}: Props) => {
  const [deleteBrand] = useDeleteBrandMutation()

  // const { isWindowBelow, isMobileSize } = useWindowSize()
  // const [selectedImage, setSelectedImage] = useState<
  //   string | null
  // >(null)

  // const handleImageChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const imgUrl = URL.createObjectURL(file)
  //     setSelectedImage(imgUrl)
  //   }
  // }

  const router = useRouter()

  //   const resetImage = () => setSelectedImage(null)

  const schema = yup.object().shape({
    name: yup.string().required(requiredMsg('Brand Name')),
    description: yup.string().optional(),
    status: yup.string().optional(),

    // automation: yup.string().required(requiredMsg('Field')),
    // conditions: yup.array().optional(),

    // automationKey: yup.array().optional(),
    // automationCondition: yup.array().optional(),

    // anyOrAll: yup.string().optional(),
    hide_product_costs: yup.boolean().optional(),
  })

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      name: '',
      description: '',
      deleted: false,
      hide_product_costs: true,
      status: 0,
      ...defaultValues,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const deleteOrCancel = () => {
    if (defaultValues) {
      deleteBrand(defaultValues.id)
        .unwrap()
        .then((res: any) => {
          if (hasErrorKey((res as any) || {})) {
            toast.error(extractErrorMessage(res as any))
          } else {
            toast.success('Brand deleted successfully')
            router.push('/brands')
          }
        })
        .catch(() => {
          toast.error('An error occured')
        })
    } else {
      router.push('/brands')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageContainer
        breadcrumbs={[
          { label: 'Brands', to: '/brands' },
          {
            label: defaultValues ? 'Edit' : 'Add',
            to: '#',
          },
        ]}
      >
        <Card
          sx={{
            p: 4,
            mb: 4,
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: 5,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 5,

              // ml: !isMobileSize ? 10 : 0,
            }}
          >
            <TopLink label='General' id='general' />
            {/* <TopLink label='Automations' id='automation' /> */}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              disabled={isView}
              variant='contained'
              type='submit'
            >
              {defaultValues ? 'Update' : 'Save Brand'}
            </Button>

            <Can I='delete' a='brand'>
              <Button
                variant='tonal'
                color={
                  defaultValues ? 'error' : 'secondary'
                }
                onClick={deleteOrCancel}
              >
                {defaultValues ? 'Delete Brand' : 'Cancel'}
              </Button>
            </Can>
          </Box>
        </Card>

        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}
        >
          {/* <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              width: isWindowBelow(800) ? '100%' : 300,
              height: 'fit-content',
            }}
          >
            <ThumbnailCard
              img={selectedImage}
              onChange={handleImageChange}
            />

            <PublishStatusCard
              value={watch('status')}
              name='status'
              control={control}
              changeValues={vals =>
                setValue('status', vals)
              }
              error={errors.status}
            />
          </Box> */}

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 300,
              gap: 4,
            }}
          >
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
                id='general'
              >
                General
              </Typography>

              <Box>
                <ControlledInput
                  required
                  name='name'
                  control={control}
                  label='Brand Name'
                  error={errors.name}
                  placeholder='Brand Name'
                  readOnly={isView}
                />
                <Typography sx={{ color: '#979797' }}>
                  A brand name is required and recommended
                  to be unique
                </Typography>
              </Box>

              <Box>
                <ControlledInput
                  name='description'
                  control={control}
                  label='Description'
                  error={errors.description}
                  placeholder='Type here...'
                  multiline
                  readOnly={isView}
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a description for better visibility
                </Typography>
              </Box>

              <Box sx={{ mt: 5 }}>
                <Typography>Hide Products Costs</Typography>
                <Switch
                  sx={{ ml: -3 }}
                  value={watch('hide_product_costs')}
                  onChange={(_, checked) =>
                    setValue('hide_product_costs', checked)
                  }
                  disabled={isView}
                />
                <Typography sx={{ color: '#979797' }}>
                  Hide product costs to all users except
                  Administrators and Accounts
                </Typography>
              </Box>
            </Card>

            {/* <AutomationCard
              changeAutomation={val =>
                setValue('automation', val)
              }
              currentAutomation={watch('automation')}
              control={control}
              name='automation'
              conditions={watch('conditions') || []}
              changeConditions={val =>
                setValue('conditions', val)
              }
              anyOrAll={watch('anyOrAll')}
              changeAnyOrAll={val =>
                setValue('anyOrAll', val)
              }
              automationKey='automationKey'
              automationCondition='automationCondition'
              error={errors.automation}
            /> */}
          </Box>
        </Box>
      </PageContainer>
    </form>
  )
}

export default BrandForm
