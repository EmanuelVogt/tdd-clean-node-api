import { unautorized, ok, serverError } from '@/presentation/helpers/http'
import { Controller, HttpResponse, TokenAuthentication } from './protocols'

export class TokenLoginController implements Controller {
  constructor (
    private readonly tokenAuthentication: TokenAuthentication
  ) { }

  async handle (req: TokenLoginController.Req): Promise<HttpResponse> {
    try {
      const { accessToken } = req
      if (!accessToken) {
        return unautorized()
      }
      const account = await this.tokenAuthentication.auth(accessToken)
      if (!account) {
        return unautorized()
      }
      return ok({ account })
    } catch (error) {
      return serverError(error)
    }
  }
}

declare module TokenLoginController {
  type Req = {
    accessToken: string
  }
}
