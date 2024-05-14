import httpService from './http.service'

export const sendEmailWithAttachment = async ({
  file,
  email,
  email_body,
  email_title,
  store_id,
}: {
  file: any
  email: string
  email_title: string
  email_body: string
  store_id: string
}) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    formData.append('email_body', email_body)
    formData.append('email_title', email_title)
    formData.append('store_id', store_id)

    const { data } = await httpService.post<any>(
      '/sale/send-file/',
      formData,
    )

    return data
  } catch (e: any) {
    return e?.response?.data || 'An Error Occured'
  }
}
