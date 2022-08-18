import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/crypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-repository'
import { Controller } from '../../presentation/protocols'
import { LogErrorControllers } from '../decorators/log-error'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error-repository'
import { makeSignupValidationFactory } from './signup-validation'


export const makeSignupController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignupValidationFactory())
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(signUpController, logErrorRepository)
}