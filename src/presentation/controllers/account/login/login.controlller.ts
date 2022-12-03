import { unautorized, ok, serverError, badRequest } from '@/presentation/helpers/http'
import { Authentication, Controller, HttpResponse, Validation } from './login-protocols'
export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (req: LoginController.Req): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req)
      if (error) {
        return badRequest(error)
      }
      const account = await this.authentication.auth(req)
      if (!account) {
        return unautorized()
      }
      return ok({ account })
    } catch (error) {
      return serverError(error)
    }
  }
}

declare module LoginController {
  type Req = {
    email: string
    password: string
  }
}
