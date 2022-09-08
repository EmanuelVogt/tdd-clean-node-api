import { SignUpController } from '@/presentation/controllers/account/signup/signup.controller'
import { Controller } from '@/presentation/protocols'
import { makeSignupValidationFactory } from './signup-validation'
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/db-add-account-factory'

export const makeSignupController = (): Controller => {
  return new SignUpController(makeDbAddAccount(), makeSignupValidationFactory(), makeDbAuthentication())
}
