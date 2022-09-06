import { AccessDenied } from '../errors'
import { forbidden, ok } from '../helpers/http'
import { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from './auth-middleware-ptrotocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDenied())
    } catch (error) {
      return forbidden(error)
    }
  }
}
