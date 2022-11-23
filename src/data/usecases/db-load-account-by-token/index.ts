import { AccountModel } from '../db-add-account/protocols'
import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const valueDecrypted = await this.decrypter.decrypt(accessToken)
    if (valueDecrypted) {
      const account = await this.loadAccountByTokenRepository.loadAccountByToken(accessToken, role)
      return account || null
    }
    return null
  }
}
