import { DbAddAccount } from './db-add-account'
import {
  AccountModel,
  AddAccountModel,
  Hasher,
  AddAccountRepository
} from './db-add-account-protocols'

interface AccountData {
  name: string
  email: string
  password: string
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeAccountData = (): AccountData => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async create (values: AddAccountModel): Promise<AccountModel> {
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
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount usecase', () => {
  test('should call Encrtypter with correct password', () => {
    const { hasherStub, sut } = makeSut()
    const ecnryptSpy = jest.spyOn(hasherStub, 'hash')
    void sut.create(makeAccountData())
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
})
