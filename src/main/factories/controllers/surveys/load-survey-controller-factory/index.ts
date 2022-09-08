
import { DbLoadSurvey } from '@/data/usecases/load-survey/db-load-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-repository/survey-repository'
import LoadSurveysController from '@/presentation/controllers/survey/load-surveys/load-surveys.controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveyRepository = new SurveyMongoRepository()
  const loadSurvey = new DbLoadSurvey(loadSurveyRepository)
  return new LoadSurveysController(loadSurvey)
}
