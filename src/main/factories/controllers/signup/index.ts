import { SignUpController } from '../../../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../../../presentation/protocols'
import { LogErrorControllers } from '../../../decorators/log-error'
import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { makeSignupValidationFactory } from './signup-validation'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/db-add-account-factory'

export const makeSignupController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const dbAddAccount = makeDbAddAccount()
  const signUpController = new SignUpController(dbAddAccount, makeSignupValidationFactory(), dbAuthentication)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(signUpController, logErrorRepository)
}