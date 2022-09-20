import { DbTokenAuthentication } from '.'
import { AccountModel, Decrypter, LoadAccountByIdRepository } from './protocols'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(
        {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          accessToken: 'any_accessToken',
          role: 'any_role'
        }
      ))
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

type SutTypes = {
  sut: DbTokenAuthentication
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const decrypterStub = makeDecrypter()
  const sut = new DbTokenAuthentication(loadAccountByIdRepositoryStub, decrypterStub)
  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbTokenAuthentication UseCase', () => {
  test('should call Decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const loadSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.auth('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
