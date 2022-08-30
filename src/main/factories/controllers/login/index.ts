import { DbAuthentication } from "../../../../data/usecases/authentication/db-authentication";
import { JwtAdapter } from "../../../../infra/crypt/jwt-adapter/jwt-adapter";
import { BcryptAdapter } from "../../../../infra/crypt/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account-repository/account-repository";
import { LogErrorMongoRepository } from "../../../../infra/db/mongodb/log-error-repository/log-error-repository";
import { LoginController } from "../../../../presentation/controllers/login/login.controlller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorControllers } from "../../../decorators/log-error";
import { makeLoginValidationFactory } from "./login-validation"
import env from '../../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const loginController = new LoginController(dbAuthentication, makeLoginValidationFactory())
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(loginController, logErrorRepository)
}