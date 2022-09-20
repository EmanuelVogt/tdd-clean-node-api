/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeSignupController, makeLoginController } from '../factories'
import { makeTokenLoginController } from '../factories/controllers/account/token-login-controller-factory'
import { makeLogErrorControllerFactory } from '../factories/decorators/log-error-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeLogErrorControllerFactory(makeSignupController())))
  router.post('/login', adapterRoute(makeLogErrorControllerFactory(makeLoginController())))
  router.get('/token-login', adapterRoute(makeLogErrorControllerFactory(makeTokenLoginController())))
}
