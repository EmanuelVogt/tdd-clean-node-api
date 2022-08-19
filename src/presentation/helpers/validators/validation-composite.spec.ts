import { MissingParamError } from '../../errors';
import { ValidationComposite } from './validation-composite'
import { Validation } from '../../protocols/validation'

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: "any_value" })
    expect(error).toEqual(new MissingParamError('field'))
  });

  test('should return the first error if more than one   validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: "any_value" })
    expect(error).toEqual(new Error())
    expect(error).not.toEqual(new MissingParamError('field'))
  });

  test('should return if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: "any_value" })
    expect(error).toBeFalsy
  });
});