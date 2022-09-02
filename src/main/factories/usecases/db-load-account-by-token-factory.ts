import { DbLoadAccountByToken } from '../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../infra/crypt/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account-repository/account-repository'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
}
