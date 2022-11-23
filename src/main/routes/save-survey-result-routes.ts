/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { expressAdapterMiddleware } from '../adapter/express/express-middleware-adapter'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result'
import { makeLogErrorControllerFactory } from '../factories/decorators/log-error-controller-decorator-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const auth = expressAdapterMiddleware(makeAuthMiddleware())
  router.put('/surveys/:surveyId/results', auth, adapterRoute(makeLogErrorControllerFactory(makeSaveSurveyResultController())))
}
