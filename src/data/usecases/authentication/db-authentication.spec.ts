import { HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from "./db-authentication-protocols"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"
import { AuthenticationModel } from "../../../domain/usecases/authentication"

const faceAccount: AccountModel = ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password'
})

const fakeAuthentication: AuthenticationModel = ({ email: 'any_email@mail.com', password: 'any_password' })

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(token: string, id: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(faceAccount))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompare = (): HashComparer => {
  class HasComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HasComparerStub
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  tokenGenerator: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const hashComparerStub = makeHashCompare()
  const tokenGenerator = makeTokenGenerator()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGenerator, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGenerator,
    updateAccessTokenRepositoryStub
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

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(fakeAuthentication)
    expect(accessToken).toBe(null)
  });

  test('should call HashCompare with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(fakeAuthentication)
    expect(compareSpy).not.toHaveBeenCalledWith('wrong_password', 'hashed_password')
    expect(compareSpy).not.toHaveBeenCalledWith('any_password', 'wrong_hashed_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  });

  test('should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error))
    )
    const promise = sut.auth(fakeAuthentication)
    expect(promise).rejects.toThrow()
  })

  test('should return null if HashCompare returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(fakeAuthentication)
    expect(accessToken).toBe(null)
  });

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGenerator } = makeSut()
    const compareSpy = jest.spyOn(tokenGenerator, 'generate')
    await sut.auth(fakeAuthentication)
    expect(compareSpy).not.toHaveBeenCalledWith('wrong_id')
    expect(compareSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGenerator } = makeSut()
    jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error))
    )
    const promise = sut.auth(fakeAuthentication)
    expect(promise).rejects.toThrow()
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(fakeAuthentication)
    expect(updateSpy).toHaveBeenCalledWith('any_token', 'any_id')
  });
});