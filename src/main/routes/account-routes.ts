import { Router } from "express";
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeSignupController, makeLoginController } from '../factories'
import { makeLogErrorControllerFactory } from "../factories/decorators/log-error-controller-decorator-factory";

export default (router: Router): void => {
  router.post("/signup", adapterRoute(makeLogErrorControllerFactory(makeSignupController())));
  router.post("/login", adapterRoute(makeLogErrorControllerFactory(makeLoginController())));
};
