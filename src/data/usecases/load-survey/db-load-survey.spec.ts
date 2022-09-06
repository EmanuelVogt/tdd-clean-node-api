
import MockDate from 'mockdate'
import { DbLoadSurvey } from './db-load-survey'
import { LoadSurveyRepository, SurveyModel } from './protocols'

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
})
