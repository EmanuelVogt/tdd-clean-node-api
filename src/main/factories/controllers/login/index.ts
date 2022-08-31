
import { LogErrorMongoRepository } from "../../../../infra/db/mongodb/log-error-repository/log-error-repository";
import { LoginController } from "../../../../presentation/controllers/login/login.controlller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorControllers } from "../../../decorators/log-error";
import { makeLoginValidationFactory } from "./login-validation"
import { makeDbAuthentication } from "../../usecases/db-authentication-factory";

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const loginController = new LoginController(dbAuthentication, makeLoginValidationFactory())
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(loginController, logErrorRepository)
}