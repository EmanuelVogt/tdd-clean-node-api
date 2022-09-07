import { Validation } from '../../../../../presentation/protocols/validation'
import { makeSurveyValidationFactory } from './add-survey-validation'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validation fields', () => {
    makeSurveyValidationFactory()
    const validations: Validation[] = []

    const requiredFields = [
      'question',
      'answers'
    ]
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
