
import MockDate from 'mockdate'
import { DbLoadSurvey } from './db-load-survey'
import { LoadSurveyRepository, SurveyModel } from './protocols'

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

const makeLoadSurveyRepository = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async load (): Promise<SurveyModel[]> {
      return await new Promise((resolve) => resolve([]))
    }
  }

  return new LoadSurveyRepositoryStub()
}

interface SutTypes {
  loadSurveyRespositoryStub: LoadSurveyRepository
  sut: DbLoadSurvey
}
const makeSut = (): SutTypes => {
  const loadSurveyRespositoryStub = makeLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveyRespositoryStub)

  return {
    sut,
    loadSurveyRespositoryStub
  }
}
describe('DbAddSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRespositoryStub } = makeSut()
    const spy = jest.spyOn(loadSurveyRespositoryStub, 'load')
    await sut.load()
    void expect(spy).toHaveBeenCalled()
  })

  test('should LoadSurveyRepository returns an list of surveys', async () => {
    const { sut, loadSurveyRespositoryStub } = makeSut()
    jest.spyOn(loadSurveyRespositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeSurveys())))
    const response = await sut.load()
    void expect(response).toEqual(makeFakeSurveys())
  })

  test('should throw if LoadSurveyRepository throws', () => {
    const { sut, loadSurveyRespositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyRespositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.load()
    void expect(promise).rejects.toThrow()
  })
})
