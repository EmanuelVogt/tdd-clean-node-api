
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'


export const makeSignupValidationFactory = (): ValidationComposite => {
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

  return new ValidationComposite(validations)
}