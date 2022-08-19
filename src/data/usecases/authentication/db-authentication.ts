import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(private readonly loacAccountByEmailRepository: LoadAccountByEmailRepository) { }
  async auth({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loacAccountByEmailRepository.load(email)

    return new Promise(resolve => resolve('any_token'))
  }
}