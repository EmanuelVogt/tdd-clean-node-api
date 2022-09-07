import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../presentation/protocols'
import { makeSignupValidationFactory } from './signup-validation'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    ensureIsValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidation Factory', () => {
  test('should call ValidationComposite with all validation fields', () => {
    makeSignupValidationFactory()
    const validations: Validation[] = []

    const requiredFields = [
      'email',
      'name',
      'password',
      'passwordConfirmation'
    ]
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
