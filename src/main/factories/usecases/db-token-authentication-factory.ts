import { DbTokenAuthentication } from '@/data/usecases/token-authentication'
import { JwtAdapter } from '@/infra/crypt/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories/account-repository/account-repository'
import env from '../../config/env'

export const makeDbTokenAuthentication = (): DbTokenAuthentication => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbTokenAuthentication(
    accountMongoRepository,
    jwtAdapter
  )
}
