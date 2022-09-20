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
          accessToken: 'any_token',
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
  test('should call LoadAccountByIdRepository with correct id', async () => {
    const { sut, loadAccountByIdRepositoryStub, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'any_id' })))
    const loadSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.auth('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth('any_token')
    void expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const account = await sut.auth('any_token')
    expect(account).toBeFalsy()
  })

  test('should call Decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const loadSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.auth('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
