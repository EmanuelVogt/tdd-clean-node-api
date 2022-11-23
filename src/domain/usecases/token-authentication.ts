import { AuthenticatedAccountModel } from '../models/account'

export interface TokenAuthentication {
  auth: (token: string) => Promise<AuthenticatedAccountModel>
}
