// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: Caused by: changeVariations error

import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { requiredMsg } from 'src/utils/formUtils'
import PageContainer from 'src/components/global/PageContainer'
import { useWindowSize } from 'src/hooks/useWindowSize'
import ControlledInput from 'src/components/global/ControlledInput'
import PricesCard from 'src/components/products/PricesCard'
import CreationDetailsCard from 'src/components/products/CreationDetailsCard'
import StockCard from 'src/components/products/StockCard'

// import ProductVariations from 'src/components/products/ProductVariations'
// import ThumbnailCard from 'src/components/global/ThumbnailCard'
// import TagsDropdown from '../global/TagsDropdown'
import SupplierCostCard from 'src/components/products/SupplierCostCard'
import AppSelect from '../global/AppSelect'
import { IProductNew } from 'src/models/IProduct'
import { useAuth } from 'src/hooks/useAuth'
import {
  useSearchCategoryQuery,

  // useSearchSubCategoryQuery,
} from 'src/store/apis/categorySlice'
import { useGetBrandsQuery } from 'src/store/apis/productsSlice'
import {
  IProductPurchase,
  IProductStock,
  IProductSupplier,
} from 'src/types/IProducts'
import { useGetStoresQuery } from 'src/store/apis/accountSlice'

interface Props {
  defaultValues?: IProductNew
  onSubmit: (values: IProductNew) => void
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

const ProductsForm = ({
  defaultValues,
  onSubmit,
}: Props) => {
  const { user } = useAuth()
  const router = useRouter()
  const { isWindowBelow, isMobileSize } = useWindowSize()

  const { data: categories } = useSearchCategoryQuery('')
  const { data: brands } = useGetBrandsQuery()

  const uid = new Date().getTime()
  const { data: stores } = useGetStoresQuery()
  const [hideCost, setHideCost] = useState<boolean>(false)
  const [unitCost, setUnitCost] = useState<number>(0)
  const [storesData, setStoresData] = useState<any>([])
  const [stocks, setStocks] = useState<IProductStock[]>([])
  const [purchase, setPurchase] = useState<
    IProductPurchase[]
  >([
    {
      id: uid,
      quantity: 0,
      supplier: 0,
      date: '',
      cost: 0,
    },
  ])
  const [suppliers, setSuppliers] = useState<
    IProductSupplier[]
  >([
    {
      id: uid,
      supplier_cost: '',
      supplier_sku: '',
      default: true,
      supplier: 0,
    },
  ])

  const calculateAverageCost = (
    stocks: IProductStock[],
  ): string => {
    let totalCost = 0
    let totalQuantity = 0

    stocks.forEach(stock => {
      totalCost += stock.unit_cost * stock.quantity
      totalQuantity += stock.quantity
    })

    return (totalCost / totalQuantity).toFixed(2)
  }

  //   const resetImage = () => setSelectedImage(null)

  const schema = yup.object().shape({
    productStatus: yup
      .string()
      .required(requiredMsg('Status')),
    brand: yup.string().required(requiredMsg('Brand')),
    category: yup
      .string()
      .required(requiredMsg('Category')),

    // subCategory: yup.number().optional(),
    tags: yup.array().optional(),
    createdBy: yup.string().optional(),
    publishedBy: yup.string().optional(),

    product_name: yup
      .string()
      .required(requiredMsg('Product Name')),
    sku: yup.string().required(requiredMsg('SKU')),
    alternateSku: yup.string().optional(),
    productDescriptions: yup
      .string()
      .optional()
      .default(''),
    productURL: yup.string().optional().default(''),
    barcode: yup.string().optional().default(''),
    priceA: yup.string().required(requiredMsg('Price A')),
    priceB: yup.string().required(requiredMsg('Price B')),
    priceC: yup.string().required(requiredMsg('Price C')),

    costPerUnit: yup.string().optional(),
    suppliersCost: yup.array().optional(),
  })

  const handleCategoryOptions = (options: any) => {
    const filteredOptions = options.filter(
      (option: any) => option.parent_category === null,
    )
    const data = filteredOptions.map((option: any) => ({
      label: option.name,
      value: option.id,
    }))

    return data
  }

  const changeObjectToArray = input => {
    const storeQuantities = {}

    input.forEach(item => {
      if (storeQuantities[item.store]) {
        storeQuantities[item.store] += item.quantity
      } else {
        storeQuantities[item.store] = item.quantity
      }
    })

    return Object.entries(storeQuantities).map(
      ([store, quantity]) => {
        const itemsForStore = input.filter(
          item => item.store == store,
        )
        const supplierStock = itemsForStore.map(item => ({
          id: item.id,
          floor: item.floor,
          section: item.section,
          supplier_cost: item.unit_cost.toFixed(4),
          quantity: item.quantity,
          supplier: item.supplier,
          stock: item.stock,
        }))

        return {
          id: supplierStock[0].stock
            ? supplierStock[0].stock
            : 0,
          quantity: quantity,
          store: parseInt(store),
          supplier_stock: supplierStock,
        }
      },
    )
  }

  const changeArrayToObject = input => {
    return input.flatMap(item => {
      return item.supplier_stock.map(stock => ({
        id: stock.id,
        quantity: stock.quantity,
        store: stock.store,
        floor: stock.floor,
        section: stock.section,
        supplier: stock.supplier,
        unit_cost: Number(stock.supplier_cost),
        delivery_date: null,
        stock: stock.stock,
      }))
    })
  }

  const handleBrandsOptions = (options: any) => {
    const data = options.map((option: any) => ({
      label: option.name,
      value: option.id,
    }))

    return data
  }

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      ...schema.getDefault(),
      createdBy: user?.id?.toString(),
      productStatus: 0,
      tags: [],
      ...defaultValues,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  // const { data: subCategories, isSuccess } =
  //   useSearchSubCategoryQuery(Number(watch('category')))

  type IFormData = yup.InferType<typeof schema>

  const _onSubmit = (values: IFormData) => {
    onSubmit({
      product_price: [
        {
          price_a: Number(values.priceA),
          price_b: Number(values.priceB),
          price_c: Number(values.priceC),
          unit_cost: unitCost,
          average_unit_cost: Number(
            calculateAverageCost(stocks),
          ),
          is_active: false,
        },
      ],
      product_stock: changeObjectToArray(stocks) as any,
      product_supplier: suppliers as any,
      product_name: values.product_name,
      sku: values.sku,
      alternate_sku: values.alternateSku,
      description: values.productDescriptions,
      image_url: /* values.productURL */ null,
      barcode: values.barcode,
      brand: Number(values.brand),
      category: [Number(values.category)],
      sub_category: /* values.subCategory */ null,
      is_temporary_product: false,
      is_active: true,
      created_by: user?.id as number,
      merged_record: null,
      published_by: user?.id as number,
      tag: /*values.tags as number[] */ [],
      related_products: [],
      hide_cost_for_users: hideCost,
    })
  }

  useEffect(() => {
    const newProductInfo = window.localStorage.getItem(
      'newProductInfo',
    )

    window.localStorage.removeItem('newProductInfo')

    const defaultsToUse = newProductInfo
      ? JSON.parse(newProductInfo)
      : defaultValues

    if (defaultsToUse) {
      setValue('product_name', defaultsToUse?.product_name)
      setValue('sku', defaultsToUse?.sku)
      setValue('alternateSku', defaultsToUse?.alternate_sku)
      setValue(
        'productDescriptions',
        defaultsToUse?.description || '',
      )

      setHideCost(defaultValues?.hide_cost_for_users)
      setUnitCost(
        Number(defaultsToUse?.product_price[0]?.unit_cost),
      )
      setSuppliers(defaultsToUse?.product_supplier)
      setStocks(
        changeArrayToObject(
          defaultsToUse?.product_stock as IProductStock[],
        ),
      )
      setValue(
        'priceA',
        Number(defaultsToUse?.product_price[0]?.price_a),
      )
      setValue(
        'priceB',
        Number(defaultsToUse?.product_price[0]?.price_b),
      )
      setValue(
        'priceC',
        Number(defaultsToUse?.product_price[0]?.price_c),
      )
      setValue('category', defaultsToUse?.category[0])
      if (defaultsToUse?.sub_category != null) {
        setValue(
          'subCategory',
          defaultsToUse?.sub_category?.id,
        )
      }
      setValue('brand', defaultsToUse?.brand.id)
      setValue('tags', defaultsToUse?.tag)

      setValue('productURL', defaultsToUse?.image_url || '')
      setValue('barcode', defaultsToUse?.barcode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  useEffect(() => {
    const quantitiesByStore: any = {}
    stocks.forEach(stock => {
      const { store, quantity } = stock
      if (quantitiesByStore[store]) {
        quantitiesByStore[store] += quantity
      } else {
        quantitiesByStore[store] = quantity
      }
    })
    const result = Object.keys(quantitiesByStore).map(
      store => ({
        store: parseInt(store),
        value: quantitiesByStore[store],
      }),
    )

    setStoresData(result)
  }, [stocks])

  const handleStoreName = (id: number) => {
    const store = stores?.results.find(
      (store: any) => store.id === id,
    )

    return store?.name
  }

  const calculateTotal = arr => {
    const total = arr.reduce(
      (acc, obj) => acc + obj.value,
      0,
    )

    return total
  }

  return (
    <>
      <PageContainer
        breadcrumbs={[
          { label: 'Products', to: '/products' },
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
            flexDirection: isMobileSize ? 'column' : 'row',
            alignItems: isMobileSize
              ? 'flex-start'
              : 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            rowGap: 4,
            columnGap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: isMobileSize
                ? 'flex-start'
                : 'space-evenly',
            }}
          >
            <TopLink label='General' id='general' />
            <TopLink label='Pricing' id='pricing' />
            <TopLink label='Stock' id='stock' />
            <TopLink
              label='Supplier & Cost'
              id='supplierCost'
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={
                handleSubmit && handleSubmit(_onSubmit)
              }
              variant='contained'
              type='submit'
            >
              {defaultValues ? 'Update' : 'Save Product'}
            </Button>
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => router.push('/products')}
            >
              Cancel
            </Button>
          </Box>
        </Card>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              width: isWindowBelow(800) ? '100%' : 300,
              height: 'fit-content',
            }}
          >
            <Card
              sx={{
                p: 4,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                height: 'fit-content',
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: 17 }}
              >
                Product Details
              </Typography>

              <AppSelect
                required
                label='Brand'
                placeholder='Select an option'
                value={watch('brand') || 0}
                handleChange={e =>
                  setValue('brand', e.target.value)
                }
                error={errors.brand?.message}
                options={
                  brands ? handleBrandsOptions(brands) : []
                }
              />

              <AppSelect
                required
                label='Category'
                placeholder='Select an option'
                value={watch('category') || 0}
                handleChange={e => {
                  setValue('category', e.target.value)

                  // setValue('subCategory', undefined)
                }}
                error={errors.category?.message}
                options={
                  categories
                    ? handleCategoryOptions(categories)
                    : []
                }
              />

              {/* {isSuccess && subCategories.length !== 0 && (
                <AppSelect
                  label='Sub Category'
                  placeholder='Select an option'
                  value={watch('subCategory')}
                  handleChange={e =>
                    setValue('subCategory', e.target.value)
                  }
                  options={
                    subCategories
                      ? handleBrandsOptions(subCategories)
                      : []
                  }
                />
              )} */}

              <Typography sx={{ color: '#979797' }}>
                Set the product details
              </Typography>
            </Card>

            <CreationDetailsCard
              control={control}
              createdBy={`${user?.first_name} ${user?.last_name}`}
              publishedBy={`${user?.first_name} ${user?.last_name}`}
              errors={errors}
            />

            <Card
              sx={{
                p: 4,
                pb: 8,
                width: '100%',
                height: 'fit-content',
                top: 0,
              }}
            >
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: 17 }}
                >
                  Total Quantity
                </Typography>
                {storesData.map((store: any, i: number) => (
                  <Card
                    key={i}
                    variant='outlined'
                    sx={{
                      p: 2,
                      gap: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 700, fontSize: 17 }}
                    >
                      {handleStoreName(store.store)}
                    </Typography>
                    <Typography>{store.value}</Typography>
                  </Card>
                ))}
                <Card
                  variant='outlined'
                  sx={{
                    p: 2,
                    gap: 2,
                    mt: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 17 }}
                  >
                    Total
                  </Typography>
                  <Typography>
                    {calculateTotal(storesData)}
                  </Typography>
                </Card>
              </Box>
            </Card>
          </Box>

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

              <ControlledInput
                required
                name='product_name'
                control={control}
                label='Product Name'
                error={errors.product_name}
                placeholder='Product Name'
              />
              <ControlledInput
                required
                name='sku'
                control={control}
                label='SKU'
                error={errors.sku}
                placeholder='Enter Product SKU'
              />
              <ControlledInput
                name='alternateSku'
                control={control}
                label='Alternate SKU'
                error={errors.alternateSku}
                placeholder='Enter Product SKU'
              />
              <Box>
                <ControlledInput
                  name='productDescriptions'
                  control={control}
                  label='Description'
                  error={errors.productDescriptions}
                  placeholder='To sell or distribute something'
                  multiline
                />
                <Typography sx={{ color: '#979797' }}>
                  Set a description for better visibility
                </Typography>
              </Box>
              <ControlledInput
                name='productURL'
                control={control}
                label='Product URL'
                error={errors.productURL}
                placeholder='URL'
              />
              <Box>
                <ControlledInput
                  name='barcode'
                  control={control}
                  label='Barcode'
                  error={errors.barcode}
                  placeholder='5623872321'
                  inputType='number'
                />
                <Typography sx={{ color: '#979797' }}>
                  Enter the product barcode number
                </Typography>
              </Box>
            </Card>
            <PricesCard
              control={control}
              priceA='priceA'
              priceB='priceB'
              priceC='priceC'
              errors={errors}
            />
            {(user?.user_type === 'manager' ||
              user?.user_type === 'superadmin') && (
              <>
                <StockCard
                  cardId='stock'
                  hideCost={hideCost}
                  setHideCost={setHideCost}
                  unitCost={unitCost}
                  setUnitCost={setUnitCost}
                  stocks={stocks}
                  setStocks={setStocks}
                  purchase={purchase}
                  setPurchase={setPurchase}
                />
                <SupplierCostCard
                  costPerUnit={calculateAverageCost(stocks)}
                  suppliers={suppliers}
                  setSuppliers={setSuppliers}
                />
              </>
            )}
          </Box>
        </Box>
      </PageContainer>
    </>
  )
}

export default ProductsForm
