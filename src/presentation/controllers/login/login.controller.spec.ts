import { Authentication } from "../../../domain/usecases/authentication";
import { UnautorizedError, InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, unautorized, serverError } from "../../helpers/http-helper";
import { HttpRequest } from "../../protocols";
import { EmailValidator } from "../../protocols";
import { LoginController } from "./login.controlller";

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}
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
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
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
    sut,
    authenticationStub
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

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub, httpRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'ensureIsValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return Unautorized with 401 if invalid credentials are provided', async () => {
    const { sut, httpRequest, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(
      async () => new Promise(resolve => resolve('')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unautorized(new UnautorizedError()))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, httpRequest, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith("any_email@email.com", "any_password",);
  });
});