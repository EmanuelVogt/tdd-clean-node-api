import {
  HttpRequest,
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

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password, role } = httpRequest.body
      const account = await this.addAccount.create({ email, name, password, role })
      if (!account) {
        return forbidden(new ForbidenError())
      }
      const { accessToken } = await this.authentication.auth({ email, password })
      const dataToSend = { ...account, accessToken }
      return ok(dataToSend)
    } catch (error) {
      return serverError(error)
    }
  }
}
