import { DbAddACcount } from "./db-add-account";

describe("DbAddAccount usecase", () => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  const encrypterStub = new EncrypterStub();
  const makeSut = () => new DbAddACcount(encrypterStub);

  test("should call encripter Encrtypter with correct password", () => {
    const sut = makeSut();
    const ecnryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    sut.create(accountData);
    expect(ecnryptSpy).toHaveBeenCalledWith(accountData.password);
  });
});
