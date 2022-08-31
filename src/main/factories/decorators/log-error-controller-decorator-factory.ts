import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { Controller } from '../../../presentation/protocols'
import { LogErrorControllers } from '../../decorators/log-error'

export const makeLogErrorControllerFactory = (controller: Controller): Controller => {
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogErrorControllers(controller, logErrorMongoRepository)
}
