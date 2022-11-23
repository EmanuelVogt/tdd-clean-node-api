export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  accessToken?: string
  role?: string
}

export interface AuthenticatedAccountModel {
  id: string
  name: string
  email: string
  role: string
  accessToken: string
}
