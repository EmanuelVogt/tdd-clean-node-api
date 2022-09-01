import { AccessDenied } from '../errors'
import { forbiden } from '../helpers/http'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {}
}
const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return { sut }
}
describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const HttpResponse = await sut.handle(makeFakeHttpRequest())
    expect(HttpResponse).toEqual(forbiden(new AccessDenied()))
  })
})
