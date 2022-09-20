
export interface AuthenticatedAccountModel {
  id: string
  name: string
  email: string
  role: string
  accessToken: string
}

export interface TokenAuthentication {
  auth: (token: string) => Promise<AuthenticatedAccountModel>
}
