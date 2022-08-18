import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignupValidationFactory } from './signup-validation'

jest.mock("../../presentation/helpers/validators/validation-composite")

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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});