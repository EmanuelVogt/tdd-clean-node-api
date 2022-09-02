/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adapterMiddleware } from '../adapter/express/express-middleware-adapter'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey-controller-factory'
import { makeLogErrorControllerFactory } from '../factories/decorators/log-error-controller-decorator-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adapterMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adapterRoute(makeLogErrorControllerFactory(makeAddSurveyController())))
}
