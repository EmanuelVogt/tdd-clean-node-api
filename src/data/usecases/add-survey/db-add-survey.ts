import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) { }
  async create (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.create(surveyData)
    return await new Promise(resolve => resolve())
  }
}
