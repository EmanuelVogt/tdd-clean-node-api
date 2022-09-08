import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  createSurveyStub: AddSurvey
}

const makeCreateSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
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
      }],
      date: new Date()
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
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const spy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeHttpRequest())
    void expect(spy).toHaveBeenCalledWith(
      { answers: [{ answer: 'any_answer', image: 'any_image' }], question: 'any_question', date: new Date() }
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
    const spy = jest.spyOn(createSurveyStub, 'add')
    await sut.handle(makeHttpRequest())
    void expect(spy).toHaveBeenCalledWith(
      { answers: [{ answer: 'any_answer', image: 'any_image' }], question: 'any_question', date: new Date() }
    )
    void expect(spy).not.toHaveBeenCalledWith({})
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, createSurveyStub } = makeSut()
    jest.spyOn(createSurveyStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
