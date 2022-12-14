import { DbAddAccount } from '.'
import {
  AccountModel,
  AddAccountParams,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './protocols'

interface AccountData {
  name: string
  email: string
  password: string
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeAccountData = (): AccountData => ({
  name: 'valid_name',
  email: 'any_email@mail.com',
  password: 'valid_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadAccountByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async create (values: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}
const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount usecase', () => {
  test('should call Encrtypter with correct password', async () => {
    const { hasherStub, sut } = makeSut()
    const ecnryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.create(makeAccountData())
    expect(ecnryptSpy).toHaveBeenCalledWith(makeAccountData().password)
  })

  test('should throw if Encrtypter throws', () => {
    const { hasherStub, sut } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeAccountData())
    void expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(addAccountRepositoryStub, 'create')
    await sut.create(makeAccountData())
    expect(createSpy).toHaveBeenCalled()
  })

  test('should throw if AddAcountRepository throws', () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeAccountData())
    void expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.create(makeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
    await sut.create(makeFakeAccount())
    void expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const sutResponse = await sut.create(makeFakeAccount())
    expect(loadSpy).not.toBe(null)
    expect(sutResponse).toBe(null)
  })
})
