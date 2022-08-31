
import { LoginController } from '../../../../presentation/controllers/account/login/login.controlller'
import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidationFactory } from './login-validation'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'

export const makeLoginController = (): Controller => {
  return new LoginController(makeDbAuthentication(), makeLoginValidationFactory())
}
