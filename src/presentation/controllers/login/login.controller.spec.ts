import { InvalidParamError, MissingParamError } from "../../errors";
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
  const sut = new LoginController(emailValidatorStub)
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const httpRequest = {
    body: {
      email: "any_email@email.com",
      password: "any_password",
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
        email: "any_email@mail.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test('should return IvalidParamError with 400 status if an invalid email is provided', async () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut();
    jest.spyOn(emailValidatorStub, "ensureIsValid").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut();
    const isValid = jest.spyOn(emailValidatorStub, "ensureIsValid")
    await sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledWith("any_email@email.com");
  });

  test('should EmailValidator return true if a valid email is provided', async () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut();
    const isValid = jest.spyOn(emailValidatorStub, "ensureIsValid")
    await sut.handle(httpRequest)
    expect(isValid).toReturnWith(true)
  })
});