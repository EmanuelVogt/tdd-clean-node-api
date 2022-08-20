import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer, LoadAccountByEmailRepository, TokenGenerator } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loacAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) { }

  async auth({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loacAccountByEmailRepository.load(email)
    if (account) { 
      const isValid = await this.hashComparer.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}