import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../../presentation/protocols'
import { Validation } from '../../presentation/protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValiodator: EmailValidator
  ) { }

  validate (input: any): Error {
    const isValid = this.emailValiodator.ensureIsValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
