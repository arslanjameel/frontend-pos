export interface IWebsiteNew {
  url: string
  name: string
  cms_login_url: string
  cms_username: string
  cms_password: string
  domain_provider_username: string
  domain_provider_password: string
  hosting_provider_username: string
  hosting_provider_password: string
  business: number
}

export interface IWebsite extends IWebsiteNew {
  id: number
  updated_at: string
  created_at: string
}
