import bcrypt from "bcrypt";
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
describe("Bcrypt adapter", () => {
  test("should calls Bcrypt with correct value", async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
});
