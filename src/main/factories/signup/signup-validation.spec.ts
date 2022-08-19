import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-fields-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidator } from '../../../presentation/protocols';
import { makeSignupValidationFactory } from './signup-validation'

jest.mock("../../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    ensureIsValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignupValidation Factory', () => {
  test('should call ValidationComposite with all validation fields', () => {
    makeSignupValidationFactory()
    const validations: Validation[] = []

    const requiredFields = [
      "email",
      "name",
      "password",
      "passwordConfirmation"
    ]
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});