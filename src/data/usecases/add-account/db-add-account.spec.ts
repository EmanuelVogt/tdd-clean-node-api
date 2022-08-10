import { Encrypter } from "../../protocols/encrypter";
import { DbAddACcount } from "./db-add-account";

interface SutTypes {
  sut: DbAddACcount;
  encrypterStub: Encrypter;
}
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
  const sut = new DbAddACcount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe("DbAddAccount usecase", () => {
  test("should call Encrtypter with correct password", () => {
    const { encrypterStub, sut } = makeSut();
    const ecnryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    sut.create(accountData);
    expect(ecnryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  test("should throw if Encrtypter throws", () => {
    const { encrypterStub, sut } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.create(accountData);
    expect(promise).rejects.toThrow();
  });
});
