import { SignUpController } from '../../../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignupValidationFactory } from './signup-validation'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/db-add-account-factory'

export const makeSignupController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSignupValidationFactory(), makeDbAuthentication())
}