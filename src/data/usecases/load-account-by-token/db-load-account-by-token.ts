import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter, LoadAccountByToken } from './db-load-accoynt-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return await new Promise(resolve => resolve(null))
  }
}
