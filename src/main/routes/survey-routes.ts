/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { expressAdapterMiddleware } from '../adapter/express/express-middleware-adapter'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/surveys/load-survey-controller-factory'
import { makeLogErrorControllerFactory } from '../factories/decorators/log-error-controller-decorator-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = expressAdapterMiddleware(makeAuthMiddleware('admin'))
  const auth = expressAdapterMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adapterRoute(makeLogErrorControllerFactory(makeAddSurveyController())))
  router.get('/surveys', auth, adapterRoute(makeLogErrorControllerFactory(makeLoadSurveysController())))
}
