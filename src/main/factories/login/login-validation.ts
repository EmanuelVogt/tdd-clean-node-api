
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator.adapter'

export const makeLoginValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []

  const requiredFields = [
    "email",
    "password",
  ]
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}