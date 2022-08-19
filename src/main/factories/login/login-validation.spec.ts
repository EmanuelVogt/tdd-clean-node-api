import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-fields-validation';
import { Validation } from '../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidator } from '../../../presentation/protocols';
import { makeLoginValidationFactory } from './login-validation'

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