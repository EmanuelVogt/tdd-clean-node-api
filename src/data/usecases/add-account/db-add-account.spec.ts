import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";

interface AccountData {
  name: string,
  email: string,
  password: string,
}
interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeAccountData = (): AccountData => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
})

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async create(values: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountRepositoryStub();
};
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount usecase", () => {
  test("should call Encrtypter with correct password", () => {
    const { encrypterStub, sut } = makeSut();
    const ecnryptSpy = jest.spyOn(encrypterStub, "encrypt");
    sut.create(makeAccountData());
    expect(ecnryptSpy).toHaveBeenCalledWith(makeAccountData().password);
  });

  test("should throw if Encrtypter throws", () => {
    const { encrypterStub, sut } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.create(makeAccountData());
    expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(addAccountRepositoryStub, "create");
    await sut.create(makeAccountData());
    expect(createSpy).toHaveBeenCalled();
  });

  test("should throw if AddAcountRepository throws", () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "create")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.create(makeAccountData());
    expect(promise).rejects.toThrow();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.create(makeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
