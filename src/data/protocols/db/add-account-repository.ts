import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/add-account'

export interface AddAccountRepository {
  create: (values: AddAccountParams) => Promise<AccountModel>
}
