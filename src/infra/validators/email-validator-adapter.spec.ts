import { EmailValidatorAdapter } from './email-validator.adapter'
import validator from 'validator'
import { EmailValidator } from '@/validation/protocols/email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  const makeSut = (): EmailValidator => new EmailValidatorAdapter()

  test('should return false if provided an invalid email', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.ensureIsValid('invalide@mail.com')
    expect(isValid).toBe(false)
  })

  test('should return true if provided an valid email', () => {
    const sut = makeSut()
    const isValid = sut.ensureIsValid('valid@mail.com')
    expect(isValid).toBe(true)
  })

  test('should return true if provided an valid email', () => {
    const sut = makeSut()
    const anyEmail = 'any_email@mail.com'
    const isSpyEmail = jest.spyOn(validator, 'isEmail')
    sut.ensureIsValid(anyEmail)
    expect(isSpyEmail).toHaveBeenCalledWith(anyEmail)
  })
})
