import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unautorized } from '@/presentation/helpers/http'
import {
  AuthenticatedAccountModel,
  HttpRequest,
  TokenAuthentication,
  TokenAuthenticationModel,
  Validation
} from './protocols'
import { TokenLoginController } from './token-login.controller'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeTokenAuthentication = (): TokenAuthentication => {
  class TokenAuthenticationStub implements TokenAuthentication {
    async auth ({ token }: TokenAuthenticationModel): Promise<AuthenticatedAccountModel> {
      return await new Promise(resolve => resolve({
        email: 'any_email',
        id: 'any_id',
        name: 'any_name',
        accessToken: 'any_access_token',
        role: 'any_role'
      }))
    }
  }

  return new TokenAuthenticationStub()
}

type SutTypes = {
  fakeError: Error
  httpRequest: HttpRequest
  sut: TokenLoginController
  tokenAuthenticationStub: TokenAuthentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const tokenAuthenticationStub = makeTokenAuthentication()
  const validationStub = makeValidation()
  const sut = new TokenLoginController(tokenAuthenticationStub, validationStub)
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  const httpRequest = {
    body: {
      token: 'any_token'
    }
  }

  return {
    validationStub,
    fakeError,
    httpRequest,
    sut,
    tokenAuthenticationStub
  }
}
describe('token login controller', () => {
  test('should return Unautorized with 401 if invalid token is rpovided', async () => {
    const { sut, httpRequest, tokenAuthenticationStub } = makeSut()
    jest.spyOn(tokenAuthenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unautorized())
  })

  test('should call TokenAuthentication with correct values', async () => {
    const { sut, httpRequest, tokenAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(tokenAuthenticationStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ token: 'any_token' })
  })

  test('should return 500 if TokenAuthentication throws', async () => {
    const { sut, tokenAuthenticationStub, httpRequest } = makeSut()
    jest.spyOn(tokenAuthenticationStub, 'auth').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 and an account if TokenAuthentication succeed', async () => {
    const { sut, httpRequest } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({
      account: {
        email: 'any_email',
        id: 'any_id',
        name: 'any_name',
        accessToken: 'any_access_token',
        role: 'any_role'
      }
    }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub, httpRequest } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if valididation return an error', async () => {
    const { sut, validationStub, httpRequest } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
