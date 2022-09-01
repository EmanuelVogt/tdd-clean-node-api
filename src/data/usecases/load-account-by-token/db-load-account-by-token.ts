import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter, LoadAccountByToken } from './db-load-accoynt-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) { }
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const valueDecrypted = await this.decrypter.decrypt(accessToken)
    if (valueDecrypted) {
      console.log('dale')
    }
    return null
  }
}
