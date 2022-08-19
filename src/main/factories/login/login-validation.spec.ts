import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols';
import { makeLoginValidationFactory } from './login-validation'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators';

jest.mock("../../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    ensureIsValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validation fields', () => {
    makeLoginValidationFactory()
    const validations: Validation[] = []

    const requiredFields = [
      "email",
      "password",
    ]

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});