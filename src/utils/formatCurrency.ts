export const formatCurrency = (
  number: number | string = 0,
  options: {
    _default?: string
    currencySymbol?: string
    to2dp?: boolean
  } = {
    _default: 'N/A',
    currencySymbol: '£',
    to2dp: true,
  },
) => {
  const _number = Number(number)
  const _currencySymbol = options.currencySymbol || '£'
  const _to2dp = options.to2dp || true

  if (isNaN(_number))
    return _currencySymbol + (options._default || 'N/A')

  if (_to2dp) {
    const formattedNumber = _number.toFixed(2)

    return (
      _currencySymbol +
      formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )
  }

  return (
    _currencySymbol +
    _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  )
}
