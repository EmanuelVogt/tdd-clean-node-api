import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByTokenRepository {
  loadAccountByToken: (accessToken: string, role?: string) => Promise<AccountModel>
}
