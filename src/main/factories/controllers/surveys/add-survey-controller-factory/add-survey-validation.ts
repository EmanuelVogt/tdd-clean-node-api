
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const makeSurveyValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []

  const requiredFields = [
    'question',
    'answers'
  ]
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
