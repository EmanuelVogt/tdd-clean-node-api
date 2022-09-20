import { ok, serverError, unautorized } from '@/presentation/helpers/http'
import {
  AuthenticatedAccountModel,
  HttpRequest,
  TokenAuthentication
} from './protocols'
import { TokenLoginController } from './token-login.controller'

const makeTokenAuthentication = (): TokenAuthentication => {
  class TokenAuthenticationStub implements TokenAuthentication {
    async auth (token: string): Promise<AuthenticatedAccountModel> {
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
}

const makeSut = (): SutTypes => {
  const tokenAuthenticationStub = makeTokenAuthentication()
  const sut = new TokenLoginController(tokenAuthenticationStub)
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  const httpRequest = {
    body: {
      token: 'any_token'
    }
  }

  return {
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
    expect(authSpy).toHaveBeenCalledWith('any_token')
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

  test('should return 401 if invalid token is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        token: null
      }
    })
    expect(httpResponse).toEqual(unautorized())
  })

  test('should return 500 if TokenAuthentication throws', async () => {
    const { sut, tokenAuthenticationStub, httpRequest } = makeSut()
    jest.spyOn(tokenAuthenticationStub, 'auth').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
