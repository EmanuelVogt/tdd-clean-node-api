import { unautorized, ok, serverError, badRequest } from '@/presentation/helpers/http'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const account = await this.authentication.auth({ email, password })
      if (!account) {
        return unautorized()
      }
      return ok({ account })
    } catch (error) {
      return serverError(error)
    }
  }
}
