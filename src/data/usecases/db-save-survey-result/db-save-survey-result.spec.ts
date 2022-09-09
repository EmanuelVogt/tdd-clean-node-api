
import { DbSaveSurveyResult } from '.'
import MockDate from 'mockdate'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './protocols'

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => (
  {
    accountId: 'any_account',
    answer: 'any_answer',
    surveyId: 'any_survey_id',
    date: new Date()
  }
)

const makeFakeSurveyResult = (): SurveyResultModel => (
  {
    id: 'any_id',
    accountId: 'any_account',
    answer: 'any_answer',
    surveyId: 'any_survey_id',
    date: new Date()
  }
)

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (values: SurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(makeFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}
describe('DbAddSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const spy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSaveSurveyResultData())
    void expect(spy).toHaveBeenCalledWith(makeFakeSaveSurveyResultData())
    void expect(spy).not.toHaveBeenCalledWith({})
  })
})
