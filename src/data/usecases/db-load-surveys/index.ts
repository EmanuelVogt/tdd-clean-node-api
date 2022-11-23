import { LoadSurveyRepository, LoadSurveys, SurveyModel } from './protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveyRepository: LoadSurveyRepository) { }
  async load (): Promise<SurveyModel[]> {
    return await this.loadSurveyRepository.load()
  }
}
