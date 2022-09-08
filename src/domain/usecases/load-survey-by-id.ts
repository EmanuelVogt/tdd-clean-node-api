import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  loadById: (id: string) => Promise<SurveyModel>
}
