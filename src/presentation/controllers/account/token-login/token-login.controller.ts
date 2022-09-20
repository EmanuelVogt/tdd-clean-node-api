import { unautorized, ok, serverError, badRequest } from '@/presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse, TokenAuthentication, Validation } from './protocols'

export class TokenLoginController implements Controller {
  constructor (
    private readonly tokenAuthentication: TokenAuthentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { token } = httpRequest.body
      const account = await this.tokenAuthentication.auth(token)
      if (!account) {
        return unautorized()
      }
      return ok({ account })
    } catch (error) {
      return serverError(error)
    }
  }
}
