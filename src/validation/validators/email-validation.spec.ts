import { EmailValidation } from './email-validation'
import { EmailValidator } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    ensureIsValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('should return an error if EmailValidator retruns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'ensureIsValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_email' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const ensureIsValidSpy = jest.spyOn(emailValidatorStub, 'ensureIsValid')
    sut.validate({ email: 'any_email@email.com' })
    expect(ensureIsValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest
      .spyOn(emailValidatorStub, 'ensureIsValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    expect(sut.validate).toThrow()
  })
})
