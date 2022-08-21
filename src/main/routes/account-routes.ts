import { Router } from "express";
import { adapterRoute } from '../adapter/express/express-route-adapter'
import { makeSignupController, makeLoginController } from '../factories'

export default (router: Router): void => {
  router.post("/signup", adapterRoute(makeSignupController()));
  router.post("/login", adapterRoute(makeLoginController()));
};
