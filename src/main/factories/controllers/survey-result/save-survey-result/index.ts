
import { DbSaveSurveyResult } from '@/data/usecases/db-save-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey-repository/survey-repository'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories/survey-result-repository'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurveyRepository = new SurveyMongoRepository()
  const saveSurveyResultRepository = new SurveyResultMongoRepository()
  const saveSurveyRepository = new DbSaveSurveyResult(saveSurveyResultRepository)
  return new SaveSurveyResultController(loadSurveyRepository, saveSurveyRepository)
}
