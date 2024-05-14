import {
  Box,
  Button,
  Card,

  // IconButton,
  Typography,
} from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { requiredMsg } from 'src/utils/formUtils'
import PageContainer from 'src/components/global/PageContainer'
import ControlledInput from 'src/components/global/ControlledInput'
import { ICategory } from 'src/@fake-db/categories'
import { deleteCategory } from 'src/store/reducers/categoriesSlice'
import { useAppDispatch } from 'src/store/hooks'

// import { Icon } from '@iconify/react'
// import UseBgColor from 'src/@core/hooks/useBgColor'
// import { useModal } from 'src/hooks/useModal'
// import SubCategoryModal from '../global/Modals/SubCategoryModal'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// import AppSelect from '../global/AppSelect'
// import { useWindowSize } from 'src/hooks/useWindowSize'
// import ThumbnailCard from 'src/components/global/ThumbnailCard'
// import PublishStatusCard from 'src/components/global/PublishStatusCard'
// import AutomationCard from 'src/components/global/AutomationCard'

interface TempCategory {
  id?: number
  name: string
  children?: any[]
  description?: string
  parent_category?: null | number

  // metaTagTitle?: string
  // metaTagDescription?: string
  // metaTagKeywords?: string

  // automation?: 0 | 1
  // conditions?: any[]

  // automationKey?: any[]
  // automationCondition?: any[]

  anyOrAll?: string
}

interface Props {
  isView?: boolean
  defaultValues?: ICategory
  onSubmit: (values: TempCategory) => void
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

const CategoryForm = ({
  isView,
  defaultValues,
  onSubmit,
}: Props) => {
  const ability = useContext(AbilityContext)

  // const id = new Date().getTime()

  // const { isWindowBelow, isMobileSize } = useWindowSize()
  // const [selectedImage, setSelectedImage] = useState<
  //   string | null
  // >(null)
  // const { primaryFilled, primaryLight } = UseBgColor()

  // const { openModal, closeModal, isModalOpen } =
  //   useModal<any>()

  // const [subCategoryData, setSubCategoryData] =
  //   useState<any>({
  //     id: 0,
  //     name: '',
  //     description: '',
  //   })

  // const [subCategories, setSubCategories] = useState<
  //   {
  //     id: number
  //     name: string
  //     description: string
  //   }[]
  // >([])

  const router = useRouter()
  const dispatch = useAppDispatch()

  // const handleImageChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const imgUrl = URL.createObjectURL(file)
  //     setSelectedImage(imgUrl)
  //   }
  // }

  //   const resetImage = () => setSelectedImage(null)

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(requiredMsg('Category Name')),
    description: yup.string().optional().default(''),

    // children: yup.array().optional(),
    // metaTagTitle: yup.string().optional(),
    // metaTagDescription: yup.string().optional(),
    // metaTagKeywords: yup.string().optional(),

    // automation: yup.string().required(requiredMsg('Field')),
    // conditions: yup.array().optional(),

    // automationKey: yup.array().optional(),
    // automationCondition: yup.array().optional(),

    // anyOrAll: yup.string().optional(),
    // hideProductCosts: yup.boolean().optional(),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    values: {
      name: '',
      description: '',
      children: [],
      ...defaultValues,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (defaultValues) {
      setValue(
        'description',
        defaultValues?.description || '',
      )
    }
  }, [defaultValues])

  const onSubmitHandler = (data: any) => {
    // data.children = subCategories
    console.log('data', data)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <PageContainer
        breadcrumbs={[
          { label: 'Categories', to: '/categories' },
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
            {/* <TopLink
              label='Meta Options'
              id='metaOptions'
            />
            <TopLink label='Automations' id='automation' /> */}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              disabled={isView}
              variant='contained'
              type='submit'
            >
              Save Category
            </Button>

            <Button
              variant='tonal'
              color={
                defaultValues &&
                ability.can('delete', 'category')
                  ? 'error'
                  : 'secondary'
              }
              onClick={() => {
                router.push('/categories')
                if (
                  defaultValues &&
                  ability.can('delete', 'category')
                ) {
                  dispatch(deleteCategory(defaultValues.id))
                  toast.success(
                    'Category Deleted Successfully',
                  )
                }
              }}
            >
              {defaultValues &&
              ability.can('delete', 'category')
                ? 'Delete Category'
                : 'Cancel'}
            </Button>
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
              value={watch('categoryStatus')}
              name='categoryStatus'
              control={control}
              changeValues={vals =>
                setValue('categoryStatus', vals)
              }
              error={errors.categoryStatus}
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
                  label='Category Name'
                  error={errors.name}
                  placeholder='Category Name'
                  readOnly={
                    defaultValues &&
                    ability.cannot('update', 'category')
                  }
                />
                <Typography sx={{ color: '#979797' }}>
                  A category name is required and
                  recommended to be unique
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
                  readOnly={
                    defaultValues &&
                    ability.cannot('update', 'category')
                  }
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a description for better visibility
                </Typography>
              </Box>

              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: 17 }}
                  id='general'
                >
                  Sub Categories
                </Typography>
                <IconButton
                  size='small'
                  color='primary'
                  sx={{
                    backgroundColor: primaryFilled,
                    '&:hover': { ...primaryLight },
                  }}
                  onClick={() => openModal({ open: true })}
                >
                  <Icon icon='tabler:plus' />
                </IconButton>
              </Box>
              {subCategories.length == 0 ? (
                <Card
                  variant='outlined'
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography>No Sub Category</Typography>
                </Card>
              ) : (
                <Box>
                  <Card variant='outlined'>
                    {subCategories.map((e, i) => (
                      <Box
                        key={e.id}
                        sx={{
                          px: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                          borderBottom:
                            subCategories.length - 1 !== i
                              ? '1px solid rgba(47, 43, 61, 0.16)'
                              : 'none',
                        }}
                        width={'100%'}
                      >
                        <Box sx={{ flex: 1, py: 2 }}>
                          <Typography
                            sx={{ fontWeight: 600 }}
                          >
                            {e.name}
                          </Typography>
                          <Typography sx={{ fontSize: 14 }}>
                            {e.description}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              setSubCategoryData(e)
                              openModal({ open: true })
                            }}
                            color='primary'
                          >
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              setSubCategories(
                                subCategories.filter(
                                  sub => sub.id !== e.id,
                                ),
                              )
                            }
                            color='error'
                          >
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Card>
                </Box>
              )} */}

              {/* <Box sx={{ mt: 5 }}>
                <Typography>Hide Products Costs</Typography>
                <Switch
                  sx={{ ml: -3 }}
                  value={watch('hideProductCosts')}
                  onChange={(_, checked) =>
                    setValue('hideProductCosts', checked)
                  }
                />
                <Typography sx={{ color: '#979797' }}>
                  Hide product costs to all users except
                  Administrators and Accounts
                </Typography>
              </Box> */}
            </Card>

            {/* <Card
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: 17 }}
                id='metaOptions'
              >
                Meta Options
              </Typography>

              <Box>
                <ControlledInput
                  name='metaTagTitle'
                  control={control}
                  label='Meta Tag Title'
                  error={errors.metaTagTitle}
                  placeholder='Type here...'
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a meta tag title. recommended to be
                  simple and precise keywords.
                </Typography>
              </Box>

              <Box>
                <ControlledInput
                  name='metaTagDescription'
                  control={control}
                  label='Meta Tag Description'
                  error={errors.metaTagDescription}
                  placeholder='Type here...'
                  multiline
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a meta tag description to the category
                  for increased SEO ranking.
                </Typography>
              </Box>

              <Box>
                <ControlledInput
                  name='metaTagKeywords'
                  control={control}
                  label='Meta Tag Description'
                  error={errors.metaTagKeywords}
                  placeholder='Type here...'
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a list of keywords that the category
                  is related to. Separate the keywords with
                  a comma
                </Typography>
              </Box>
            </Card> */}

            {/* <AutomationCard
              changeAutomation={val =>
                setValue('automation', val === '0' ? 0 : 1)
              }
              currentAutomation={watch(
                'automation',
              )?.toString()}
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
            /> */}
          </Box>
        </Box>
      </PageContainer>

      {/* <SubCategoryModal
        open={isModalOpen()}
        handleClose={() => {
          closeModal()
          setSubCategoryData({
            id: 0,
            name: '',
            description: '',
          })
        }}
        onSubmit={values => {
          if (values.id == 0) {
            setSubCategories([
              ...subCategories,
              { ...values, id: id },
            ])
          } else {
            setSubCategories(
              subCategories.map(sub => {
                if (sub.id == values.id) {
                  return values
                } else {
                  return sub
                }
              }),
            )
          }
          closeModal()
          setSubCategoryData({
            id: 0,
            name: '',
            description: '',
          })
        }}
        data={subCategoryData}
      /> */}
    </form>
  )
}

export default CategoryForm
