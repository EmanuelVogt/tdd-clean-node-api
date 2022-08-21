import { Router } from "express";
import { makeSignupController } from '../factories/signup-factory'
import { adapterRoute } from '../adapter/express/express-route-adapter'

export default (router: Router): void => {
  router.post("/signup", adapterRoute(makeSignupController()));
};
