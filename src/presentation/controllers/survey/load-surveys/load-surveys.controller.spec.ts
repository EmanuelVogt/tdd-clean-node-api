import LoadSurveysController from './load-surveys.controller'
import { LoadSurveys, SurveyModel } from './protocols'
import MockDate from 'mockdate'
import { ok } from '../../../helpers/http'

const makeFakeSurveys = (): SurveyModel[] => {
  return [

    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    },
    {
      id: 'any_id1',
      question: 'any_question1',
      answers: [{
        image: 'any_image1',
        answer: 'any_answer1'
      }],
      date: new Date()
    },
    {
      id: 'any_id2',
      question: 'any_question2',
      answers: [{
        image: 'any_image2',
        answer: 'any_answer2'
      }],
      date: new Date()
    }
  ]
}

const makeLoadSurvey = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysStub()
}
interface SutTypes {
  sut: LoadSurveysController
  loadSurveyStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurvey()
  const sut = new LoadSurveysController(loadSurveyStub)
  return { sut, loadSurveyStub }
}
describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should calls LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const spy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(spy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(ok(makeFakeSurveys()))
  })
})
