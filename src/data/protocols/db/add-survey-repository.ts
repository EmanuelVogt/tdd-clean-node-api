import { AddSurveyModel } from '../../../domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (values: AddSurveyModel) => Promise<void>
}
