import { AccessDenied } from '../errors'
import { forbiden, ok, serverError } from '../helpers/http'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { LoadAccountByToken } from './auth-middleware-ptrotocols'
export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return await new Promise(resolve => resolve(forbiden(new AccessDenied())))
    } catch (error) {
      serverError(error)
    }
  }
}
