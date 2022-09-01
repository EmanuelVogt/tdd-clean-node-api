import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('AddSurvey controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const spy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeHttpRequest())
    void expect(spy).toHaveBeenCalledWith(
      { answers: [{ answer: 'any_answer', image: 'any_image' }], question: 'any_question' }
    )
    void expect(spy).not.toHaveBeenCalledWith({})
  })

  test('should returns 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
