import LoadSurveysController from './load-surveys.controller'
import { LoadSurveys, SurveyModel } from './protocols'

const makeLoadSurvey = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(null))
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
  test('Should calls LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const spy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(spy).toHaveBeenCalled()
  })
})
