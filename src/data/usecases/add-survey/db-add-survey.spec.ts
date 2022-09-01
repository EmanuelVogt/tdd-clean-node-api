
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

const makeFakeSurvey = (): AddSurveyModel => (
  {
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }]
  }
)

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async create (values: AddSurveyModel): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const addSurveyRepository = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)

  return {
    sut,
    addSurveyRepository
  }
}
describe('DbAddSurvey', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const spy = jest.spyOn(addSurveyRepository, 'create')
    await sut.create(makeFakeSurvey())
    void expect(spy).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }]
    })
    void expect(spy).not.toHaveBeenCalledWith({})
  })

  test('should throw if AddSurveyRepository throws', () => {
    const { sut, addSurveyRepository } = makeSut()
    jest
      .spyOn(addSurveyRepository, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeFakeSurvey())
    void expect(promise).rejects.toThrow()
  })
})
