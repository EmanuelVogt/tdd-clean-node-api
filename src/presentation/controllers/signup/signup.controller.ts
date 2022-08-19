import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
} from "./signup-protocols";

import { badRequest, ok, serverError } from "../../helpers/http";
import { Validation } from "../../helpers/validators/validation";

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body;
      const accont = await this.addAccount.create({ email, name, password });
      return ok(accont);
    } catch (error) {
      return serverError(error);
    }
  }
}
