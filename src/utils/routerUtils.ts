export const isIdValid = (
  id: string | string[] | undefined,
) => {
  const idAsInt = parseInt(id as string, 10)

  return !isNaN(idAsInt) ? idAsInt : -1
}
