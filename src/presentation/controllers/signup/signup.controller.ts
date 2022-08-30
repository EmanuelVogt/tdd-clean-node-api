import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Authentication
} from "./signup-protocols";

import { badRequest, ok, serverError } from "../../helpers/http";
import { Validation } from "../../protocols/validation";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body;
      const accont = await this.addAccount.create({ email, name, password });
      const accessToken = await this.authentication.auth({ email, password })
      const dataToSend = { ...accont, accessToken }
      return ok(dataToSend);
    } catch (error) {
      return serverError(error);
    }
  }
}
