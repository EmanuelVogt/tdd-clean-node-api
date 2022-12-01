import {
  Authentication,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
  AuthenticatedAccountModel
} from './protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth ({ email, password }: AuthenticationParams): Promise<AuthenticatedAccountModel> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(email)
    if (account) {
      const isValid = await this.hashComparer.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(accessToken, account.id)
        return {
          accessToken,
          email: account.email,
          id: account.id,
          name: account.name,
          role: account.role
        }
      }
    }
    return null
  }
}
