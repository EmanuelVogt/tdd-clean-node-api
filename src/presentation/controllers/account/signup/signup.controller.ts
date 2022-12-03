import {
  HttpResponse,
  Controller,
  AddAccount,
  Authentication
} from './signup-protocols'

import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { Validation } from '@/presentation/protocols/validation'
import { ForbidenError } from '@/presentation/errors/forbiden-error'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (req: SignUpController.Req): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req)
      if (error) {
        return badRequest(error)
      }
      const account = await this.addAccount.create(req)
      if (!account) {
        return forbidden(new ForbidenError())
      }
      const { accessToken } = await this.authentication.auth(req)
      const dataToSend = { ...account, accessToken }
      return ok(dataToSend)
    } catch (error) {
      return serverError(error)
    }
  }
}

declare module SignUpController {
  type Req = {
    name: string
    email: string
    password: string
    role: string
  }
}
