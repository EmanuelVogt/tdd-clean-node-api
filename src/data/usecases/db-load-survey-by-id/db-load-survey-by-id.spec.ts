
import MockDate from 'mockdate'
import { DbLoadSurveyById } from '.'
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

  test('should LoadSurveyByIdRepository returns an survey if succeeds', async () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRespositoryStub, 'loadById')
    const response = await sut.loadById('any_id')
    void expect(response).toEqual({
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    })
  })

  test('should throw if LoadSurveyRepository throws', () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRespositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.loadById('any_id')
    void expect(promise).rejects.toThrow()
  })
})
