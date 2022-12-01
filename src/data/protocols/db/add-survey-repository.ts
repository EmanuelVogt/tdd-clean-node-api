import { AddSurveyParams } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (values: AddSurveyParams) => Promise<void>
}
