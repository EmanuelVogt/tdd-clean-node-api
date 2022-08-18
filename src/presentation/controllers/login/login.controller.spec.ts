import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest } from "../../protocols";
import { EmailValidator } from "../../protocols";
import { LoginController } from "./login.controlller";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    ensureIsValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  emailValidatorStub: EmailValidator;
  fakeError: Error,
  httpRequest: HttpRequest
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController()
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const httpRequest = {
    body: {
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  };
  return {
    emailValidatorStub,
    fakeError,
    httpRequest,
    sut
  };
};
describe('login controller', () => {
  test('should return MissingParamError with 400 status if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test('should return MissingParamError with 400 status if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});