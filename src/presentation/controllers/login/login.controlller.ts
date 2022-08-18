import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidCredentialsError, InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, invalidCredentials, ok, serverError } from "../../helpers/http-helper";
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../../protocols"

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "email",
        "password",
      ];
      const { email, password } = httpRequest.body;
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.ensureIsValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const isAuthenticated = await this.authentication.auth(email, password)
      if (isAuthenticated === '') {
        return invalidCredentials(new InvalidCredentialsError())
      }
      return ok(isAuthenticated)
    } catch (error) {
      return serverError(error);
    }
  }
}