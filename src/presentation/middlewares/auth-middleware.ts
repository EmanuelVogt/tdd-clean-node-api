import { AccessDenied } from '../errors'
import { forbiden } from '../helpers/http'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbiden(new AccessDenied())
    return await new Promise(resolve => resolve(error))
  }
}
