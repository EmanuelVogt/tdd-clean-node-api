
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './protocols'

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => resolve({
        id: 'any_id',
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  loadSurveyByIdRespositoryStub: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRespositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRespositoryStub)

  return {
    sut,
    loadSurveyByIdRespositoryStub
  }
}

describe('DbAddSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut()
    const spy = jest.spyOn(loadSurveyByIdRespositoryStub, 'loadById')
    await sut.loadById('any_id')
    void expect(spy).toHaveBeenCalledWith('any_id')
  })
})
