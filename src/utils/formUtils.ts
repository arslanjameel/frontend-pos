export const requiredMsg = (str: string) =>
  str + ' is a required field'

export const emailInvalidErr = () => 'Invalid email'
export const EmailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const passwordMinErr = (min = 8) =>
  `Password must be at least ${min} characters`
