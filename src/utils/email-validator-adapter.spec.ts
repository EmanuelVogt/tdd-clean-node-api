import { EmailValidatorAdapter } from "./email-validator.adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  test("should return false if provided an invalid email", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.ensureIsValid("invalide@mail.com");
    expect(isValid).toBe(false);
  });

  test("should return true if provided an valid email", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.ensureIsValid("valid@mail.com");
    expect(isValid).toBe(true);
  });
});
