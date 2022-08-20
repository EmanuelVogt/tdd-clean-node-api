import bcrypt, { compare } from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

interface SutTypes {
  sut: BcryptAdapter;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return {
    sut,
  };
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("any_hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

describe("Bcrypt adapter", () => {
  test("should call hash with correct value", async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });

  test("should return a valid hash on hash success", async () => {
    const { sut } = makeSut();
    const hash = await sut.hash("any_value");

    expect(hash).toBe("any_hash");
  });

  test("should throw if hash throws", async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash") as unknown as jest.Mock<
      ReturnType<(key: string) => Promise<string>>,
      Parameters<(key: string) => Promise<string>>
    >;
    hashSpy.mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test("should call compare with correct values", async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");

    expect(hashSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });
});
