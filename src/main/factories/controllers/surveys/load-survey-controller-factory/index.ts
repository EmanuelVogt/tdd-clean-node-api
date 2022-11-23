
import { DbLoadSurveys } from '@/data/usecases/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-repository/survey-repository'
import LoadSurveysController from '@/presentation/controllers/survey/load-surveys/load-surveys.controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveyRepository = new SurveyMongoRepository()
  const loadSurvey = new DbLoadSurveys(loadSurveyRepository)
  return new LoadSurveysController(loadSurvey)
}
