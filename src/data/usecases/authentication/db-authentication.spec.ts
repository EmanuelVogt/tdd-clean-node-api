import { LoadAccountByEmailRepository } from "./db-authentication-protocols"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"
import { AuthenticationModel } from "../../../domain/usecases/authentication"

const faceAccount: AccountModel = ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
})

const fakeAuthentication: AuthenticationModel = ({ email: 'any_email@mail.com', password: 'any_password' })

const loadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(faceAccount))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = loadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(fakeAuthentication)
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error))
    )
    const promise = sut.auth(fakeAuthentication)
    expect(promise).rejects.toThrow()
  })
});