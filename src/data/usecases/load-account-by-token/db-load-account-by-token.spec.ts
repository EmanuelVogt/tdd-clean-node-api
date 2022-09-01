import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './db-load-accoynt-by-token-protocols'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value_decrypted'))
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const spy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(spy).toHaveBeenCalledWith('any_token')
  })
})
