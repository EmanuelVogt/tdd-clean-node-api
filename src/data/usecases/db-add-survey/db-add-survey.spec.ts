import { DbAddSurvey } from '.'
import { AddSurveyParams, AddSurveyRepository } from './protocols'
import MockDate from 'mockdate'

const makeFakeSurvey = (): AddSurveyParams => (
  {
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
  }
)

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (values: AddSurveyParams): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
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
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const spy = jest.spyOn(addSurveyRepository, 'add')
    await sut.add(makeFakeSurvey())
    void expect(spy).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }],
      date: new Date()
    })
    void expect(spy).not.toHaveBeenCalledWith({})
  })

  test('should throw if AddSurveyRepository throws', () => {
    const { sut, addSurveyRepository } = makeSut()
    jest
      .spyOn(addSurveyRepository, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(makeFakeSurvey())
    void expect(promise).rejects.toThrow()
  })
})
