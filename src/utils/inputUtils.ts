export type IInputAllowOption =
  | 'numbers'
  | 'letters'
  | 'symbols'
  | 'spaces'

export const inputAllows = (
  input: string,
  allows: IInputAllowOption[] = ['numbers', 'letters'],
) => {
  const allowNumbers = allows.includes('numbers')
  const allowLetters = allows.includes('letters')
  const allowSymbols = allows.includes('symbols')
  const allowSpaces = allows.includes('spaces')

  let regexPattern = ''

  if (allowNumbers) regexPattern += '0-9'
  if (allowLetters) regexPattern += 'a-zA-Z'
  if (allowSymbols) regexPattern += '\\S' // Any non-whitespace character
  if (allowSpaces) regexPattern += ' ' // Space
  regexPattern += '\\n' // Include newline character

  if (!regexPattern)
    throw new Error(
      'At least one character type must be allowed',
    )

  const regex = new RegExp(`[^${regexPattern}]`, 'g')

  return input.replace(regex, '')
}

export const enforceMaxLength = (
  input: string,
  maxLength: number,
) => {
  return input.slice(0, maxLength)
}

export const removeLeadingZeros = (num: number) => {
  const numString = num.toString()
  const strippedNumString = numString.replace(/^0+/, '')
  const result = parseInt(strippedNumString, 10)

  return isNaN(result) ? 0 : result
}
