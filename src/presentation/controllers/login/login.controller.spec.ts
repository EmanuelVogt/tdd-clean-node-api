import { Authentication } from "../../../domain/usecases/authentication";
import { MissingParamError } from "../../errors";
import { badRequest, unautorized, serverError, ok } from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";
import { HttpRequest } from "../../protocols";
import { LoginController } from "./login.controlller";

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  fakeError: Error,
  httpRequest: HttpRequest
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const httpRequest = {
    body: {
      email: "any_email@email.com",
      password: "any_password",
    },
  };
  return {
    validationStub,
    fakeError,
    httpRequest,
    sut,
    authenticationStub
  };
};
describe('login controller', () => {
  test('should return Unautorized with 401 if invalid credentials are provided', async () => {
    const { sut, httpRequest, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(
      async () => new Promise(resolve => resolve('')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unautorized())
  })

  test('should call Authentication with correct values', async () => {
    const { sut, httpRequest, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith("any_email@email.com", "any_password",);
  });

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub, httpRequest } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, httpRequest } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }))
  })

  test("should call Validation with correct values", async () => {
    const { sut, validationStub, httpRequest } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("should return 400 if valididation return an error", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  });
});