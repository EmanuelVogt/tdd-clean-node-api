import { CreateSurvey, CreateSurveyModel, HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  createSurveyStub: CreateSurvey
}
const makeCreateSurvey = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create (surveyData: CreateSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new CreateSurveyStub()
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
  const createSurveyStub = makeCreateSurvey()
  const sut = new AddSurveyController(validationStub, createSurveyStub)
  return {
    sut,
    validationStub,
    createSurveyStub
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

  test('should call CreateSurvey with correct value', async () => {
    const { sut, createSurveyStub } = makeSut()
    const spy = jest.spyOn(createSurveyStub, 'create')
    await sut.handle(makeHttpRequest())
    void expect(spy).toHaveBeenCalledWith(
      { answers: [{ answer: 'any_answer', image: 'any_image' }], question: 'any_question' }
    )
    void expect(spy).not.toHaveBeenCalledWith({})
  })
})
