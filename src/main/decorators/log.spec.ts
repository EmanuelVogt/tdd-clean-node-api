/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllers } from "./log";

interface SutTypes {
  sut: LogControllers
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
  fakeError: Error
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {

      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email: "any_mail@mail.com",
          name: "any_name",
          password: "any_password",
        }
      }

      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllers(controllerStub, logErrorRepositoryStub)
  const fakeError = new Error()
  fakeError.stack = "any_stack"
  return {
    sut,
    controllerStub,
    fakeError,
    logErrorRepositoryStub
  }
}

describe('Log Controller decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  });

  test('Should Controller handle method return valid values', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(handleSpy).toReturn()
    expect(httpResponse.body).toEqual({
      email: "any_mail@mail.com",
      name: "any_name",
      password: "any_password"
    })
    expect(httpRequest.body).not.toEqual({
      email: "wrong_email",
      name: "wrong_name",
      password: "wrong_password"
    })
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, logErrorRepositoryStub, fakeError, controllerStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))

    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith("any_stack")
  });
});