import { EmailValidatorAdapter } from "./email-validator.adapter";

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.ensureIsValid("invalid@mail.com");
    expect(isValid).toBe(false);
  });
});
