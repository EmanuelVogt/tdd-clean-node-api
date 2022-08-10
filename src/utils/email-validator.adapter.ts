import { EmailValidator } from "../presentation/protocols/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
  ensureIsValid(email: string): boolean {
    return false;
  }
}
