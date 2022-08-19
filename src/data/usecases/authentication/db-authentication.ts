import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer, LoadAccountByEmailRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loacAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) { }

  async auth({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loacAccountByEmailRepository.load(email)
    if (account) {
      await this.hashComparer.compare(password, account.password)
      //return new Promise(resolve => resolve('any_token'))
    }
    return null
  }
}