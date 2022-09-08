import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-fields-validation'

type SutTypes = {
  sut: RequiredFieldValidation
}
const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field')

  return {
    sut
  }
}
describe('Required FieldValidation', () => {
  test('should return MissingParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return MissingParamError if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'field' })
    expect(error).toBeFalsy()
  })
})
