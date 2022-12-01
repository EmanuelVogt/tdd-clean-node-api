import { SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (values: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(values)
  }
}
