import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Authentication
} from './signup-protocols'

import { badRequest, forbiden, ok, serverError } from '../../helpers/http'
import { Validation } from '../../protocols/validation'
import { ForbidenError } from '../../errors/forbiden-error'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.create({ email, name, password })
      if (!account) {
        return forbiden(new ForbidenError())
      }
      const accessToken = await this.authentication.auth({ email, password })
      const dataToSend = { ...account, accessToken }
      return ok(dataToSend)
    } catch (error) {
      return serverError(error)
    }
  }
}
