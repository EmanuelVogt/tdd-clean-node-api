/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey-controller-factory'
import { makeLogErrorControllerFactory } from '../factories/decorators/log-error-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/surveys', adapterRoute(makeLogErrorControllerFactory(makeAddSurveyController())))
}
