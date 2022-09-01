import { AddSurveyModel } from '../../../domain/usecases/add-survey'

export interface AddSurveyRepository {
  create: (values: AddSurveyModel) => Promise<void>
}
