
import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/repositories/survey-repository/survey-repository'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSurveyValidationFactory } from './add-survey-validation'

export const makeAddSurveyController = (): Controller => {
  const addSurveyRepository = new SurveyMongoRepository()
  const addSurvey = new DbAddSurvey(addSurveyRepository)
  return new AddSurveyController(makeSurveyValidationFactory(), addSurvey)
}
