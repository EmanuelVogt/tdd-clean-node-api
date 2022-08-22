import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/encrypter';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

interface SutTypes {
  sut: Encrypter
}
const secret = ('any_secret')
const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(secret)

  return {
    sut
  }
}
describe('JWT Adapter', () => {
  test('should call sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, "sign")
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({"id": "any_id"}, "any_secret", {"expiresIn": 10000000000})
  });

  test('should return a token on sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toEqual("any_token")
  });

  test('should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    expect(promise).rejects.toThrow()
  });
});