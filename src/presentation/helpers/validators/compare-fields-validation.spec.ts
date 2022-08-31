import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface SutTypes {
  sut: CompareFieldsValidation
}
const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('field', 'field_two')

  return {
    sut
  }
}
describe('CompareFieldsValidation', () => {
  test('should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value', field_two: 'any_value_two' })
    expect(error).toEqual(new InvalidParamError('field_two'))
  })

  test('should not return MissingParamError if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'field', field_two: 'field' })
    expect(error).toBeFalsy()
  })
})
