import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValiodator: EmailValidator

  constructor(fieldName: string, emailValiodator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValiodator = emailValiodator
  }

  validate(input: any): Error {
    const isValid = this.emailValiodator.ensureIsValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}