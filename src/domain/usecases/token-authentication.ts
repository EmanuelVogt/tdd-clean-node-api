
export interface AuthenticatedAccountModel {
  id: string
  name: string
  email: string
  role: string
  accessToken: string
}

export interface TokenAuthenticationModel {
  token: string
}

export interface TokenAuthentication {
  auth: ({ token }: TokenAuthenticationModel) => Promise<AuthenticatedAccountModel>
}
