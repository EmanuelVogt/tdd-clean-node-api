import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, unautorized, ok, serverError } from "../../helpers/http-helper";
import { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse } from './login-protocols'

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
      const accessToken = await this.authentication.auth(email, password)
      if (accessToken === '') {
        return unautorized()
      }
      return ok(accessToken)
    } catch (error) {
      return serverError(error);
    }
  }
}