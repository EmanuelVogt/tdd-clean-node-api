import {
  AuthenticatedAccountModel,
  Decrypter,
  LoadAccountByIdRepository,
  TokenAuthentication
} from './protocols'

export class DbTokenAuthentication implements TokenAuthentication {
  constructor (
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly decrypter: Decrypter
  ) { }

  async auth (token: string): Promise<AuthenticatedAccountModel> {
    const { id } = await this.decrypter.decrypt(token)
    const account = await this.loadAccountByIdRepository.loadById(id)

    return {
      accessToken: account.accessToken,
      email: account.email,
      id: account.id,
      name: account.name,
      role: account.role
    } || null
  }
}
