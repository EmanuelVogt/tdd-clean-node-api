import { SignUpController } from '../../../presentation/controllers/signup/signup.controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-repository'
import { Controller } from '../../../presentation/protocols'
import { LogErrorControllers } from '../../decorators/log-error'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { makeSignupValidationFactory } from './signup-validation'
import { JwtAdapter } from '../../../infra/crypt/jwt-adapter/jwt-adapter'
import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'


export const makeSignupController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignupValidationFactory(), dbAuthentication)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(signUpController, logErrorRepository)
}