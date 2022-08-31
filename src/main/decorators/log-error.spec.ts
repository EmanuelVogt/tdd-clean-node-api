/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllers } from './log-error'

interface SutTypes {
  sut: LogErrorControllers
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
  fakeError: Error
  httpRequest: HttpRequest
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid_password'
})

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: makeFakeAccount()
      }

      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const httpRequest = makeHttpRequest()
  const sut = new LogErrorControllers(controllerStub, logErrorRepositoryStub)
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return {
    sut,
    controllerStub,
    fakeError,
    logErrorRepositoryStub,
    httpRequest
  }
}

describe('Log Controller decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut, httpRequest } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should Controller handle method return valid values', async () => {
    const { controllerStub, sut, httpRequest } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpResponse = await sut.handle(httpRequest)

    expect(handleSpy).toReturn()
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
    expect(httpRequest.body).not.toEqual({
      email: 'wrong_email',
      name: 'wrong_name',
      password: 'wrong_password'
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, logErrorRepositoryStub, fakeError, controllerStub, httpRequest } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
