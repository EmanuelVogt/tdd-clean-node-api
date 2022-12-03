import { AccessDenied } from '../errors'
import { forbidden, ok } from '../helpers/http'
import { HttpResponse, LoadAccountByToken, Middleware } from './auth-middleware-ptrotocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (req: AuthMiddleware.Req): Promise<HttpResponse> {
    try {
      if (req.accessToken) {
        const account = await this.loadAccountByToken.load(req.accessToken, this.role)
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

declare module AuthMiddleware {
  type Req = {
    accessToken: string
  }
}
