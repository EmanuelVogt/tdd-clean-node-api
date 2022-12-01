import { AuthenticatedAccountModel } from '../models/account'

export interface AuthenticationParams {
  email: string
  password: string
}

export interface Authentication {
  auth: ({ email, password }: AuthenticationParams) => Promise<AuthenticatedAccountModel>
}
