import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (values: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
