import { unautorized, ok, serverError } from '@/presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse, TokenAuthentication } from './protocols'

export class TokenLoginController implements Controller {
  constructor (
    private readonly tokenAuthentication: TokenAuthentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { token } = httpRequest.body
      if (!token) {
        return unautorized()
      }
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
