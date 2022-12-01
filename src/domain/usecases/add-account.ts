import { AccountModel } from '../models/account'

export interface AddAccountParams {
  name: string
  email: string
  password: string
  role?: string
}

export interface AddAccount {
  create: (account: AddAccountParams) => Promise<AccountModel>
}
