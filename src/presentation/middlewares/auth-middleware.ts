import { AccessDenied } from '../errors'
import { forbiden } from '../helpers/http'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { LoadAccountByToken } from './auth-middleware-ptrotocols'
export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }
    return await new Promise(resolve => resolve(forbiden(new AccessDenied())))
  }
}
